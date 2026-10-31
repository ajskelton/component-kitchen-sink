import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	URLInputButton,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { url, text } = attributes;

	// Both props of URLInputButton: the stored URL and the change handler. The
	// second argument of onChange is the chosen suggestion, if any.
	const urlInputButtonProps = {
		url,
		onChange: ( next, post ) =>
			setAttributes( {
				url: next,
				text: post?.title || text,
			} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'URLInputButton', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="url"
						value={ url }
						onChange={ ( next ) => setAttributes( { url: next } ) }
					/>
					<TextControl
						label="text"
						help={ __(
							'Link text; replaced by the title of a chosen suggestion.',
							'component-kitchen-sink'
						) }
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>URLInputButton</h3>
				<URLInputButton { ...urlInputButtonProps } />
				<p>
					{ url ? (
						<a href={ url } onClick={ ( e ) => e.preventDefault() }>
							{ text }
						</a>
					) : (
						__( 'No URL set yet.', 'component-kitchen-sink' )
					) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
