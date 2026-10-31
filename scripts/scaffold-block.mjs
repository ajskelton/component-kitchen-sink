#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Scaffolds one test block for a component exported by a `@wordpress/*` package.
 *
 * Usage:
 *   node scripts/scaffold-block.mjs <ExportName> [--package components|block-editor] [--experimental] [--dir <DirName>]
 *
 * <ExportName> is the component name without any prefix (e.g. `HStack`).
 * --experimental imports it as `__experimental<ExportName> as <ExportName>`.
 * A prefixed name (`__experimentalHStack`, `__unstableMotion`) is also
 * accepted; the prefix is stripped and the alias import is used.
 * --dir overrides the block directory (and block slug) for the rare names
 * exported by both packages, e.g. `--package block-editor --dir BlockEditorColorPalette`.
 *
 * Creates src/blocks/<DirName>/ with block.json, index.js, edit.js,
 * render.php, editor.scss and style.scss. Refuses to overwrite.
 * See docs/BLOCK-TEMPLATE.md for the conventions these files follow.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = join( dirname( fileURLToPath( import.meta.url ) ), '..' );
const PACKAGES = [ 'components', 'block-editor' ];
const TEXT_DOMAIN = 'component-kitchen-sink';

function fail( message ) {
	console.error( `scaffold-block: ${ message }` );
	console.error(
		'Usage: node scripts/scaffold-block.mjs <ExportName> [--package components|block-editor] [--experimental] [--dir <DirName>]'
	);
	process.exit( 1 );
}

function parseArgs( argv ) {
	const options = { pkg: 'components', prefix: '', dir: null, name: null };
	for ( let i = 0; i < argv.length; i++ ) {
		const arg = argv[ i ];
		if ( arg === '--experimental' ) {
			options.prefix = '__experimental';
		} else if ( arg === '--package' || arg.startsWith( '--package=' ) ) {
			options.pkg = arg.includes( '=' )
				? arg.split( '=' )[ 1 ]
				: argv[ ++i ];
		} else if ( arg === '--dir' || arg.startsWith( '--dir=' ) ) {
			options.dir = arg.includes( '=' )
				? arg.split( '=' )[ 1 ]
				: argv[ ++i ];
		} else if ( arg === '-h' || arg === '--help' ) {
			fail( 'help requested' );
		} else if ( arg.startsWith( '-' ) ) {
			fail( `unknown option ${ arg }` );
		} else if ( options.name ) {
			fail( `unexpected argument ${ arg }` );
		} else {
			options.name = arg;
		}
	}

	if ( ! options.name ) {
		fail( 'missing <ExportName>' );
	}
	if ( ! PACKAGES.includes( options.pkg ) ) {
		fail( `--package must be one of ${ PACKAGES.join( ', ' ) }` );
	}

	const prefixMatch = options.name.match(
		/^(__experimental|__unstable)(.+)$/
	);
	if ( prefixMatch ) {
		options.prefix = prefixMatch[ 1 ];
		options.name = prefixMatch[ 2 ];
	}
	if ( ! /^[A-Z][A-Za-z0-9]*$/.test( options.name ) ) {
		fail( `"${ options.name }" is not a PascalCase component name` );
	}
	options.dir = options.dir || options.name;
	if ( ! /^[A-Z][A-Za-z0-9]*$/.test( options.dir ) ) {
		fail( `--dir "${ options.dir }" must be PascalCase` );
	}
	return options;
}

/**
 * Converts a PascalCase name to kebab-case.
 * `AlignmentMatrixControl` -> `alignment-matrix-control`, `URLInput` -> `url-input`.
 *
 * @param {string} name PascalCase name.
 * @return {string} kebab-case name.
 */
function kebabCase( name ) {
	return name
		.replace( /([a-z0-9])([A-Z])/g, '$1-$2' )
		.replace( /([A-Z]+)([A-Z][a-z])/g, '$1-$2' )
		.toLowerCase();
}

/*
 * Minimal working uses that are safe to generate without knowing more about the
 * component. Each entry renders the component bound to the string `value`
 * attribute (or with static demo props). Anything not listed gets a
 * TextControl placeholder instead. Keys are `<package>:<ExportName>`.
 */
const BIND = "onChange={ ( next ) => setAttributes( { value: next ?? '' } ) }";
const DEMO_OPTIONS = `options={ [
	{ label: 'One', value: 'one' },
	{ label: 'Two', value: 'two' },
	{ label: 'Three', value: 'three' },
] }`;
const KNOWN_USES = {
	'components:AlignmentMatrixControl': `<NAME value={ value || 'center center' } ${ BIND } />`,
	'components:Button': `<NAME variant="secondary" onClick={ () => setAttributes( { value: new Date().toISOString() } ) }>
	{ __( 'Click me', '${ TEXT_DOMAIN }' ) }
</NAME>`,
	'components:CheckboxControl': `<NAME label="NAME" checked={ value === 'true' } onChange={ ( next ) => setAttributes( { value: next ? 'true' : 'false' } ) } />`,
	'components:ColorIndicator': `<NAME colorValue={ value || '#3858e9' } />`,
	'components:ColorPicker': `<NAME color={ value || undefined } ${ BIND } />`,
	'components:ComboboxControl': `<NAME label="NAME" value={ value } ${ DEMO_OPTIONS } ${ BIND } />`,
	'components:Dashicon': `<NAME icon="smiley" />`,
	'components:DatePicker': `<NAME currentDate={ value || undefined } ${ BIND } />`,
	'components:DateTimePicker': `<NAME currentDate={ value || undefined } ${ BIND } />`,
	'components:ExternalLink': `<NAME href="https://wordpress.org">wordpress.org</NAME>`,
	'components:FormToggle': `<NAME checked={ value === 'true' } onChange={ () => setAttributes( { value: value === 'true' ? 'false' : 'true' } ) } />`,
	'components:HorizontalRule': `<NAME />`,
	'components:Notice': `<NAME status="info" isDismissible={ false }>NAME</NAME>`,
	'components:ProgressBar': `<NAME />`,
	'components:RadioControl': `<NAME label="NAME" selected={ value } ${ DEMO_OPTIONS } ${ BIND } />`,
	'components:SearchControl': `<NAME label="NAME" value={ value } ${ BIND } />`,
	'components:SelectControl': `<NAME label="NAME" value={ value } ${ DEMO_OPTIONS } ${ BIND } />`,
	'components:Spinner': `<NAME />`,
	'components:TextControl': `<NAME label="NAME" value={ value } ${ BIND } />`,
	'components:TextareaControl': `<NAME label="NAME" value={ value } ${ BIND } />`,
	'components:TimePicker': `<NAME currentTime={ value || undefined } ${ BIND } />`,
	'components:Tip': `<NAME>NAME</NAME>`,
	'components:ToggleControl': `<NAME label="NAME" checked={ value === 'true' } onChange={ ( next ) => setAttributes( { value: next ? 'true' : 'false' } ) } />`,
	'components:VisuallyHidden': `<NAME>NAME</NAME>`,
	'components:Heading': `<NAME level={ 4 }>NAME</NAME>`,
	'components:Text': `<NAME>NAME</NAME>`,
	'components:InputControl': `<NAME label="NAME" value={ value } ${ BIND } />`,
	'components:NumberControl': `<NAME label="NAME" value={ value } ${ BIND } />`,
	'components:UnitControl': `<NAME label="NAME" value={ value } ${ BIND } />`,
	'components:Divider': `<NAME />`,
	'block-editor:AlignmentControl': `<NAME value={ value } ${ BIND } />`,
	'block-editor:BlockAlignmentControl': `<NAME value={ value } ${ BIND } />`,
	'block-editor:BlockVerticalAlignmentControl': `<NAME value={ value } ${ BIND } />`,
	'block-editor:JustifyContentControl': `<NAME value={ value } ${ BIND } />`,
	'block-editor:HeightControl': `<NAME label="NAME" value={ value } ${ BIND } />`,
	'block-editor:URLInput': `<NAME label="NAME" value={ value } ${ BIND } />`,
};

function indent( text, tabs ) {
	const pad = '\t'.repeat( tabs );
	return text
		.split( '\n' )
		.map( ( line ) => ( line ? pad + line : line ) )
		.join( '\n' );
}

function importLine( specifiers, source ) {
	const unique = [ ...new Set( specifiers ) ];
	const oneLine = `import { ${ unique.join( ', ' ) } } from '${ source }';`;
	if ( oneLine.length <= 80 ) {
		return oneLine;
	}
	return `import {\n${ unique.map( ( s ) => `\t${ s },` ).join( '\n' ) }\n} from '${ source }';`;
}

function buildEdit( { name, pkg, prefix } ) {
	const known = KNOWN_USES[ `${ pkg }:${ name }` ];
	const componentSpecifier = prefix
		? `${ prefix }${ name } as ${ name }`
		: name;

	const editorImports = [ 'InspectorControls', 'useBlockProps' ];
	const componentImports = [ 'PanelBody' ];
	let usage;

	if ( known ) {
		usage = known.replace( /NAME/g, name );
		const target =
			pkg === 'block-editor' ? editorImports : componentImports;
		if ( ! target.includes( name ) ) {
			target.unshift( componentSpecifier );
		}
	} else {
		componentImports.push( 'TextControl' );
		usage = [
			`{ /* Placeholder: replace with ${ name } from @wordpress/${ pkg }:`,
			`import { ${ componentSpecifier } } from '@wordpress/${ pkg }'; */ }`,
			'<TextControl',
			'\tlabel="value"',
			'\tvalue={ value }',
			`\t${ BIND }`,
			'/>',
		].join( '\n' );
	}

	// Wrap the import of a prefixed (experimental/unstable) API in an eslint
	// exemption: exercising those APIs is the point of this plugin.
	const unsafe = ( line, forPackage ) =>
		known && prefix && pkg === forPackage
			? `${ UNSAFE_DISABLE }\n${ line }\n${ UNSAFE_ENABLE }`
			: line;
	const imports = [
		`import { __ } from '@wordpress/i18n';`,
		unsafe(
			importLine(
				editorImports.sort( sortSpecifiers ),
				'@wordpress/block-editor'
			),
			'block-editor'
		),
		unsafe(
			importLine(
				componentImports.sort( sortSpecifiers ),
				'@wordpress/components'
			),
			'components'
		),
		`import './editor.scss';`,
	].join( '\n' );
	const params = usage.includes( 'setAttributes' )
		? '{ attributes, setAttributes }'
		: '{ attributes }';
	const destructure = /\bvalue\b/.test( usage.replace( /value:/g, '' ) )
		? '\tconst { value } = attributes;\n\n'
		: '';

	return `${ imports }

export default function Edit( ${ params } ) {
${ destructure }	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( '${ name }', '${ TEXT_DOMAIN }' ) }>
					{ /* TODO: exercise ${ name } here */ }
${ indent( usage, 5 ) }
					{ /* END TODO: exercise ${ name } here */ }
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>${ name }</h3>
				{ /* TODO: canvas demo */ }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
`;
}

const UNSAFE_DISABLE =
	'/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */';
const UNSAFE_ENABLE = '/* eslint-enable @wordpress/no-unsafe-wp-apis */';

function sortSpecifiers( a, b ) {
	const key = ( s ) =>
		s.replace( /^__(experimental|unstable)/, '' ).split( ' ' )[ 0 ];
	return key( a ).localeCompare( key( b ) );
}

function buildBlockJson( { name, pkg, dir } ) {
	return (
		JSON.stringify(
			{
				$schema: 'https://schemas.wp.org/trunk/block.json',
				apiVersion: 3,
				name: `ajs/${ kebabCase( dir ) }`,
				version: '0.1.0',
				title: name,
				category: 'ajs-kitchen-sink',
				icon: 'smiley',
				description: `Exercises the ${ name } component from @wordpress/${ pkg }`,
				supports: { html: false },
				attributes: { value: { type: 'string', default: '' } },
				textdomain: TEXT_DOMAIN,
				editorScript: 'file:./index.js',
				editorStyle: 'file:./index.css',
				style: 'file:./style-index.css',
				render: 'file:./render.php',
			},
			null,
			'\t'
		) + '\n'
	);
}

const INDEX_JS = `import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: Edit,
} );
`;

function buildRender( { name, dir } ) {
	return `<?php
/**
 * Server render for the ajs/${ kebabCase( dir ) } block (${ name }).
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<h3><?php echo esc_html( '${ name }' ); ?></h3>
	<pre><?php echo esc_html( (string) wp_json_encode( $attributes, JSON_PRETTY_PRINT ) ); ?></pre>
</div>
`;
}

const EDITOR_SCSS = ( name ) => `/**
 * ${ name } block: styles applied inside the editor only.
 *
 * Keep selectors scoped to .wp-block-ajs-*; never add global styles.
 */
`;

const STYLE_SCSS = ( name ) => `/**
 * ${ name } block: styles applied on the front end and in the editor.
 *
 * Keep selectors scoped to .wp-block-ajs-*; never add global styles.
 */
`;

function main() {
	const options = parseArgs( process.argv.slice( 2 ) );
	const target = join( ROOT, 'src', 'blocks', options.dir );

	if ( existsSync( target ) ) {
		fail(
			`${ relative( ROOT, target ) } already exists; refusing to overwrite`
		);
	}

	const files = {
		'block.json': buildBlockJson( options ),
		'index.js': INDEX_JS,
		'edit.js': buildEdit( options ),
		'render.php': buildRender( options ),
		'editor.scss': EDITOR_SCSS( options.name ),
		'style.scss': STYLE_SCSS( options.name ),
	};

	mkdirSync( target, { recursive: true } );
	for ( const [ file, contents ] of Object.entries( files ) ) {
		writeFileSync( join( target, file ), contents, { flag: 'wx' } );
	}

	// Normalise formatting with the project's Prettier config when available.
	const wpScripts = join( ROOT, 'node_modules', '.bin', 'wp-scripts' );
	if ( existsSync( wpScripts ) ) {
		spawnSync( wpScripts, [ 'format', relative( ROOT, target ) ], {
			cwd: ROOT,
			stdio: 'ignore',
		} );
	}

	console.log( `Created ${ relative( ROOT, target ) }/` );
	for ( const file of Object.keys( files ) ) {
		console.log( `  ${ file }` );
	}
	console.log(
		`Block ajs/${ kebabCase( options.dir ) } imports ${
			options.prefix ? options.prefix + options.name + ' as ' : ''
		}${ options.name } from @wordpress/${ options.pkg }. Run npm run build.`
	);
}

main();
