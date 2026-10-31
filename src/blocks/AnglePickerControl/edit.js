import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	AnglePickerControl,
	PanelBody,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { angle, label } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const pickerProps = {
		label,
		value: angle,
		onChange: ( next ) => setAttributes( { angle: Number( next ) || 0 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'AnglePickerControl',
						'component-kitchen-sink'
					) }
				>
					<AnglePickerControl { ...pickerProps } />
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>AnglePickerControl</h3>
				<AnglePickerControl { ...pickerProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
