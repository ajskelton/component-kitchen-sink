import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	BlockControls,
	InspectorControls,
	__experimentalImageURLInputUI as ImageURLInputUI,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const {
		href,
		linkDestination,
		linkTarget,
		rel,
		linkClass,
		mediaUrl,
		mediaLink,
		mediaType,
		showLightboxSetting,
		lightboxEnabled,
	} = attributes;

	// Every prop exercised by this block.
	const imageUrlInputUIProps = {
		url: href,
		linkDestination,
		linkTarget: linkTarget || undefined,
		rel: rel || undefined,
		linkClass: linkClass || undefined,
		mediaUrl,
		mediaLink,
		mediaType,
		showLightboxSetting,
		lightboxEnabled,
		// onChangeUrl receives only the changed link attributes.
		onChangeUrl: ( change ) => {
			const next = {};
			if ( 'href' in change ) {
				next.href = change.href ?? '';
			}
			if ( 'linkDestination' in change ) {
				next.linkDestination = change.linkDestination;
			}
			if ( 'linkTarget' in change ) {
				next.linkTarget = change.linkTarget ?? '';
			}
			if ( 'rel' in change ) {
				next.rel = change.rel ?? '';
			}
			if ( 'linkClass' in change ) {
				next.linkClass = change.linkClass ?? '';
			}
			if ( change.lightbox ) {
				next.lightboxEnabled = !! change.lightbox.enabled;
			}
			setAttributes( next );
		},
		onSetLightbox: ( enabled ) =>
			setAttributes( { lightboxEnabled: enabled } ),
		resetLightbox: () => setAttributes( { lightboxEnabled: false } ),
	};

	return (
		<>
			{ /* The component is a toolbar button with a popover. */ }
			<BlockControls group="block">
				<ImageURLInputUI { ...imageUrlInputUIProps } />
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'ImageURLInputUI', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="mediaUrl"
						value={ mediaUrl }
						onChange={ ( next ) =>
							setAttributes( { mediaUrl: next } )
						}
					/>
					<TextControl
						label="mediaLink"
						help={ __(
							'Empty hides the "Link to attachment page" choice.',
							'component-kitchen-sink'
						) }
						value={ mediaLink }
						onChange={ ( next ) =>
							setAttributes( { mediaLink: next } )
						}
					/>
					<SelectControl
						label="mediaType"
						value={ mediaType }
						options={ [
							{ label: 'image', value: 'image' },
							{ label: 'video', value: 'video' },
						] }
						onChange={ ( next ) =>
							setAttributes( { mediaType: next } )
						}
					/>
					<ToggleControl
						label="showLightboxSetting"
						checked={ showLightboxSetting }
						onChange={ ( next ) =>
							setAttributes( { showLightboxSetting: next } )
						}
					/>
					<ToggleControl
						label="lightboxEnabled"
						checked={ lightboxEnabled }
						onChange={ ( next ) =>
							setAttributes( { lightboxEnabled: next } )
						}
					/>
					<TextControl
						label="url (link href)"
						value={ href }
						onChange={ ( next ) => setAttributes( { href: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ImageURLInputUI</h3>
				<p>
					{ __(
						'Select the block, then use the Link button in the block toolbar.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
