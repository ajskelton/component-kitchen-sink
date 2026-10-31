import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	TextareaControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { value, label, help, rows, hideLabelFromVision } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const textareaProps = {
		label,
		help: help || undefined,
		rows,
		hideLabelFromVision,
		value,
		onChange: ( next ) => setAttributes( { value: next } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'TextareaControl', 'component-kitchen-sink' ) }
				>
					<TextareaControl { ...textareaProps } />
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="help"
						value={ help }
						onChange={ ( next ) => setAttributes( { help: next } ) }
					/>
					<TextControl
						label="rows"
						type="number"
						value={ rows }
						onChange={ ( next ) =>
							setAttributes( { rows: Number( next ) || 1 } )
						}
					/>
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>TextareaControl</h3>
				<TextareaControl { ...textareaProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
