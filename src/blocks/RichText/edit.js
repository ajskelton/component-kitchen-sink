import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const TAG_OPTIONS = [ 'p', 'h2', 'h3', 'div', 'blockquote' ].map(
	( value ) => ( { label: value, value } )
);

const ALLOWED_FORMATS_OPTIONS = [
	{ label: 'all (undefined)', value: 'all' },
	{ label: "[ 'core/bold', 'core/italic' ]", value: 'bold-italic' },
	{ label: '[] (none)', value: 'none' },
];

/**
 * Maps the select value to the `allowedFormats` prop.
 *
 * @param {string} preset One of the ALLOWED_FORMATS_OPTIONS values.
 * @return {string[]|undefined} Format names, or undefined to allow all.
 */
function getAllowedFormats( preset ) {
	if ( preset === 'bold-italic' ) {
		return [ 'core/bold', 'core/italic' ];
	}
	return preset === 'none' ? [] : undefined;
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		content,
		tagName,
		placeholder,
		disableLineBreaks,
		allowedFormats,
		withoutInteractiveFormatting,
		preserveWhiteSpace,
	} = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'RichText', 'component-kitchen-sink' ) }>
					<SelectControl
						label="tagName"
						value={ tagName }
						options={ TAG_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { tagName: next } )
						}
					/>
					<TextControl
						label="placeholder"
						value={ placeholder }
						onChange={ ( next ) =>
							setAttributes( { placeholder: next } )
						}
					/>
					<ToggleControl
						label="disableLineBreaks"
						checked={ disableLineBreaks }
						onChange={ ( next ) =>
							setAttributes( { disableLineBreaks: next } )
						}
					/>
					<SelectControl
						label="allowedFormats"
						value={ allowedFormats }
						options={ ALLOWED_FORMATS_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { allowedFormats: next } )
						}
					/>
					<ToggleControl
						label="withoutInteractiveFormatting"
						checked={ withoutInteractiveFormatting }
						onChange={ ( next ) =>
							setAttributes( {
								withoutInteractiveFormatting: next,
							} )
						}
					/>
					<ToggleControl
						label="preserveWhiteSpace"
						checked={ preserveWhiteSpace }
						onChange={ ( next ) =>
							setAttributes( { preserveWhiteSpace: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>RichText</h3>
				<RichText
					identifier="content"
					tagName={ tagName }
					value={ content }
					onChange={ ( next ) => setAttributes( { content: next } ) }
					placeholder={ placeholder }
					disableLineBreaks={ disableLineBreaks }
					allowedFormats={ getAllowedFormats( allowedFormats ) }
					withoutInteractiveFormatting={
						withoutInteractiveFormatting
					}
					preserveWhiteSpace={ preserveWhiteSpace }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
