#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Builds the release history of every export of `@wordpress/components` and
 * `@wordpress/block-editor`, and writes:
 *
 * - data/history.json: per `<package>:<Export>` row with the package version
 *   and date that introduced it, the first WordPress release that shipped it,
 *   when it was removed, when an `__experimental`/`__unstable` export was
 *   stabilised, its `deprecated()` call, and its CHANGELOG entries.
 * - data/wordpress-releases.json: the `@wordpress/*` versions each WordPress
 *   release (5.0 to 7.1) pins.
 *
 * Usage: node scripts/component-history.mjs [--offline]
 * Behind an HTTP proxy, run it as `NODE_USE_ENV_PROXY=1 node scripts/...`
 * (Node's fetch ignores HTTPS_PROXY otherwise).
 *
 * Sources:
 * - The npm registry `time` map dates every release. Only stable `X.Y.0`
 *   releases (plus the installed version) are scanned.
 * - unpkg serves each scanned release's `src/index.*` (`build-module/index.js`
 *   for components 1.0.0, which ships no `src`). `export * from` is followed
 *   (a few levels deep, block-editor nests them) to build the set of export
 *   names.
 * - raw.githubusercontent.com serves the Gutenberg CHANGELOG.md files, the
 *   wordpress-develop `package.json` of each WordPress branch, and (for
 *   branches that pin Gutenberg by commit) the package versions at that SHA.
 * - The installed node_modules sources are scanned for `deprecated()` calls.
 *
 * Every HTTP response is cached under `.cache/history/`, keyed by URL, so
 * reruns are free. Delete the folder to refresh. `--offline` never touches the
 * network and uses the cache only. Needs registry.npmjs.org, unpkg.com and
 * raw.githubusercontent.com.
 *
 * Caveats: a version is attributed to the first scanned `X.Y.0` release that
 * exports a name, so an export added in a patch release is dated to the next
 * minor. The changelog attributes an entry only when it opens with backticked
 * names followed by a colon.
 */
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join( dirname( fileURLToPath( import.meta.url ) ), '..' );
const require = createRequire( join( ROOT, 'package.json' ) );
const CACHE_DIR = join( ROOT, '.cache', 'history' );
const DATA_DIR = join( ROOT, 'data' );
const OFFLINE = process.argv.includes( '--offline' );
const CONCURRENCY = 8;
const RETRIES = 3;
const MAX_STAR_DEPTH = 4;
const PACKAGES = [ 'components', 'block-editor' ];
const RELEASES_KEY = {
	components: 'components',
	'block-editor': 'blockEditor',
};
const WORDPRESS_BRANCHES = [
	...[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ].map( ( minor ) => `5.${ minor }` ),
	...[ 0, 1, 2, 3, 4, 5, 6, 7, 8 ].map( ( minor ) => `6.${ minor }` ),
	'7.0',
	'7.1',
];
const PREFIX = /^__(?:experimental|unstable)/;
const SOURCE_EXTENSIONS = [ '.js', '.ts', '.tsx' ];

const stats = {
	fetched: 0,
	cached: 0,
	notFound: 0,
	failedUrls: [],
};

/* ------------------------------------------------------------------ HTTP */

let active = 0;
const waiting = [];

/**
 * Waits for one of the CONCURRENCY network slots.
 */
async function acquire() {
	if ( active < CONCURRENCY ) {
		active++;
		return;
	}
	await new Promise( ( resolve ) => waiting.push( resolve ) );
}

/**
 * Hands the slot to the next waiting request, or frees it.
 */
function release() {
	const next = waiting.shift();
	if ( next ) {
		next();
	} else {
		active--;
	}
}

const sleep = ( ms ) => new Promise( ( resolve ) => setTimeout( resolve, ms ) );

const cachePath = ( url ) =>
	join(
		CACHE_DIR,
		`${ url
			.replace( /^https:\/\//, '' )
			.replace( /[^\w.@-]+/g, '_' )
			.slice(
				0,
				100
			) }-${ createHash( 'sha1' ).update( url ).digest( 'hex' ).slice( 0, 10 ) }.json`
	);

const inFlight = new Map();

/**
 * GETs a URL as text through the cache. 200 and 404 responses are cached;
 * 429 and 5xx are retried with backoff and never cached.
 *
 * @param {string} url
 * @return {Promise<{status: number, body: string}>} Status 0 means no response.
 */
function fetchText( url ) {
	if ( ! inFlight.has( url ) ) {
		inFlight.set( url, fetchUncached( url ) );
	}
	return inFlight.get( url );
}

async function fetchUncached( url ) {
	const file = cachePath( url );
	if ( existsSync( file ) ) {
		stats.cached++;
		return JSON.parse( readFileSync( file, 'utf8' ) );
	}
	let result = { status: 0, body: '' };
	if ( ! OFFLINE ) {
		for ( let attempt = 0; attempt <= RETRIES; attempt++ ) {
			if ( attempt > 0 ) {
				await sleep( 500 * 2 ** ( attempt - 1 ) );
			}
			await acquire();
			try {
				const response = await fetch( url, {
					headers: { 'user-agent': 'component-kitchen-sink-history' },
				} );
				result = {
					status: response.status,
					body: await response.text(),
				};
			} catch {
				result = { status: 0, body: '' };
			} finally {
				release();
			}
			if (
				result.status !== 0 &&
				result.status !== 429 &&
				result.status < 500
			) {
				break;
			}
		}
	}
	if ( result.status === 200 || result.status === 404 ) {
		stats.fetched++;
		if ( result.status === 404 ) {
			stats.notFound++;
		}
		writeFileSync( file, JSON.stringify( { url, ...result } ) );
	} else {
		stats.failedUrls.push( url );
	}
	return result;
}

/**
 * Fetches a URL that must exist.
 *
 * @param {string} url
 * @return {Promise<string>} Body.
 */
async function fetchRequired( url ) {
	const { status, body } = await fetchText( url );
	if ( status !== 200 ) {
		throw new Error( `HTTP ${ status } for ${ url }` );
	}
	return body;
}

/**
 * Fetches a URL that may legitimately 404.
 *
 * @param {string} url
 * @return {Promise<string|null>} Body, or null on 404.
 */
async function fetchOptional( url ) {
	const { status, body } = await fetchText( url );
	if ( status === 404 ) {
		return null;
	}
	if ( status !== 200 ) {
		throw new Error( `HTTP ${ status } for ${ url }` );
	}
	return body;
}

/**
 * Runs `worker` over `items` with at most `limit` in flight.
 *
 * @param {Array}                                              items
 * @param {(item: unknown, index: number) => Promise<unknown>} worker
 * @param {number}                                             limit
 * @return {Promise<Array>} Results in item order.
 */
async function pool( items, worker, limit = 16 ) {
	const results = new Array( items.length );
	let next = 0;
	await Promise.all(
		Array.from( { length: Math.min( limit, items.length ) }, async () => {
			while ( next < items.length ) {
				const index = next++;
				results[ index ] = await worker( items[ index ], index );
			}
		} )
	);
	return results;
}

/* ---------------------------------------------------------------- semver */

const parseVersion = ( version ) => {
	const match = /^[\^~>=v\s]*(\d+)\.(\d+)(?:\.(\d+))?/.exec( version ?? '' );
	return match
		? match.slice( 1 ).map( ( part ) => Number( part ?? 0 ) )
		: null;
};

const compareVersions = ( a, b ) => {
	const left = parseVersion( a );
	const right = parseVersion( b );
	for ( let i = 0; i < 3; i++ ) {
		const delta = ( left[ i ] ?? 0 ) - ( right[ i ] ?? 0 );
		if ( delta ) {
			return delta;
		}
	}
	return 0;
};

/**
 * Compares major.minor only.
 *
 * @param {string} a
 * @param {string} b
 * @return {number} Negative, zero or positive.
 */
const compareMinor = ( a, b ) => {
	const left = parseVersion( a );
	const right = parseVersion( b );
	return left[ 0 ] - right[ 0 ] || left[ 1 ] - right[ 1 ];
};

/* ----------------------------------------------------- names and parsing */

const baseKey = ( name ) => {
	const base = name.replace( PREFIX, '' );
	return base.charAt( 0 ).toLowerCase() + base.slice( 1 );
};

/**
 * Removes comments from JS/TS source, leaving string contents intact.
 *
 * @param {string} source
 * @return {string} Source without comments.
 */
function stripComments( source ) {
	let out = '';
	let i = 0;
	while ( i < source.length ) {
		const char = source[ i ];
		const next = source[ i + 1 ];
		if ( char === '/' && next === '/' ) {
			const end = source.indexOf( '\n', i );
			i = end === -1 ? source.length : end;
		} else if ( char === '/' && next === '*' ) {
			const end = source.indexOf( '*/', i + 2 );
			i = end === -1 ? source.length : end + 2;
		} else if ( char === "'" || char === '"' || char === '`' ) {
			let j = i + 1;
			while ( j < source.length && source[ j ] !== char ) {
				if ( source[ j ] === '\\' ) {
					j++;
				} else if ( source[ j ] === '\n' && char !== '`' ) {
					break;
				}
				j++;
			}
			out += source.slice( i, j + 1 );
			i = j + 1;
		} else {
			out += char;
			i++;
		}
	}
	return out;
}

/**
 * Reads the export names of one module.
 *
 * @param {string} source
 * @return {{names: string[], stars: string[]}} Names exported, and the
 *                                              `export * from` specifiers.
 */
function parseModule( source ) {
	const code = stripComments( source );
	const names = [];
	const stars = [];

	for ( const match of code.matchAll(
		/export\s*\*\s*as\s+([\w$]+)\s+from\s*['"][^'"]+['"]/g
	) ) {
		names.push( match[ 1 ] );
	}
	for ( const match of code.matchAll(
		/export\s*\*\s*from\s*['"]([^'"]+)['"]/g
	) ) {
		stars.push( match[ 1 ] );
	}
	for ( const match of code.matchAll( /export\s+(type\s+)?\{([^}]*)\}/g ) ) {
		if ( match[ 1 ] ) {
			continue;
		}
		for ( const piece of match[ 2 ].split( ',' ) ) {
			const item = piece.trim();
			if ( ! item || /^type\s/.test( item ) ) {
				continue;
			}
			const exported = item
				.split( /\s+as\s+/ )
				.pop()
				.trim();
			if ( exported && exported !== 'default' ) {
				names.push( exported );
			}
		}
	}
	for ( const match of code.matchAll(
		/export\s+(?:declare\s+)?(?:async\s+)?(?:const|let|var|function\s*\*?|class)\s+([\w$]+)/g
	) ) {
		names.push( match[ 1 ] );
	}
	return { names, stars };
}

/* -------------------------------------------------------- export history */

const unpkgUrl = ( pkg, version, path ) =>
	`https://unpkg.com/@wordpress/${ pkg }@${ version }/${ path }`;

/**
 * Fetches the first of `candidates` that exists.
 *
 * @param {string}   pkg
 * @param {string}   version
 * @param {string[]} candidates Package-relative paths.
 * @return {Promise<{path: string, source: string}|null>} Null when none exist.
 */
async function fetchFirst( pkg, version, candidates ) {
	for ( const path of candidates ) {
		const source = await fetchOptional( unpkgUrl( pkg, version, path ) );
		if ( source !== null ) {
			return { path, source };
		}
	}
	return null;
}

const moduleCandidates = ( base ) => {
	if ( /\.(?:[cm]?[jt]sx?)$/.test( base ) ) {
		return [ base ];
	}
	return [
		`${ base }.js`,
		`${ base }/index.js`,
		...SOURCE_EXTENSIONS.slice( 1 ).flatMap( ( ext ) => [
			`${ base }${ ext }`,
			`${ base }/index${ ext }`,
		] ),
	];
};

/**
 * Collects the export names of a published version by reading its entry point
 * and following `export * from './x'`.
 *
 * @param {string} pkg
 * @param {string} version
 * @return {Promise<{names: Set<string>, unresolved: string[]}>} Export names.
 */
async function exportsAt( pkg, version ) {
	const entry = await fetchFirst( pkg, version, [
		...SOURCE_EXTENSIONS.map( ( ext ) => `src/index${ ext }` ),
		// The earliest releases (components 1.0.0) ship no `src`.
		'build-module/index.js',
	] );
	if ( ! entry ) {
		throw new Error( 'no src/index.{js,ts,tsx} or build-module/index.js' );
	}
	const names = new Set();
	const unresolved = [];
	const visited = new Set( [ entry.path ] );

	const walk = async ( { path, source }, depth ) => {
		const module = parseModule( source );
		module.names.forEach( ( name ) => names.add( name ) );
		if ( depth >= MAX_STAR_DEPTH ) {
			return;
		}
		for ( const specifier of module.stars ) {
			if ( ! specifier.startsWith( '.' ) ) {
				continue;
			}
			const found = await fetchFirst(
				pkg,
				version,
				moduleCandidates(
					posix.join( posix.dirname( path ), specifier )
				)
			);
			if ( ! found ) {
				unresolved.push( `${ path } -> ${ specifier }` );
			} else if ( ! visited.has( found.path ) ) {
				visited.add( found.path );
				await walk( found, depth + 1 );
			}
		}
	};
	await walk( entry, 0 );
	return { names, unresolved };
}

/**
 * Lists the stable `X.Y.0` releases of a package, plus the installed version.
 *
 * @param {string} pkg
 * @param {string} installed
 * @return {Promise<Array<{version: string, date: string}>>} Ascending.
 */
async function selectVersions( pkg, installed ) {
	const registry = JSON.parse(
		await fetchRequired( `https://registry.npmjs.org/@wordpress/${ pkg }` )
	);
	const stable = Object.keys( registry.time ).filter( ( version ) =>
		/^\d+\.\d+\.\d+$/.test( version )
	);
	return stable
		.filter(
			( version ) => version.endsWith( '.0' ) || version === installed
		)
		.sort( compareVersions )
		.map( ( version ) => ( {
			version,
			date: registry.time[ version ].slice( 0, 10 ),
		} ) );
}

/* ------------------------------------------------------------- changelog */

const PR_URL = /https:\/\/github\.com\/WordPress\/gutenberg\/pull\/\d+/g;
const PR_LINK = String.raw`\[#\d+\]\([^)]*\)`;
const TRAILING_PARENS = new RegExp(
	String.raw`\s*\(\s*${ PR_LINK }(?:\s*[,&]?\s*${ PR_LINK })*\s*\)\s*\.?\s*$`
);
const TRAILING_LINKS = new RegExp(
	String.raw`\s*${ PR_LINK }(?:\s*[,&]?\s*${ PR_LINK })*\s*\.?\s*$`
);

/**
 * Splits a changelog markdown file into `{ version, date, category, raw }`.
 *
 * @param {string} markdown
 * @return {Array<Object>} Entries in file order.
 */
function parseChangelog( markdown ) {
	const entries = [];
	let version = null;
	let date = null;
	let category = null;
	let current = null;
	for ( const line of markdown.split( '\n' ) ) {
		const heading = /^(#{2,4})\s+(.+?)\s*$/.exec( line );
		if ( heading ) {
			current = null;
			if ( heading[ 1 ] === '##' ) {
				category = null;
				const parsed =
					/^v?(\d+\.\d+\.\d+(?:-[\w.]+)?)(?:\s*\((\d{4}-\d{2}-\d{2})\))?/.exec(
						heading[ 2 ]
					);
				if ( /^unreleased/i.test( heading[ 2 ] ) ) {
					version = 'unreleased';
					date = null;
				} else if ( parsed ) {
					version = parsed[ 1 ];
					date = parsed[ 2 ] ?? null;
				} else {
					version = null;
				}
			} else if ( heading[ 1 ] === '###' ) {
				category = heading[ 2 ];
			}
			continue;
		}
		if ( version === null ) {
			continue;
		}
		const bullet = /^(\s*)[-*]\s+(.*)$/.exec( line );
		if ( bullet && ! bullet[ 1 ] ) {
			current = { version, date, category, raw: bullet[ 2 ].trim() };
			entries.push( current );
		} else if ( bullet && current ) {
			current.raw += `\n${ line.trim() }`;
		} else if ( current && /^\s+\S/.test( line ) ) {
			current.raw += ` ${ line.trim() }`;
		}
	}
	return entries;
}

const LEAD_LIMIT = 160;

/**
 * Finds the first `:` that is not inside backticks.
 *
 * @param {string} text
 * @return {number} Index, or -1.
 */
function colonOutsideBackticks( text ) {
	let inCode = false;
	for ( let i = 0; i < text.length; i++ ) {
		if ( text[ i ] === '`' ) {
			inCode = ! inCode;
		} else if ( text[ i ] === ':' && ! inCode ) {
			return i;
		}
	}
	return -1;
}

/**
 * Separates an entry into the names it opens with, its text and its PR URLs.
 *
 * @param {string} raw
 * @return {{names: string[], text: string, prs: string[]}} Parts.
 */
function splitEntry( raw ) {
	const prs = [ ...new Set( raw.match( PR_URL ) ?? [] ) ];
	let names = [];
	let text = raw;
	// An entry is about the backticked names it opens with, up to the first
	// colon outside backticks: "`A`, `B` and `C` (v2): Fix ...".
	const colon = raw.startsWith( '`' ) ? colonOutsideBackticks( raw ) : -1;
	const lead = raw.slice( 0, Math.max( colon, 0 ) );
	if ( colon > 0 && lead.length <= LEAD_LIMIT && ! /\.\s/.test( lead ) ) {
		names = [ ...lead.matchAll( /`([^`]+)`/g ) ].map(
			( match ) => match[ 1 ]
		);
		text = raw.slice( colon + 1 );
	}
	let previous;
	do {
		previous = text;
		text = text
			.replace( TRAILING_PARENS, '' )
			.replace( TRAILING_LINKS, '' );
	} while ( text !== previous );
	return { names, text: text.trim(), prs };
}

/**
 * Reduces a backticked name (`wp.components.Foo`, `<Foo />`, `Foo.Bar`) to `Foo`.
 *
 * @param {string} name
 * @return {string} Root component name.
 */
const rootName = ( name ) =>
	name
		.replace( /^wp\.\w+\./, '' )
		.replace( /[<>/\s]|\(\)/g, '' )
		.split( '.' )[ 0 ];

const sortNewestFirst = ( entries ) =>
	entries
		.map( ( entry, index ) => ( { entry, index } ) )
		.sort( ( a, b ) => {
			const [ left, right ] = [ a.entry.version, b.entry.version ];
			if ( left !== right ) {
				if ( left === 'unreleased' ) {
					return -1;
				}
				if ( right === 'unreleased' ) {
					return 1;
				}
				return compareVersions( right, left );
			}
			return a.index - b.index;
		} )
		.map( ( { entry } ) => entry );

/* ---------------------------------------------------------- deprecations */

const IGNORED_DIRECTORIES = new Set( [
	'test',
	'tests',
	'stories',
	'__snapshots__',
	'__mocks__',
	'docs',
] );

function* sourceFiles( directory ) {
	for ( const entry of readdirSync( directory, { withFileTypes: true } ) ) {
		const path = join( directory, entry.name );
		if ( entry.isDirectory() ) {
			if ( ! IGNORED_DIRECTORIES.has( entry.name ) ) {
				yield* sourceFiles( path );
			}
		} else if (
			/\.(?:jsx?|tsx?|mjs)$/.test( entry.name ) &&
			! /\.(?:test|stories|native)\.|\.d\.ts$/.test( entry.name )
		) {
			yield path;
		}
	}
}

/**
 * Reads a quoted string literal starting at `position`.
 *
 * @param {string} code
 * @param {number} position
 * @return {{value: string, end: number}|null} Value and index after the quote.
 */
function readString( code, position ) {
	const quote = code[ position ];
	if ( quote !== "'" && quote !== '"' && quote !== '`' ) {
		return null;
	}
	let value = '';
	for ( let i = position + 1; i < code.length; i++ ) {
		if ( code[ i ] === '\\' ) {
			value += code[ ++i ];
		} else if ( code[ i ] === quote ) {
			return { value, end: i + 1 };
		} else {
			value += code[ i ];
		}
	}
	return null;
}

/**
 * Returns the text between the `{` at `position` and its matching `}`.
 *
 * @param {string} code
 * @param {number} position
 * @return {string|null} Object body, or null when unbalanced.
 */
function readBraces( code, position ) {
	let depth = 0;
	for ( let i = position; i < code.length; i++ ) {
		const char = code[ i ];
		if ( char === "'" || char === '"' || char === '`' ) {
			i = ( readString( code, i )?.end ?? i + 1 ) - 1;
		} else if ( char === '{' ) {
			depth++;
		} else if ( char === '}' && --depth === 0 ) {
			return code.slice( position + 1, i );
		}
	}
	return null;
}

const readProperty = ( body, key ) => {
	const match = new RegExp( `(?:^|[\\s,{])${ key }\\s*:\\s*(?=['"\`])` ).exec(
		body
	);
	if ( ! match ) {
		return null;
	}
	return readString( body, match.index + match[ 0 ].length )?.value ?? null;
};

/**
 * Finds every `deprecated( 'feature', { ... } )` call in the installed sources.
 *
 * @param {string} pkg
 * @return {Array<Object>} Calls with the file they live in.
 */
function scanDeprecations( pkg ) {
	const sourceRoot = join(
		dirname( require.resolve( `@wordpress/${ pkg }/package.json` ) ),
		'src'
	);
	const calls = [];
	for ( const file of sourceFiles( sourceRoot ) ) {
		const code = stripComments( readFileSync( file, 'utf8' ) );
		for ( const match of code.matchAll(
			/(?<![\w.$])deprecated\s*\(\s*/g
		) ) {
			const feature = readString( code, match.index + match[ 0 ].length );
			if ( ! feature ) {
				continue;
			}
			const after = /^\s*,\s*(?=\{)/.exec( code.slice( feature.end ) );
			const body =
				after && readBraces( code, feature.end + after[ 0 ].length );
			if ( ! body && body !== '' ) {
				continue;
			}
			calls.push( {
				feature: feature.value,
				since: readProperty( body, 'since' ),
				version: readProperty( body, 'version' ),
				alternative: readProperty( body, 'alternative' ),
				plugin: readProperty( body, 'plugin' ),
				hint: readProperty( body, 'hint' ),
				path: file.slice( sourceRoot.length + 1 ),
			} );
		}
	}
	return calls;
}

const kebabToKey = ( directory ) =>
	directory
		.split( '-' )
		.map( ( part, index ) =>
			index ? part.charAt( 0 ).toUpperCase() + part.slice( 1 ) : part
		)
		.join( '' );

/**
 * Picks the exports a `deprecated()` call is about: the names in its feature
 * string, else the export that owns the folder the call lives in.
 *
 * @param {Object}               call
 * @param {Set<string>}          names  Export names of the package.
 * @param {Map<string,string[]>} byBase Export names by base key.
 * @return {{targets: string[], direct: boolean}} Matching export names.
 */
function deprecationTargets( call, names, byBase ) {
	const groups = [
		[ ...call.feature.matchAll( /\bwp\.\w+\.([\w$]+)/g ) ].map(
			( m ) => m[ 1 ]
		),
		[ ...call.feature.matchAll( /<([\w$]+)/g ) ].map( ( m ) => m[ 1 ] ),
		( call.feature.match( /\b(?:__|use|[A-Z])[\w$]*/g ) ?? [] ).filter(
			( token ) => names.has( token )
		),
	];
	for ( const tokens of groups ) {
		const targets = new Set();
		for ( const token of tokens ) {
			if ( names.has( token ) ) {
				targets.add( token );
			} else {
				( byBase.get( baseKey( token ) ) ?? [] ).forEach( ( name ) =>
					targets.add( name )
				);
			}
		}
		if ( targets.size ) {
			return { targets: [ ...targets ], direct: true };
		}
	}
	const directories = dirname( call.path ).split( /[\\/]/ ).reverse();
	for ( const directory of directories ) {
		const match = byBase.get( kebabToKey( directory ) );
		if ( match ) {
			return { targets: match, direct: false };
		}
	}
	return { targets: [], direct: false };
}

/**
 * Chooses one `deprecation` per export: whole-component deprecations beat
 * prop-level ones, direct matches beat folder matches, newer beats older.
 *
 * @param {Array<Object>}        calls
 * @param {Set<string>}          names
 * @param {Map<string,string[]>} byBase
 * @return {Map<string, Object>} Deprecation by export name.
 */
function chooseDeprecations( calls, names, byBase ) {
	const candidates = new Map();
	for ( const call of calls ) {
		const { targets, direct } = deprecationTargets( call, names, byBase );
		const rank = [
			/\bprops?\b/i.test( call.feature ) ? 1 : 0,
			direct ? 0 : 1,
		];
		for ( const target of targets ) {
			if ( ! candidates.has( target ) ) {
				candidates.set( target, [] );
			}
			candidates.get( target ).push( { call, rank } );
		}
	}
	const chosen = new Map();
	for ( const [ name, list ] of candidates ) {
		list.sort(
			( a, b ) =>
				a.rank[ 0 ] - b.rank[ 0 ] ||
				a.rank[ 1 ] - b.rank[ 1 ] ||
				( b.call.since && a.call.since
					? compareVersions( b.call.since, a.call.since )
					: 0 ) ||
				a.call.feature.localeCompare( b.call.feature )
		);
		const { call } = list[ 0 ];
		chosen.set( name, {
			since: call.since,
			version: call.version,
			alternative: call.alternative,
			plugin: call.plugin,
			feature: call.feature,
			hint: call.hint,
		} );
	}
	return chosen;
}

/* ------------------------------------------------------ WordPress release */

const RAW = 'https://raw.githubusercontent.com/WordPress';
const RELEASE_PACKAGES = {
	components: 'components',
	blockEditor: 'block-editor',
	blockLibrary: 'block-library',
};

/**
 * Reads which `@wordpress/*` versions each WordPress branch pins.
 *
 * @return {Promise<Array<Object>>} Ascending by WordPress version.
 */
async function buildReleases() {
	const rows = await pool( WORDPRESS_BRANCHES, async ( branch ) => {
		const body = await fetchOptional(
			`${ RAW }/wordpress-develop/${ branch }/package.json`
		).catch( () => null );
		if ( body === null ) {
			console.warn(
				`! wordpress-develop ${ branch }: package.json unavailable`
			);
			return null;
		}
		const manifest = JSON.parse( body );
		const sha = manifest.gutenberg?.sha;
		const row = { wordpress: branch };
		for ( const [ key, pkg ] of Object.entries( RELEASE_PACKAGES ) ) {
			let version =
				manifest.dependencies?.[ `@wordpress/${ pkg }` ] ?? null;
			if ( version === null && sha ) {
				const pinned = await fetchOptional(
					`${ RAW }/gutenberg/${ sha }/packages/${ pkg }/package.json`
				).catch( () => null );
				version = pinned ? JSON.parse( pinned ).version : null;
			}
			row[ key ] =
				version && parseVersion( version )
					? version.replace( /^[\^~]/, '' )
					: null;
		}
		return row;
	} );
	return rows
		.filter( Boolean )
		.sort( ( a, b ) => compareMinor( a.wordpress, b.wordpress ) );
}

const firstWordPress = ( releases, key, addedVersion ) =>
	releases.find(
		( candidate ) =>
			candidate[ key ] &&
			compareMinor( candidate[ key ], addedVersion ) >= 0
	)?.wordpress ?? null;

/* ------------------------------------------------------------- per package */

/**
 * Builds the history rows for one package.
 *
 * @param {string}        pkg
 * @param {Array<Object>} releases
 * @return {Promise<{info: Object, rows: Object, report: Object}>} Result.
 */
async function buildPackage( pkg, releases ) {
	const installed = require( `@wordpress/${ pkg }/package.json` ).version;
	const versions = await selectVersions( pkg, installed );
	const failedVersions = [];
	const unresolved = [];
	const scans = await pool( versions, async ( entry ) => {
		try {
			const { names, unresolved: missing } = await exportsAt(
				pkg,
				entry.version
			);
			missing.forEach( ( item ) =>
				unresolved.push( `${ entry.version }: ${ item }` )
			);
			return { ...entry, names };
		} catch ( error ) {
			failedVersions.push( `${ entry.version }: ${ error.message }` );
			console.warn( `! ${ pkg }@${ entry.version }: ${ error.message }` );
			return null;
		}
	} );
	const scanned = scans.filter( Boolean );
	if ( ! scanned.length ) {
		throw new Error( `No versions of ${ pkg } could be scanned` );
	}

	const first = new Map();
	const last = new Map();
	scanned.forEach( ( scan, index ) => {
		for ( const name of scan.names ) {
			if ( ! first.has( name ) ) {
				first.set( name, index );
			}
			last.set( name, index );
		}
	} );
	const current = scanned[ scanned.length - 1 ].names;

	const names = new Set( first.keys() );
	const byBase = new Map();
	for ( const name of names ) {
		const key = baseKey( name );
		byBase.set( key, [ ...( byBase.get( key ) ?? [] ), name ] );
	}

	const deprecations = chooseDeprecations(
		scanDeprecations( pkg ),
		names,
		byBase
	);

	const rows = {};
	for ( const name of names ) {
		const added = scanned[ first.get( name ) ];
		let stabilised = null;
		if ( ! PREFIX.test( name ) ) {
			const earlier = byBase
				.get( baseKey( name ) )
				.filter(
					( other ) =>
						PREFIX.test( other ) &&
						first.get( other ) < first.get( name )
				)
				.sort( ( a, b ) => first.get( a ) - first.get( b ) )[ 0 ];
			if ( earlier ) {
				const from = scanned[ first.get( earlier ) ];
				stabilised = {
					from: earlier,
					fromVersion: from.version,
					fromDate: from.date,
					version: added.version,
					date: added.date,
				};
			}
		}
		rows[ `${ pkg }:${ name }` ] = {
			addedVersion: added.version,
			addedDate: added.date,
			firstWordPress: firstWordPress(
				releases,
				RELEASES_KEY[ pkg ],
				added.version
			),
			removedAfter: current.has( name )
				? null
				: scanned[ last.get( name ) ].version,
			stabilised,
			deprecation: deprecations.get( name ) ?? null,
			changelog: [],
		};
	}

	const changelog = await attachChangelog( pkg, rows, byBase );

	return {
		info: {
			installedVersion: installed,
			versionsScanned: scanned.length,
			oldestVersion: scanned[ 0 ].version,
			newestVersion: scanned[ scanned.length - 1 ].version,
		},
		rows,
		report: {
			failedVersions,
			unresolved,
			changelog,
			selected: versions.length,
		},
	};
}

/**
 * Attaches the package CHANGELOG.md entries to the rows they are about.
 *
 * @param {string}               pkg
 * @param {Object}               rows
 * @param {Map<string,string[]>} byBase
 * @return {Promise<Object>} Counts of entries by attribution outcome.
 */
async function attachChangelog( pkg, rows, byBase ) {
	const counts = {
		total: 0,
		attributed: 0,
		noNames: 0,
		unknownNames: 0,
		unknown: new Map(),
	};
	const markdown = await fetchRequired(
		`${ RAW }/gutenberg/trunk/packages/${ pkg }/CHANGELOG.md`
	);
	for ( const entry of sortNewestFirst( parseChangelog( markdown ) ) ) {
		counts.total++;
		const { names, text, prs } = splitEntry( entry.raw );
		if ( ! names.length ) {
			counts.noNames++;
			continue;
		}
		const targets = new Set();
		for ( const name of names ) {
			const matches = byBase.get( baseKey( rootName( name ) ) );
			if ( matches ) {
				matches.forEach( ( match ) => targets.add( match ) );
			} else {
				counts.unknown.set(
					name,
					( counts.unknown.get( name ) ?? 0 ) + 1
				);
			}
		}
		if ( ! targets.size ) {
			counts.unknownNames++;
			continue;
		}
		counts.attributed++;
		for ( const target of targets ) {
			rows[ `${ pkg }:${ target }` ].changelog.push( {
				version: entry.version,
				date: entry.date,
				category: entry.category,
				text,
				prs,
			} );
		}
	}
	return counts;
}

/* ------------------------------------------------------------------ output */

const sortKeys = ( value ) => {
	if ( Array.isArray( value ) ) {
		return value.map( sortKeys );
	}
	if ( value && typeof value === 'object' ) {
		return Object.fromEntries(
			Object.keys( value )
				.sort()
				.map( ( key ) => [ key, sortKeys( value[ key ] ) ] )
		);
	}
	return value;
};

const writeJson = ( file, value ) =>
	writeFileSync(
		join( DATA_DIR, file ),
		`${ JSON.stringify( sortKeys( value ), null, '\t' ) }\n`
	);

async function main() {
	mkdirSync( CACHE_DIR, { recursive: true } );
	mkdirSync( DATA_DIR, { recursive: true } );
	console.log(
		OFFLINE
			? 'Offline: using the cache only.'
			: 'Fetching (cached under .cache/history).'
	);

	const releases = await buildReleases();
	writeJson( 'wordpress-releases.json', releases );
	console.log( `wordpress-releases.json: ${ releases.length } releases` );

	const packages = {};
	const components = {};
	const reports = {};
	for ( const pkg of PACKAGES ) {
		const result = await buildPackage( pkg, releases );
		packages[ pkg ] = result.info;
		Object.assign( components, result.rows );
		reports[ pkg ] = result.report;
	}
	writeJson( 'history.json', {
		generatedAt: new Date().toISOString(),
		packages,
		components,
	} );

	for ( const pkg of PACKAGES ) {
		const info = packages[ pkg ];
		const report = reports[ pkg ];
		const { changelog } = report;
		console.log(
			`\n${ pkg }: ${ info.versionsScanned }/${ report.selected } versions scanned (${ info.oldestVersion } to ${ info.newestVersion }), installed ${ info.installedVersion }`
		);
		report.failedVersions.forEach( ( item ) =>
			console.log( `  failed version ${ item }` )
		);
		if ( report.unresolved.length ) {
			console.log(
				`  ${ report.unresolved.length } unresolved \`export *\` targets, e.g. ${ report.unresolved.slice( 0, 3 ).join( '; ' ) }`
			);
		}
		console.log(
			`  changelog: ${ changelog.total } entries, ${ changelog.attributed } attributed, ${ changelog.noNames } without leading names, ${ changelog.unknownNames } naming no known export`
		);
		const topUnknown = [ ...changelog.unknown ]
			.sort( ( a, b ) => b[ 1 ] - a[ 1 ] )
			.slice( 0, 10 )
			.map( ( [ name, count ] ) => `${ name } (${ count })` );
		if ( topUnknown.length ) {
			console.log(
				`  most common unknown names: ${ topUnknown.join( ', ' ) }`
			);
		}
	}
	console.log(
		`\nHTTP: ${ stats.fetched } fetched (${ stats.notFound } were 404 probes), ${ stats.cached } from cache, ${ stats.failedUrls.length } failed`
	);
	stats.failedUrls.forEach( ( url ) => console.log( `  failed: ${ url }` ) );
}

main().catch( ( error ) => {
	console.error( error );
	process.exit( 1 );
} );
