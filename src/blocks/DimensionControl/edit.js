import { __ } from '@wordpress/i18n';
import {
	DimensionControl,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

const SAMPLE_SIZES = {
	theme: [
		{ name: 'Small', slug: 'small', size: '80px' },
		{ name: 'Medium', slug: 'medium', size: '160px' },
		{ name: 'Large', slug: 'large', size: '240px' },
	],
};

export default function Edit( { attributes, setAttributes } ) {
	const { value, label, placeholder, usePresets } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		label,
		placeholder: placeholder || undefined,
		value: value || undefined,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		dimensionSizes: usePresets ? SAMPLE_SIZES : undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'DimensionControl', 'component-kitchen-sink' ) }
				>
					<DimensionControl { ...controlProps } />
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="placeholder"
						value={ placeholder }
						onChange={ ( next ) =>
							setAttributes( { placeholder: next } )
						}
					/>
					<ToggleControl
						label="dimensionSizes (sample theme presets)"
						checked={ usePresets }
						onChange={ ( next ) =>
							setAttributes( { usePresets: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>DimensionControl</h3>
				<div
					style={ {
						minHeight: value || 40,
						maxWidth: '100%',
						border: '1px dashed currentColor',
					} }
				>
					{ __( 'Height:', 'component-kitchen-sink' ) }{ ' ' }
					{ value || '–' }
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
