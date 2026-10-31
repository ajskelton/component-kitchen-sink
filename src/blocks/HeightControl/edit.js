import { __ } from '@wordpress/i18n';
import {
	HeightControl,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { value, label } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		label,
		value: value || undefined,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'HeightControl', 'component-kitchen-sink' ) }
				>
					<HeightControl { ...controlProps } />
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
				<h3>HeightControl</h3>
				<div
					style={ {
						minHeight: value || 40,
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
