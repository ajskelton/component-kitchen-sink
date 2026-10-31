import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
	__experimentalStyleProvider as StyleProvider,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { useCanvasDocument, label } = attributes;

	// The document that owns the canvas. In the iframed editor this is the
	// iframe's document, not the admin page's `window.document`.
	const [ canvasDocument, setCanvasDocument ] = useState( null );

	// StyleProvider renders nothing when `document` is missing, and it never
	// adds DOM of its own, so it wraps a Button purely to show the output.
	const providerDocument = useCanvasDocument
		? canvasDocument
		: window.document;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'StyleProvider', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="document"
						help={
							useCanvasDocument
								? __(
										'Using the canvas ownerDocument.',
										'component-kitchen-sink'
									)
								: __(
										'Using window.document of the admin page.',
										'component-kitchen-sink'
									)
						}
						checked={ useCanvasDocument }
						onChange={ ( next ) =>
							setAttributes( { useCanvasDocument: next } )
						}
					/>
					<TextControl
						label="children"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>StyleProvider</h3>
				{ /* The ref sits on an inner element so it does not replace the
				ref that useBlockProps() puts on the wrapper. */ }
				<div
					ref={ ( node ) => {
						if ( node && node.ownerDocument !== canvasDocument ) {
							setCanvasDocument( node.ownerDocument );
						}
					} }
				>
					{ providerDocument ? (
						<StyleProvider document={ providerDocument }>
							<Button variant="primary">{ label }</Button>
						</StyleProvider>
					) : (
						<p>
							{ __(
								'Waiting for the canvas document.',
								'component-kitchen-sink'
							) }
						</p>
					) }
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
