import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	PlainText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { content, placeholder, disabled, readOnly, spellCheck, maxLength } =
		attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const plainTextProps = {
		value: content,
		onChange: ( next ) => setAttributes( { content: next } ),
		placeholder,
		disabled,
		readOnly,
		spellCheck,
		maxLength: maxLength > 0 ? maxLength : undefined,
		'aria-label': __( 'Plain text', 'component-kitchen-sink' ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'PlainText', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="placeholder"
						value={ placeholder }
						onChange={ ( next ) =>
							setAttributes( { placeholder: next } )
						}
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
					<ToggleControl
						label="readOnly"
						checked={ readOnly }
						onChange={ ( next ) =>
							setAttributes( { readOnly: next } )
						}
					/>
					<ToggleControl
						label="spellCheck"
						checked={ spellCheck }
						onChange={ ( next ) =>
							setAttributes( { spellCheck: next } )
						}
					/>
					<TextControl
						type="number"
						label="maxLength"
						help={ __(
							'0 means no limit.',
							'component-kitchen-sink'
						) }
						value={ maxLength }
						min={ 0 }
						onChange={ ( next ) =>
							setAttributes( { maxLength: Number( next ) || 0 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>PlainText</h3>
				<PlainText { ...plainTextProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
