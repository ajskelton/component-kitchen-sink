import { __ } from '@wordpress/i18n';
import {
	FontSizePicker,
	InspectorControls,
	useBlockProps,
	withFontSizes,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

function Edit( {
	attributes,
	setAttributes,
	// Injected by withFontSizes:
	fontSize,
	setFontSize,
} ) {
	const { label } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'withFontSizes', 'component-kitchen-sink' ) }
				>
					<FontSizePicker
						value={ fontSize.size }
						onChange={ setFontSize }
						withSlider
					/>
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
				<h3>withFontSizes</h3>
				<p
					className={ fontSize.class }
					style={ { fontSize: fontSize.size } }
				>
					{ label }
				</p>
				<pre>
					{ JSON.stringify(
						{
							'withFontSizes( "fontSize" )': { fontSize },
							attributes,
						},
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}

// Reads the fontSize/customFontSize attributes and injects the font size
// object ({ name, slug, size, class }) and setFontSize as props.
export default withFontSizes( 'fontSize' )( Edit );
