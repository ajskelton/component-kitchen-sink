import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	RadioControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const OPTIONS = [
	{ label: 'Small', value: 'small', description: 'A compact size.' },
	{ label: 'Medium', value: 'medium', description: 'The default size.' },
	{ label: 'Large', value: 'large' },
	{ label: 'Huge (disabled)', value: 'huge', disabled: true },
];

export default function Edit( { attributes, setAttributes } ) {
	const { selected, label, help, hideLabelFromVision, disabled } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const radioProps = {
		label,
		help: help || undefined,
		hideLabelFromVision,
		disabled,
		options: OPTIONS,
		selected,
		onChange: ( next ) => setAttributes( { selected: next } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'RadioControl', 'component-kitchen-sink' ) }
				>
					<RadioControl { ...radioProps } />
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
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
						}
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>RadioControl</h3>
				<RadioControl { ...radioProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
