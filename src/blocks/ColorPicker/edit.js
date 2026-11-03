import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	ColorPicker,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const COPY_FORMAT_OPTIONS = [
	{ label: 'hex', value: 'hex' },
	{ label: 'hsl', value: 'hsl' },
	{ label: 'rgb', value: 'rgb' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { color, enableAlpha, copyFormat } = attributes;

	const pickerProps = {
		color,
		enableAlpha,
		copyFormat,
		onChange: ( next ) => setAttributes( { color: next } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ColorPicker', 'component-kitchen-sink' ) }
				>
					<ColorPicker { ...pickerProps } />
					<ToggleControl
						label="enableAlpha"
						checked={ enableAlpha }
						onChange={ ( next ) =>
							setAttributes( { enableAlpha: next } )
						}
					/>
					<SelectControl
						label="copyFormat"
						value={ copyFormat }
						options={ COPY_FORMAT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { copyFormat: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ColorPicker</h3>
				<ColorPicker { ...pickerProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
