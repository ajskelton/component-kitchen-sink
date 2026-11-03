import { __ } from '@wordpress/i18n';
import {
	FontSizePicker,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const SIZE_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: '__unstable-large', value: '__unstable-large' },
];

const UNITS_OPTIONS = [
	{ label: 'default (px, em, rem, vw, vh)', value: 'default' },
	{ label: 'px and rem', value: 'px-rem' },
];

const UNITS = {
	default: undefined,
	'px-rem': [ 'px', 'rem' ],
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		fallbackFontSize,
		size,
		withSlider,
		withReset,
		unitsPreset,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	// The block-editor picker takes `fontSizes` and the custom-size switch from
	// the editor settings, so neither is passed here.
	const pickerProps = {
		value: value === '' ? undefined : value,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		fallbackFontSize,
		size,
		withSlider,
		withReset,
		units: UNITS[ unitsPreset ],
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'FontSizePicker', 'component-kitchen-sink' ) }
				>
					<FontSizePicker { ...pickerProps } />
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
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
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
					<SelectControl
						label="units"
						value={ unitsPreset }
						options={ UNITS_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { unitsPreset: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>FontSizePicker (block-editor)</h3>
				<p
					style={ {
						fontSize:
							typeof value === 'number' ? `${ value }px` : value,
					} }
				>
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
