import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalPaletteEdit as PaletteEdit,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

// Palette handed to the duotone variant for picking shadows and highlights.
const COLOR_PALETTE = [
	{ name: 'Black', slug: 'black', color: '#000000' },
	{ name: 'White', slug: 'white', color: '#ffffff' },
	{ name: 'Navy', slug: 'navy', color: '#000097' },
	{ name: 'Coral', slug: 'coral', color: '#ff4747' },
];

// What "Reset" restores. Mirrors the defaults in block.json.
const RESET_VALUES = {
	colors: [
		{ name: 'Ocean', slug: 'ocean', color: '#0073aa' },
		{ name: 'Sunset', slug: 'sunset', color: '#e8590c' },
		{ name: 'Forest', slug: 'forest', color: '#2b8a3e' },
	],
	gradients: [
		{
			name: 'Dusk',
			slug: 'dusk',
			gradient:
				'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(155,81,224) 100%)',
		},
		{
			name: 'Ember',
			slug: 'ember',
			gradient:
				'linear-gradient(135deg,rgb(255,105,0) 0%,rgb(207,46,46) 100%)',
		},
	],
	duotones: [
		{
			name: 'Midnight',
			slug: 'midnight',
			colors: [ '#000097', '#ff4747' ],
		},
		{
			name: 'Grayscale',
			slug: 'grayscale',
			colors: [ '#000000', '#ffffff' ],
		},
	],
};

const KIND_OPTIONS = [
	{ label: 'colors', value: 'colors' },
	{ label: 'gradients', value: 'gradients' },
	{ label: 'duotones', value: 'duotones' },
];

const HEADING_LEVEL_OPTIONS = [ 1, 2, 3, 4, 5, 6 ].map( ( level ) => ( {
	label: String( level ),
	value: String( level ),
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		kind,
		paletteLabel,
		paletteLabelHeadingLevel,
		canOnlyChangeValues,
		canReset,
		slugPrefix,
		emptyMessage,
	} = attributes;

	// The component picks colour, gradient or duotone mode from which of the
	// `colors`, `gradients` and `duotones` props it receives.
	const paletteProps = {
		[ kind ]: attributes[ kind ],
		...( kind === 'duotones' ? { colorPalette: COLOR_PALETTE } : {} ),
		paletteLabel,
		paletteLabelHeadingLevel,
		canOnlyChangeValues,
		canReset,
		slugPrefix,
		emptyMessage,
		// Called with no argument when the user chooses "Reset".
		onChange: ( next ) =>
			setAttributes( { [ kind ]: next ?? RESET_VALUES[ kind ] } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'PaletteEdit', 'component-kitchen-sink' ) }
				>
					<PaletteEdit { ...paletteProps } />
					<SelectControl
						label="colors / gradients / duotones"
						help={ __(
							'Which array prop is passed. This decides the editing mode.',
							'component-kitchen-sink'
						) }
						value={ kind }
						options={ KIND_OPTIONS }
						onChange={ ( next ) => setAttributes( { kind: next } ) }
					/>
					<TextControl
						label="paletteLabel"
						value={ paletteLabel }
						onChange={ ( next ) =>
							setAttributes( { paletteLabel: next } )
						}
					/>
					<SelectControl
						label="paletteLabelHeadingLevel"
						value={ String( paletteLabelHeadingLevel ) }
						options={ HEADING_LEVEL_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( {
								paletteLabelHeadingLevel: Number( next ),
							} )
						}
					/>
					<TextControl
						label="slugPrefix"
						value={ slugPrefix }
						onChange={ ( next ) =>
							setAttributes( { slugPrefix: next } )
						}
					/>
					<TextControl
						label="emptyMessage"
						value={ emptyMessage }
						onChange={ ( next ) =>
							setAttributes( { emptyMessage: next } )
						}
					/>
					<ToggleControl
						label="canOnlyChangeValues"
						checked={ canOnlyChangeValues }
						onChange={ ( next ) =>
							setAttributes( { canOnlyChangeValues: next } )
						}
					/>
					<ToggleControl
						label="canReset"
						checked={ canReset }
						onChange={ ( next ) =>
							setAttributes( { canReset: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>PaletteEdit</h3>
				<PaletteEdit { ...paletteProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
