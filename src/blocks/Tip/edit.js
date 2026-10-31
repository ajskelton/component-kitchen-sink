import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, Tip } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { text } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Tip', 'component-kitchen-sink' ) }>
					<TextControl
						label="children"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<Tip>{ text }</Tip>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Tip</h3>
				{ /* Deprecated since 7.2: logs a deprecation warning when rendered. */ }
				<Tip>{ text }</Tip>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
