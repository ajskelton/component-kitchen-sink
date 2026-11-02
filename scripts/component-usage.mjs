#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Finds which WordPress core blocks import which components, by scanning the
 * source of the installed `@wordpress/block-library` and writing
 * data/usage.json.
 *
 * Usage: node scripts/component-usage.mjs
 *
 * Every folder in block-library/src with a block.json is one core block. Each
 * `import { A, __experimentalB as B } from '@wordpress/components'` (or
 * `@wordpress/block-editor`) in its js/jsx/ts/tsx files is recorded under
 * `<package>:<ImportedName>`, keyed by the name before any `as` alias, so it
 * matches the `name` column of data/inventory.json. Imports in folders without
 * a block.json (utils/, ...) go under `shared`. test/, stories/ and __mocks__/
 * directories are skipped; `import *` and side-effect imports are ignored.
 */
import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join( dirname( fileURLToPath( import.meta.url ) ), '..' );
const require = createRequire( join( ROOT, 'package.json' ) );
const LIBRARY = dirname(
	require.resolve( '@wordpress/block-library/package.json' )
);
const SRC = join( LIBRARY, 'src' );
const PACKAGES = [ 'components', 'block-editor' ];
const SKIPPED_DIRS = new Set( [ 'test', 'stories', '__mocks__' ] );
const SOURCE_FILE = /\.(js|jsx|ts|tsx)$/;

/** Every import statement with a `{ ... }` clause, with comments stripped first. */
const NAMED_IMPORT =
	/import\s+(?:type\s+)?(?:[\w$]+\s*,\s*)?\{([^}]*)\}\s*from\s*['"]@wordpress\/(components|block-editor)['"]/g;

function stripComments( source ) {
	return source
		.replace( /\/\*[\s\S]*?\*\//g, '' )
		.replace( /(^|[^:'"`\\])\/\/.*$/gm, '$1' );
}

/**
 * Names imported from the two packages by one file.
 *
 * @param {string} source File contents.
 * @return {Set<string>} `<package>:<ImportedName>` keys.
 */
function importedComponents( source ) {
	const keys = new Set();
	for ( const [ , clause, pkg ] of stripComments( source ).matchAll(
		NAMED_IMPORT
	) ) {
		for ( const specifier of clause.split( ',' ) ) {
			const name = specifier
				.trim()
				.replace( /^type\s+/, '' )
				.split( /\s+as\s+/ )[ 0 ]
				.trim();
			if ( name ) {
				keys.add( `${ pkg }:${ name }` );
			}
		}
	}
	return keys;
}

function sourceFiles( dir ) {
	const files = [];
	for ( const entry of readdirSync( dir, { withFileTypes: true } ) ) {
		if ( entry.isDirectory() ) {
			if ( ! SKIPPED_DIRS.has( entry.name ) ) {
				files.push( ...sourceFiles( join( dir, entry.name ) ) );
			}
		} else if ( SOURCE_FILE.test( entry.name ) ) {
			files.push( join( dir, entry.name ) );
		}
	}
	return files;
}

/**
 * Counts imports from the two packages that `importedComponents` did not see
 * (`import *`, default and side-effect imports), for the report.
 *
 * @param {string} source File contents.
 * @return {number} Number of unparsed import statements.
 */
function unparsedImports( source ) {
	const all =
		stripComments( source ).match(
			/\bfrom\s*['"]@wordpress\/(components|block-editor)['"]/g
		) ?? [];
	const named = [ ...stripComments( source ).matchAll( NAMED_IMPORT ) ];
	return all.length - named.length;
}

function main() {
	const { version } = JSON.parse(
		readFileSync( join( LIBRARY, 'package.json' ), 'utf8' )
	);
	const components = {};
	const shared = {};
	const ignored = [];
	let scanned = 0;

	// Folder (relative to src) -> core block metadata, or null when it has no block.json.
	const blocks = new Map();
	for ( const entry of readdirSync( SRC, { withFileTypes: true } ) ) {
		const manifest = join( SRC, entry.name, 'block.json' );
		if ( entry.isDirectory() && existsSync( manifest ) ) {
			const { name, title } = JSON.parse(
				readFileSync( manifest, 'utf8' )
			);
			blocks.set( entry.name, { name, title } );
		}
	}

	const files = sourceFiles( SRC ).sort();
	const byBlock = new Map();
	for ( const file of files ) {
		const path = relative( SRC, file ).split( sep );
		const source = readFileSync( file, 'utf8' );
		const keys = importedComponents( source );
		scanned++;
		if ( unparsedImports( source ) > 0 ) {
			ignored.push( path.join( '/' ) );
		}
		const block = path.length > 1 ? blocks.get( path[ 0 ] ) : undefined;
		for ( const key of keys ) {
			if ( block ) {
				const perComponent = byBlock.get( key ) ?? new Map();
				const entry = perComponent.get( block.name ) ?? {
					block: block.name,
					title: block.title,
					files: [],
				};
				entry.files.push( path.slice( 1 ).join( '/' ) );
				perComponent.set( block.name, entry );
				byBlock.set( key, perComponent );
			} else {
				( shared[ key ] ??= [] ).push( path.join( '/' ) );
			}
		}
	}

	for ( const key of [ ...byBlock.keys() ].sort() ) {
		components[ key ] = [ ...byBlock.get( key ).values() ].sort( ( a, b ) =>
			a.block.localeCompare( b.block )
		);
	}
	const sortedShared = Object.fromEntries(
		Object.entries( shared ).sort( ( [ a ], [ b ] ) =>
			a.localeCompare( b )
		)
	);

	const target = join( ROOT, 'data', 'usage.json' );
	mkdirSync( dirname( target ), { recursive: true } );
	writeFileSync(
		target,
		JSON.stringify(
			{
				blockLibraryVersion: version,
				generatedAt: new Date().toISOString(),
				components,
				shared: sortedShared,
			},
			null,
			'\t'
		) + '\n'
	);

	console.log(
		`Wrote data/usage.json from @wordpress/block-library ${ version }: ${ blocks.size } blocks, ${ scanned } files, ${
			Object.keys( components ).length
		} components used by blocks, ${
			Object.keys( sortedShared ).length
		} only in shared code`
	);
	for ( const pkg of PACKAGES ) {
		const keys = Object.keys( components ).filter( ( k ) =>
			k.startsWith( `${ pkg }:` )
		);
		console.log( `  ${ pkg }: ${ keys.length } components` );
	}
	if ( ignored.length ) {
		console.log(
			`Imports from these files were not parsed (not a named import):\n  ${ ignored.join(
				'\n  '
			) }`
		);
	}
}

main();
