import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	DuotonePicker,
	DuotoneSwatch,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const COLOR_PALETTE = [
	{ name: 'Black', slug: 'black', color: '#000000' },
	{ name: 'White', slug: 'white', color: '#ffffff' },
	{ name: 'Navy', slug: 'navy', color: '#000097' },
	{ name: 'Coral', slug: 'coral', color: '#ff4747' },
	{ name: 'Gold', slug: 'gold', color: '#fcb900' },
];

const DUOTONE_PALETTE = [
	{ name: 'Grayscale', slug: 'grayscale', colors: [ '#000000', '#ffffff' ] },
	{ name: 'Midnight', slug: 'midnight', colors: [ '#000097', '#ff4747' ] },
	{ name: 'Sunrise', slug: 'sunrise', colors: [ '#000000', '#fcb900' ] },
	{ name: 'Same pair', slug: 'same-pair', colors: [ '#000000', '#ffffff' ] },
];

const PRESENTATION_OPTIONS = [
	{ label: 'listbox', value: 'listbox' },
	{ label: 'toggle-buttons', value: 'toggle-buttons' },
	{ label: 'command-buttons', value: 'command-buttons' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		colors,
		isUnset,
		selectedSlug,
		clearable,
		unsetable,
		disableCustomColors,
		disableCustomDuotone,
		presentation,
		loop,
	} = attributes;

	// The component's `value` is an array of colours, the string 'unset', or
	// undefined for "nothing chosen".
	let value;
	if ( isUnset ) {
		value = 'unset';
	} else if ( colors.length ) {
		value = colors;
	}

	const pickerProps = {
		'aria-label': __( 'Duotone picker', 'component-kitchen-sink' ),
		colorPalette: COLOR_PALETTE,
		duotonePalette: DUOTONE_PALETTE,
		value,
		selectedSlug: selectedSlug || undefined,
		clearable,
		unsetable,
		disableCustomColors,
		disableCustomDuotone,
		presentation,
		loop,
		onChange: ( next, index, slug ) =>
			setAttributes( {
				colors: Array.isArray( next ) ? next : [],
				isUnset: next === 'unset',
				selectedSlug: slug ?? '',
			} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'DuotonePicker', 'component-kitchen-sink' ) }
				>
					<DuotonePicker { ...pickerProps } />
					<ToggleControl
						label="clearable"
						checked={ clearable }
						onChange={ ( next ) =>
							setAttributes( { clearable: next } )
						}
					/>
					<ToggleControl
						label="unsetable"
						checked={ unsetable }
						onChange={ ( next ) =>
							setAttributes( { unsetable: next } )
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
						label="disableCustomDuotone"
						checked={ disableCustomDuotone }
						onChange={ ( next ) =>
							setAttributes( { disableCustomDuotone: next } )
						}
					/>
					<ToggleControl
						label="loop"
						checked={ loop }
						onChange={ ( next ) => setAttributes( { loop: next } ) }
					/>
					<SelectControl
						label="presentation"
						value={ presentation }
						options={ PRESENTATION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { presentation: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>DuotonePicker</h3>
				<DuotoneSwatch values={ isUnset ? null : colors } />
				<DuotonePicker { ...pickerProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
