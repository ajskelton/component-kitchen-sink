import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	MediaPlaceholder,
	__experimentalImageEditor as ImageEditor,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	Button,
	PanelBody,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { mediaId, mediaUrl, width, height, borderRadius, borderColor } =
		attributes;
	const [ isEditing, setIsEditing ] = useState( false );
	const [ naturalSize, setNaturalSize ] = useState();

	// Every prop exercised by this block. ImageEditor edits an attachment: it
	// saves through the REST API, so it needs a real media id.
	const imageEditorProps = naturalSize && {
		id: mediaId,
		url: mediaUrl,
		width: width || undefined,
		height: height || undefined,
		naturalWidth: naturalSize.width,
		naturalHeight: naturalSize.height,
		borderProps: {
			className: 'ajs-image-editor-border',
			style: {
				borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
				borderColor: borderColor || undefined,
				borderStyle: borderColor ? 'solid' : undefined,
			},
		},
		onSaveImage: ( image ) => {
			setAttributes( { mediaId: image.id, mediaUrl: image.url } );
			setNaturalSize( undefined );
		},
		onFinishEditing: () => setIsEditing( false ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ImageEditor', 'component-kitchen-sink' ) }
				>
					<TextControl
						type="number"
						label="width"
						help={ __(
							'0 means automatic.',
							'component-kitchen-sink'
						) }
						value={ width }
						onChange={ ( next ) =>
							setAttributes( { width: Number( next ) || 0 } )
						}
					/>
					<TextControl
						type="number"
						label="height"
						help={ __(
							'0 means automatic.',
							'component-kitchen-sink'
						) }
						value={ height }
						onChange={ ( next ) =>
							setAttributes( { height: Number( next ) || 0 } )
						}
					/>
					<RangeControl
						label="borderProps.style.borderRadius"
						value={ borderRadius }
						min={ 0 }
						max={ 100 }
						onChange={ ( next ) =>
							setAttributes( { borderRadius: next ?? 0 } )
						}
					/>
					<TextControl
						label="borderProps.style.borderColor"
						value={ borderColor }
						onChange={ ( next ) =>
							setAttributes( { borderColor: next } )
						}
					/>
					<Button
						variant="secondary"
						disabled={ ! mediaUrl }
						onClick={ () => setIsEditing( ! isEditing ) }
					>
						{ isEditing
							? __( 'Stop editing', 'component-kitchen-sink' )
							: __( 'Edit image', 'component-kitchen-sink' ) }
					</Button>
					<Button
						variant="tertiary"
						isDestructive
						size="compact"
						onClick={ () => {
							setIsEditing( false );
							setNaturalSize( undefined );
							setAttributes( { mediaId: 0, mediaUrl: '' } );
						} }
					>
						{ __( 'Clear media', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ImageEditor</h3>
				<p>
					{ __(
						'Deprecated export: expect a deprecation warning in the console. Pick an image, then press "Edit image" in the inspector; the crop, zoom, aspect ratio and rotate controls appear in the block toolbar.',
						'component-kitchen-sink'
					) }
				</p>
				{ ! mediaUrl && (
					<MediaPlaceholder
						allowedTypes={ [ 'image' ] }
						onSelect={ ( media ) =>
							setAttributes( {
								mediaId: media?.id ?? 0,
								mediaUrl: media?.url ?? '',
							} )
						}
					/>
				) }
				{ mediaUrl && (
					<img
						src={ mediaUrl }
						alt=""
						// Measures the natural size ImageEditor needs.
						onLoad={ ( event ) =>
							setNaturalSize( {
								width: event.target.naturalWidth,
								height: event.target.naturalHeight,
							} )
						}
						hidden={ isEditing }
						style={ {
							maxWidth: '100%',
							height: 'auto',
							borderRadius: borderRadius
								? `${ borderRadius }px`
								: undefined,
						} }
					/>
				) }
				{ isEditing && imageEditorProps && (
					<ImageEditor { ...imageEditorProps } />
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
