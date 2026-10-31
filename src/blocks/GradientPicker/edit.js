import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	GradientPicker,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const GRADIENTS = [
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
	{
		name: 'Mint',
		slug: 'mint',
		gradient:
			'linear-gradient(135deg,rgb(0,208,132) 0%,rgb(6,147,227) 100%)',
	},
	{
		name: 'Haze',
		slug: 'haze',
		gradient:
			'linear-gradient(135deg,rgb(252,185,0) 0%,rgb(255,105,0) 50%,rgb(207,46,46) 100%)',
	},
];

// Used when `multipleOrigins` is on: an array of { name, gradients } origins.
const ORIGINS = [
	{ name: 'Theme', gradients: GRADIENTS.slice( 0, 2 ) },
	{ name: 'Default', gradients: GRADIENTS.slice( 2 ) },
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
		disableCustomGradients,
		enableAlpha,
		presentation,
		headingLevel,
		loop,
		multipleOrigins,
	} = attributes;

	const pickerProps = {
		'aria-label': __( 'Gradient picker', 'component-kitchen-sink' ),
		gradients: multipleOrigins ? ORIGINS : GRADIENTS,
		value: value || null,
		selectedSlug: selectedSlug || undefined,
		clearable,
		disableCustomGradients,
		enableAlpha,
		presentation,
		headingLevel,
		loop,
		onChange: ( next, index, slug ) =>
			setAttributes( {
				value: next ?? '',
				selectedSlug: slug ?? '',
			} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'GradientPicker', 'component-kitchen-sink' ) }
				>
					<GradientPicker
						{ ...pickerProps }
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
						label="disableCustomGradients"
						checked={ disableCustomGradients }
						onChange={ ( next ) =>
							setAttributes( { disableCustomGradients: next } )
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
						label="gradients (multiple origins)"
						checked={ multipleOrigins }
						onChange={ ( next ) =>
							setAttributes( { multipleOrigins: next } )
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
							'Only applies with multiple origins.',
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
				<h3>GradientPicker</h3>
				<div
					style={ {
						background: value || undefined,
						height: 48,
						marginBottom: 16,
						border: '1px solid #ccc',
					} }
				/>
				<GradientPicker { ...pickerProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
