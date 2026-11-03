import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	FontSizePicker,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

// Sizes are strings with units so that the custom size input offers units.
const FONT_SIZES = [
	{ name: 'Small', slug: 'small', size: '13px' },
	{ name: 'Medium', slug: 'medium', size: '20px' },
	{ name: 'Large', slug: 'large', size: '36px' },
	{ name: 'Huge', slug: 'huge', size: '2.5rem', hint: 'rem' },
];

const UNITS = {
	default: [ 'px', 'em', 'rem', 'vw', 'vh' ],
	'px-only': [ 'px' ],
	relative: [ 'em', 'rem' ],
};

const VALUE_MODE_OPTIONS = [
	{ label: 'literal', value: 'literal' },
	{ label: 'slug', value: 'slug' },
];

const UNITS_OPTIONS = [
	{ label: 'px, em, rem, vw, vh (default)', value: 'default' },
	{ label: 'px', value: 'px-only' },
	{ label: 'em, rem', value: 'relative' },
];

const SIZE_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: '__unstable-large', value: '__unstable-large' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		slug,
		valueMode,
		disableCustomFontSizes,
		withSlider,
		withReset,
		fallbackFontSize,
		unitsPreset,
		size,
		next40pxDefaultSize,
	} = attributes;

	const pickerProps = {
		fontSizes: FONT_SIZES,
		// In slug mode the component expects the slug as its value.
		value: valueMode === 'slug' ? slug || undefined : value || undefined,
		valueMode,
		disableCustomFontSizes,
		withSlider,
		withReset,
		fallbackFontSize,
		units: UNITS[ unitsPreset ],
		size,
		__next40pxDefaultSize: next40pxDefaultSize,
		onChange: ( nextValue, selectedItem ) =>
			setAttributes( {
				value:
					nextValue === undefined || nextValue === null
						? ''
						: String( nextValue ),
				slug: selectedItem?.slug ?? '',
			} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'FontSizePicker', 'component-kitchen-sink' ) }
				>
					<FontSizePicker { ...pickerProps } />
					<SelectControl
						label="valueMode"
						value={ valueMode }
						options={ VALUE_MODE_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { valueMode: next } )
						}
					/>
					<ToggleControl
						label="disableCustomFontSizes"
						checked={ disableCustomFontSizes }
						onChange={ ( next ) =>
							setAttributes( { disableCustomFontSizes: next } )
						}
					/>
					<ToggleControl
						label="withSlider"
						checked={ withSlider }
						onChange={ ( next ) =>
							setAttributes( { withSlider: next } )
						}
					/>
					<ToggleControl
						label="withReset"
						checked={ withReset }
						onChange={ ( next ) =>
							setAttributes( { withReset: next } )
						}
					/>
					<RangeControl
						label="fallbackFontSize"
						value={ fallbackFontSize }
						min={ 8 }
						max={ 72 }
						onChange={ ( next ) =>
							setAttributes( { fallbackFontSize: next ?? 16 } )
						}
					/>
					<SelectControl
						label="units"
						value={ unitsPreset }
						options={ UNITS_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { unitsPreset: next } )
						}
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<ToggleControl
						label="__next40pxDefaultSize"
						checked={ next40pxDefaultSize }
						onChange={ ( next ) =>
							setAttributes( { next40pxDefaultSize: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>FontSizePicker</h3>
				<FontSizePicker { ...pickerProps } />
				<p style={ { fontSize: value || undefined } }>
					{ __(
						'The quick brown fox jumps over the lazy dog.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
