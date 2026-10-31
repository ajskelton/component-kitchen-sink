import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	ColorPalette,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const COLORS = [
	{ name: 'Ocean', slug: 'ocean', color: '#0073aa' },
	{ name: 'Sunset', slug: 'sunset', color: '#e8590c' },
	{ name: 'Forest', slug: 'forest', color: '#2b8a3e' },
	{ name: 'Plum', slug: 'plum', color: '#862e9c' },
	{ name: 'Slate', slug: 'slate', color: '#495057' },
];

// Used when `multiplePalettes` is on: an array of { name, colors } origins.
const PALETTES = [
	{ name: 'Theme', colors: COLORS.slice( 0, 3 ) },
	{ name: 'Default', colors: COLORS.slice( 3 ) },
];

const PRESENTATION_OPTIONS = [
	{ label: 'listbox', value: 'listbox' },
	{ label: 'toggle-buttons', value: 'toggle-buttons' },
	{ label: 'command-buttons', value: 'command-buttons' },
];

const HEADING_LEVEL_OPTIONS = [ 1, 2, 3, 4, 5, 6 ].map( ( level ) => ( {
	label: String( level ),
	value: String( level ),
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		selectedSlug,
		clearable,
		disableCustomColors,
		enableAlpha,
		presentation,
		headingLevel,
		loop,
		multiplePalettes,
	} = attributes;

	// Shared by the inspector copy and the canvas copy.
	const paletteProps = {
		'aria-label': __( 'Colour palette', 'component-kitchen-sink' ),
		colors: multiplePalettes ? PALETTES : COLORS,
		value: value || undefined,
		selectedSlug: selectedSlug || undefined,
		clearable,
		disableCustomColors,
		enableAlpha,
		presentation,
		headingLevel,
		loop,
		onChange: ( nextColor, index, slug ) =>
			setAttributes( {
				value: nextColor ?? '',
				selectedSlug: slug ?? '',
			} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ColorPalette', 'component-kitchen-sink' ) }
				>
					<ColorPalette
						{ ...paletteProps }
						__experimentalIsRenderedInSidebar
					/>
					<ToggleControl
						label="clearable"
						checked={ clearable }
						onChange={ ( next ) =>
							setAttributes( { clearable: next } )
						}
					/>
					<ToggleControl
						label="disableCustomColors"
						checked={ disableCustomColors }
						onChange={ ( next ) =>
							setAttributes( { disableCustomColors: next } )
						}
					/>
					<ToggleControl
						label="enableAlpha"
						checked={ enableAlpha }
						onChange={ ( next ) =>
							setAttributes( { enableAlpha: next } )
						}
					/>
					<ToggleControl
						label="loop"
						checked={ loop }
						onChange={ ( next ) => setAttributes( { loop: next } ) }
					/>
					<ToggleControl
						label="colors (multiple palettes)"
						checked={ multiplePalettes }
						onChange={ ( next ) =>
							setAttributes( { multiplePalettes: next } )
						}
					/>
					<SelectControl
						label="presentation"
						value={ presentation }
						options={ PRESENTATION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { presentation: next } )
						}
					/>
					<SelectControl
						label="headingLevel"
						help={ __(
							'Only visible with multiple palettes.',
							'component-kitchen-sink'
						) }
						value={ String( headingLevel ) }
						options={ HEADING_LEVEL_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { headingLevel: Number( next ) } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ColorPalette</h3>
				<ColorPalette { ...paletteProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
