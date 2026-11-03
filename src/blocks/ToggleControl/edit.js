import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { checked, label, help, dynamicHelp, disabled, className } =
		attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	// `help` may be a function of the checked state.
	const toggleProps = {
		label,
		help: dynamicHelp
			? ( isChecked ) =>
					isChecked
						? __( 'Currently on.', 'component-kitchen-sink' )
						: __( 'Currently off.', 'component-kitchen-sink' )
			: help || undefined,
		disabled,
		className: className || undefined,
		checked,
		onChange: ( next ) => setAttributes( { checked: next } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ToggleControl', 'component-kitchen-sink' ) }
				>
					<ToggleControl { ...toggleProps } />
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
						label="help"
						value={ help }
						onChange={ ( next ) => setAttributes( { help: next } ) }
					/>
					<ToggleControl
						label="help (as a function)"
						help={ __(
							'Overrides the help text with a function of the checked state.',
							'component-kitchen-sink'
						) }
						checked={ dynamicHelp }
						onChange={ ( next ) =>
							setAttributes( { dynamicHelp: next } )
						}
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
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
				<h3>ToggleControl</h3>
				<ToggleControl { ...toggleProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
