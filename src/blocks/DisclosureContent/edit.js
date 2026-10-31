import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__unstableDisclosureContent as DisclosureContent,
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { visible, text } = attributes;

	// Props shared by the inspector copy and the canvas copy.
	const contentProps = { visible };

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'DisclosureContent',
						'component-kitchen-sink'
					) }
				>
					<DisclosureContent { ...contentProps }>
						{ text }
					</DisclosureContent>
					<ToggleControl
						label="visible"
						checked={ visible }
						onChange={ ( next ) =>
							setAttributes( { visible: next } )
						}
					/>
					<TextControl
						label="children"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>DisclosureContent</h3>
				<Button
					variant="secondary"
					aria-expanded={ visible }
					onClick={ () => setAttributes( { visible: ! visible } ) }
				>
					{ visible
						? __( 'Hide content', 'component-kitchen-sink' )
						: __( 'Show content', 'component-kitchen-sink' ) }
				</Button>
				<DisclosureContent { ...contentProps }>
					{ text }
				</DisclosureContent>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
