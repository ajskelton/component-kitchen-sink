import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalView as View,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const AS_OPTIONS = [ 'div', 'section', 'article', 'aside', 'span', 'p' ].map(
	( value ) => ( { label: value, value } )
);

export default function Edit( { attributes, setAttributes } ) {
	const { as, text, padded } = attributes;

	// `as` swaps the rendered element; View accepts any element name.
	const viewProps = {
		as,
		style: {
			padding: padded ? 16 : 0,
			background: '#f0f6fc',
			border: '1px solid #72aee6',
		},
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'View', 'component-kitchen-sink' ) }>
					<SelectControl
						label="as"
						value={ as }
						options={ AS_OPTIONS }
						onChange={ ( next ) => setAttributes( { as: next } ) }
					/>
					<TextControl
						label="children"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<ToggleControl
						label="style (padding)"
						checked={ padded }
						onChange={ ( next ) =>
							setAttributes( { padded: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>View</h3>
				<View { ...viewProps }>{ text }</View>
				<p>
					{ __( 'Rendered element:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ as }</code>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
