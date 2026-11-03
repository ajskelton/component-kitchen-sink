import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalImageSizeControl as ImageSizeControl,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

// Source image dimensions per size slug, standing in for real attachment data.
const SIZES = {
	thumbnail: { imageWidth: 150, imageHeight: 100 },
	medium: { imageWidth: 300, imageHeight: 200 },
	large: { imageWidth: 600, imageHeight: 400 },
	full: { imageWidth: 1200, imageHeight: 800 },
};

const IMAGE_SIZE_OPTIONS = Object.keys( SIZES ).map( ( value ) => ( {
	label: value,
	value,
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		width,
		height,
		slug,
		imageWidth,
		imageHeight,
		isResizable,
		withSizeOptions,
		imageSizeHelp,
	} = attributes;

	// Every prop exercised by this block.
	const imageSizeControlProps = {
		slug,
		width: width || undefined,
		height: height || undefined,
		imageWidth,
		imageHeight,
		isResizable,
		imageSizeHelp: imageSizeHelp || undefined,
		imageSizeOptions: withSizeOptions ? IMAGE_SIZE_OPTIONS : undefined,
		onChange: ( dimensions ) =>
			setAttributes( {
				width: Number( dimensions.width ) || 0,
				height: Number( dimensions.height ) || 0,
			} ),
		// Picking a size changes the source image dimensions and clears the
		// custom dimensions, as the Image block does.
		onChangeImage: ( nextSlug ) =>
			setAttributes( {
				slug: nextSlug,
				...( SIZES[ nextSlug ] ?? {} ),
				width: 0,
				height: 0,
			} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ImageSizeControl', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="isResizable"
						checked={ isResizable }
						onChange={ ( next ) =>
							setAttributes( { isResizable: next } )
						}
					/>
					<ToggleControl
						label="imageSizeOptions"
						checked={ withSizeOptions }
						help={ __(
							'Off hides the "Image size" dropdown.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { withSizeOptions: next } )
						}
					/>
					<TextControl
						label="imageSizeHelp"
						value={ imageSizeHelp }
						onChange={ ( next ) =>
							setAttributes( { imageSizeHelp: next } )
						}
					/>
					<TextControl
						type="number"
						label="imageWidth"
						value={ imageWidth }
						onChange={ ( next ) =>
							setAttributes( { imageWidth: Number( next ) || 0 } )
						}
					/>
					<TextControl
						type="number"
						label="imageHeight"
						value={ imageHeight }
						onChange={ ( next ) =>
							setAttributes( {
								imageHeight: Number( next ) || 0,
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ImageSizeControl</h3>
				<ImageSizeControl { ...imageSizeControlProps } />
				{ /* A stand-in for the image, drawn at the chosen size. */ }
				<div
					className="ajs-image-size-preview"
					style={ {
						width: width || imageWidth,
						height: height || imageHeight,
						maxWidth: '100%',
					} }
				>
					{ `${ width || imageWidth } x ${ height || imageHeight }` }
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
