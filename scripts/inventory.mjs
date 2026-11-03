#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Lists the component-like exports of `@wordpress/components` and
 * `@wordpress/block-editor` from the installed node_modules and writes
 * docs/COMPONENTS.md, one table per package, plus data/inventory.json with the
 * same rows (and each block's name, title and description) for PHP to read.
 *
 * Usage: node scripts/inventory.mjs
 *
 * A component counts as `done` when src/blocks/<Name>/block.json exists and
 * its description says "Exercises the <Name> component from `@wordpress/<package>`"
 * (the convention scripts/scaffold-block.mjs writes). Re-run after adding blocks.
 */
import { createRequire } from 'node:module';
import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join( dirname( fileURLToPath( import.meta.url ) ), '..' );
const require = createRequire( join( ROOT, 'package.json' ) );
const PACKAGES = [ 'components', 'block-editor' ];

const SVG_PRIMITIVES = new Set( [
	'SVG',
	'Path',
	'Circle',
	'G',
	'Rect',
	'Polygon',
	'Line',
	'Defs',
	'LinearGradient',
	'RadialGradient',
	'Stop',
	'Ellipse',
	'ClipPath',
	'Mask',
] );
const HOOK_OR_HOC_NAMES = new Set( [
	'createSlotFill',
	'navigateRegions',
	'privateApis',
	'createCustomColorsHOC',
] );

/**
 * `@wordpress/block-editor` touches `window`/`document` at import time. These
 * stubs are just enough for its module graph to evaluate in plain Node; no
 * component is rendered.
 */
function stubBrowserGlobals() {
	const noop = () => {};
	const element = () => ( {
		style: {},
		classList: { add: noop, remove: noop, contains: () => false },
		sheet: { insertRule: noop, cssRules: [] },
		textContent: '',
		setAttribute: noop,
		getAttribute: () => null,
		appendChild: noop,
		insertBefore: noop,
		removeChild: noop,
		addEventListener: noop,
		removeEventListener: noop,
		querySelector: () => null,
		querySelectorAll: () => [],
	} );
	const doc = {
		...element(),
		createElement: element,
		createElementNS: element,
		createTextNode: element,
		head: element(),
		body: element(),
		documentElement: element(),
	};
	const win = globalThis;
	win.window = win;
	win.document = doc;
	win.navigator ??= { userAgent: 'node' };
	win.matchMedia = () => ( {
		matches: false,
		addListener: noop,
		removeListener: noop,
		addEventListener: noop,
		removeEventListener: noop,
	} );
	win.addEventListener = noop;
	win.removeEventListener = noop;
	win.requestAnimationFrame = ( callback ) => setTimeout( callback, 0 );
	win.cancelAnimationFrame = ( id ) => clearTimeout( id );
	win.getComputedStyle = () => ( {} );
}

function stripPrefix( name ) {
	const match = name.match( /^__(experimental|unstable)(.+)$/ );
	return match
		? { prefix: match[ 1 ], base: match[ 2 ] }
		: { prefix: '', base: name };
}

function isReactContext( value ) {
	return (
		!! value &&
		typeof value === 'object' &&
		( String( value.$$typeof ) === 'Symbol(react.context)' ||
			( 'Provider' in value && 'Consumer' in value ) )
	);
}

/**
 * Classifies one export.
 *
 * @param {string}  name  Export name.
 * @param {unknown} value Exported value.
 * @return {{kind: string, base: string, note: string}|null} Row data, or null for non-components.
 */
function classify( name, value ) {
	const { prefix, base } = stripPrefix( name );

	if ( HOOK_OR_HOC_NAMES.has( name ) || /^(use|with)[A-Z]/i.test( base ) ) {
		return { kind: 'hook-or-hoc', base, note: '' };
	}
	if ( isReactContext( value ) ) {
		return { kind: 'hook-or-hoc', base, note: 'React context' };
	}
	// Remaining lower-case or CONSTANT_CASE names are utilities, stores and
	// settings, not components. A prefix hides the casing, so verb-led
	// prefixed names (`__experimentalGetGapCSSValue`) count as utilities too.
	if (
		! /^[A-Z]/.test( base ) ||
		/^[A-Z][A-Z0-9]*_[A-Z0-9_]+$/.test( base ) ||
		( prefix && /^(Get|Is|Has|Parse|Set|Transform)[A-Z]/.test( base ) )
	) {
		return null;
	}
	// Strings are element types (e.g. HorizontalRule is 'hr').
	if ( ! [ 'function', 'object', 'string' ].includes( typeof value ) ) {
		return null;
	}

	const kind = { experimental: 'experimental', unstable: 'unstable' }[
		prefix
	];
	return { kind: kind ?? 'stable', base, note: '' };
}

/** Blocks in src/blocks, keyed by `<package>:<ExportName>`. */
function findBlocks() {
	const blocks = new Map();
	const dir = join( ROOT, 'src', 'blocks' );
	if ( ! existsSync( dir ) ) {
		return blocks;
	}
	for ( const entry of readdirSync( dir, { withFileTypes: true } ) ) {
		const manifest = join( dir, entry.name, 'block.json' );
		if ( ! entry.isDirectory() || ! existsSync( manifest ) ) {
			continue;
		}
		const { description = '' } = JSON.parse(
			readFileSync( manifest, 'utf8' )
		);
		const match = description.match(
			/Exercises the (\S+) component from @wordpress\/([\w-]+)/
		);
		if ( match ) {
			blocks.set( `${ match[ 2 ] }:${ match[ 1 ] }`, entry.name );
		}
	}
	return blocks;
}

/**
 * Rows for data/inventory.json, in the same order as the Markdown tables.
 *
 * @param {Array} results Output of `inventory()` per package.
 * @return {Array<Object>} One object per inventory row.
 */
function toJson( results ) {
	return results.flatMap( ( { pkg, rows } ) =>
		rows.map( ( row ) => {
			const blockDir = row.block ? basename( row.block ) : null;
			const metadata = blockDir
				? JSON.parse(
						readFileSync(
							join( ROOT, row.block, 'block.json' ),
							'utf8'
						)
					)
				: {};
			return {
				package: pkg,
				name: row.name,
				base: row.base,
				kind: row.kind,
				status: row.status,
				blockDir,
				blockName: metadata.name ?? null,
				blockTitle: metadata.title ?? null,
				blockDescription: metadata.description ?? null,
				notes: row.notes,
			};
		} )
	);
}

function inventory( pkg, blocks ) {
	const mod = require( `@wordpress/${ pkg }` );
	const version = require( `@wordpress/${ pkg }/package.json` ).version;
	const names = Object.keys( mod ).sort(
		( a, b ) =>
			stripPrefix( a ).base.localeCompare( stripPrefix( b ).base ) ||
			a.localeCompare( b )
	);

	// The first stable name a value is exported under, so aliases (e.g. a
	// stabilised component still exported with its old __experimental name)
	// point at one block instead of getting their own.
	const canonical = new Map();
	for ( const name of names ) {
		if ( ! name.startsWith( '__' ) && ! canonical.has( mod[ name ] ) ) {
			canonical.set( mod[ name ], name );
		}
	}

	const rows = [];
	const skipped = [];
	for ( const name of names ) {
		const value = mod[ name ];
		const info = classify( name, value );
		if ( ! info ) {
			skipped.push( name );
			continue;
		}
		const notes = info.note ? [ info.note ] : [];
		let status = 'todo';
		let block = '';

		const aliasOf = canonical.get( value );
		if ( aliasOf && aliasOf !== name ) {
			status = 'alias';
			notes.push( `alias of ${ aliasOf }; covered by its block` );
			const aliasBlock = blocks.get( `${ pkg }:${ aliasOf }` );
			block = aliasBlock ? `src/blocks/${ aliasBlock }` : '';
		} else {
			const dir =
				blocks.get( `${ pkg }:${ name }` ) ??
				blocks.get( `${ pkg }:${ info.base }` );
			if ( dir ) {
				status = 'done';
				block = `src/blocks/${ dir }`;
			}
		}
		if ( SVG_PRIMITIVES.has( name ) ) {
			notes.push( 'cover in one SvgPrimitives block' );
		}
		rows.push( {
			name,
			base: info.base,
			kind: info.kind,
			block,
			status,
			notes,
		} );
	}
	return { pkg, version, rows, skipped };
}

function markCrossPackageNames( results ) {
	const byPackage = Object.fromEntries(
		results.map( ( r ) => [
			r.pkg,
			new Set( r.rows.map( ( row ) => row.name ) ),
		] )
	);
	for ( const result of results ) {
		for ( const row of result.rows ) {
			const others = PACKAGES.filter(
				( p ) => p !== result.pkg && byPackage[ p ]?.has( row.name )
			);
			if ( others.length && row.kind !== 'hook-or-hoc' ) {
				row.notes.push(
					`also exported by @wordpress/${ others.join(
						', @wordpress/'
					) }; scaffold with --dir if both get blocks`
				);
			}
		}
	}
}

function render( results ) {
	const kinds = [ 'stable', 'experimental', 'unstable', 'hook-or-hoc' ];
	const lines = [
		'# Component inventory',
		'',
		'Generated by `node scripts/inventory.mjs` from the installed node_modules. Do not edit by hand; re-run the script after adding a block.',
		'',
		'- **Kind**: `stable` (plain name), `experimental` (`__experimental*`), `unstable` (`__unstable*`), or `hook-or-hoc` (hooks, higher-order components, slot/fill factories, contexts and `privateApis`; these usually need no block of their own).',
		'- **Status**: `todo` (no block yet), `done` (a block in `src/blocks` exercises it), or `alias` (same value as another export, which covers it).',
		'- A block counts as done when its `block.json` description reads "Exercises the <Name> component from @wordpress/<package>". See [BLOCK-TEMPLATE.md](BLOCK-TEMPLATE.md).',
		'',
		'## Counts',
		'',
		`| Package | ${ kinds.join( ' | ' ) } | done | todo |`,
		`| --- | ${ kinds.map( () => '---:' ).join( ' | ' ) } | ---: | ---: |`,
	];
	for ( const { pkg, version, rows } of results ) {
		const count = ( predicate ) => rows.filter( predicate ).length;
		lines.push(
			`| @wordpress/${ pkg } ${ version } | ${ kinds
				.map( ( k ) => count( ( r ) => r.kind === k ) )
				.join( ' | ' ) } | ${ count(
				( r ) => r.status === 'done'
			) } | ${ count( ( r ) => r.status === 'todo' ) } |`
		);
	}

	for ( const { pkg, version, rows, skipped } of results ) {
		lines.push(
			'',
			`## @wordpress/${ pkg } ${ version }`,
			'',
			'| Export | Kind | Block | Status | Notes |',
			'| --- | --- | --- | --- | --- |'
		);
		for ( const row of rows ) {
			lines.push(
				`| \`${ row.name }\` | ${ row.kind } | ${
					row.block ? `\`${ row.block }\`` : ''
				} | ${ row.status } | ${ row.notes.join( '; ' ) } |`
			);
		}
		if ( skipped.length ) {
			lines.push(
				'',
				`Not components, so not listed above (utilities, stores, constants): ${ skipped
					.map( ( name ) => `\`${ name }\`` )
					.join( ', ' ) }.`
			);
		}
	}
	return lines.join( '\n' ) + '\n';
}

function main() {
	stubBrowserGlobals();
	const blocks = findBlocks();
	const results = PACKAGES.map( ( pkg ) => inventory( pkg, blocks ) );
	markCrossPackageNames( results );

	const target = join( ROOT, 'docs', 'COMPONENTS.md' );
	mkdirSync( dirname( target ), { recursive: true } );
	writeFileSync( target, render( results ) );

	const dataTarget = join( ROOT, 'data', 'inventory.json' );
	mkdirSync( dirname( dataTarget ), { recursive: true } );
	writeFileSync(
		dataTarget,
		JSON.stringify( toJson( results ), null, '\t' ) + '\n'
	);

	console.log( `Wrote docs/COMPONENTS.md and data/inventory.json` );
	for ( const { pkg, rows, skipped } of results ) {
		const by = ( key, value ) =>
			rows.filter( ( r ) => r[ key ] === value ).length;
		console.log(
			`@wordpress/${ pkg }: stable ${ by(
				'kind',
				'stable'
			) }, experimental ${ by(
				'kind',
				'experimental'
			) }, unstable ${ by( 'kind', 'unstable' ) }, hook-or-hoc ${ by(
				'kind',
				'hook-or-hoc'
			) }; done ${ by( 'status', 'done' ) }, alias ${ by(
				'status',
				'alias'
			) }, todo ${ by( 'status', 'todo' ) }; skipped ${
				skipped.length
			} non-components`
		);
	}
	// Some modules start timers on import; nothing else needs to run.
	process.exit( 0 );
}

main();
