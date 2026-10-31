import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { ExternalLink, PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { href, text } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const linkProps = { href };

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ExternalLink', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="href"
						type="url"
						help={ __(
							'Rendered as a link only; the page is never loaded by this block.',
							'component-kitchen-sink'
						) }
						value={ href }
						onChange={ ( next ) => setAttributes( { href: next } ) }
					/>
					<TextControl
						label="children"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ExternalLink</h3>
				<ExternalLink { ...linkProps }>{ text }</ExternalLink>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
