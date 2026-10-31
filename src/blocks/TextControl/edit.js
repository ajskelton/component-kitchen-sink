import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const TYPE_OPTIONS = [
	'text',
	'date',
	'datetime-local',
	'email',
	'number',
	'password',
	'tel',
	'time',
	'search',
	'url',
].map( ( value ) => ( { label: value, value } ) );

export default function Edit( { attributes, setAttributes } ) {
	const { value, label, help, type, hideLabelFromVision, className } =
		attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const textProps = {
		label,
		help: help || undefined,
		type,
		hideLabelFromVision,
		className: className || undefined,
		value,
		onChange: ( next ) => setAttributes( { value: next } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'TextControl', 'component-kitchen-sink' ) }
				>
					<TextControl { ...textProps } />
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
					<SelectControl
						label="type"
						value={ type }
						options={ TYPE_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { type: next, value: '' } )
						}
					/>
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
						}
					/>
					<TextControl
						label="className"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>TextControl</h3>
				<TextControl { ...textProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
