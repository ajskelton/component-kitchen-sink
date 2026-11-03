import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { FormToggle, PanelBody, ToggleControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { checked, disabled } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const toggleProps = {
		checked,
		disabled,
		onChange: ( event ) =>
			setAttributes( { checked: event.target.checked } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'FormToggle', 'component-kitchen-sink' ) }
				>
					<FormToggle { ...toggleProps } />
					<ToggleControl
						label="checked"
						checked={ checked }
						onChange={ ( next ) =>
							setAttributes( { checked: next } )
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
				<h3>FormToggle</h3>
				<FormToggle { ...toggleProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
