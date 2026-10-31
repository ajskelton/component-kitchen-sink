import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	CheckboxControl,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { checked, label, heading, help, indeterminate, disabled } =
		attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const checkboxProps = {
		checked,
		label,
		heading: heading || undefined,
		help: help || undefined,
		indeterminate,
		disabled,
		onChange: ( next ) => setAttributes( { checked: next } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'CheckboxControl', 'component-kitchen-sink' ) }
				>
					<CheckboxControl { ...checkboxProps } />
					<ToggleControl
						label="checked"
						checked={ checked }
						onChange={ ( next ) =>
							setAttributes( { checked: next } )
						}
					/>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="heading"
						value={ heading }
						onChange={ ( next ) =>
							setAttributes( { heading: next } )
						}
					/>
					<TextControl
						label="help"
						value={ help }
						onChange={ ( next ) => setAttributes( { help: next } ) }
					/>
					<ToggleControl
						label="indeterminate"
						checked={ indeterminate }
						onChange={ ( next ) =>
							setAttributes( { indeterminate: next } )
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
				<h3>CheckboxControl</h3>
				<CheckboxControl { ...checkboxProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
