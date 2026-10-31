import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextHighlight } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { text, highlight } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const highlightProps = { text, highlight };

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'TextHighlight', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="text"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<TextControl
						label="highlight"
						help={ __(
							'Case-insensitive; every match is wrapped in <mark>.',
							'component-kitchen-sink'
						) }
						value={ highlight }
						onChange={ ( next ) =>
							setAttributes( { highlight: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>TextHighlight</h3>
				<p>
					<TextHighlight { ...highlightProps } />
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
