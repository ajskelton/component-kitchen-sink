#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Concatenates every block's built stylesheets into two shared files so the
 * editor loads one editor stylesheet and one front-end stylesheet instead of
 * two per block.
 *
 * Usage: node scripts/combine-styles.mjs   (npm run build runs it last)
 *
 * Reads build/blocks/<Name>/index.css and style-index.css (plus their -rtl
 * twins) and writes build/editor.css, build/editor-rtl.css, build/style.css
 * and build/style-rtl.css. plugin.php points every block at these files when
 * they exist and falls back to the per-block files when they are missing.
 */
import {
	existsSync,
	readFileSync,
	readdirSync,
	statSync,
	writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join( dirname( fileURLToPath( import.meta.url ) ), '..' );
const BUILD_DIR = join( ROOT, 'build' );
const BLOCKS_DIR = join( BUILD_DIR, 'blocks' );

/** Per-block source file → combined output file. */
const BUNDLES = [
	{ source: 'index.css', output: 'editor.css' },
	{ source: 'index-rtl.css', output: 'editor-rtl.css' },
	{ source: 'style-index.css', output: 'style.css' },
	{ source: 'style-index-rtl.css', output: 'style-rtl.css' },
];

if ( ! existsSync( BLOCKS_DIR ) ) {
	console.error( `No ${ BLOCKS_DIR }. Run \`npm run build\` first.` );
	process.exit( 1 );
}

const blockDirs = readdirSync( BLOCKS_DIR )
	.filter( ( name ) => statSync( join( BLOCKS_DIR, name ) ).isDirectory() )
	.sort( ( a, b ) => a.localeCompare( b, 'en', { sensitivity: 'base' } ) );

for ( const { source, output } of BUNDLES ) {
	let css = `/* Combined from build/blocks/*/${ source } by scripts/combine-styles.mjs. Do not edit. */\n`;
	let nonEmpty = 0;

	for ( const dir of blockDirs ) {
		const file = join( BLOCKS_DIR, dir, source );
		if ( ! existsSync( file ) ) {
			continue;
		}
		const content = readFileSync( file, 'utf8' ).trim();
		if ( ! content ) {
			continue;
		}
		css += `/* ${ dir } */\n${ content }\n`;
		nonEmpty++;
	}

	writeFileSync( join( BUILD_DIR, output ), css );
	console.log(
		`build/${ output }: ${ nonEmpty } of ${ blockDirs.length } blocks had ${ source } rules`
	);
}
