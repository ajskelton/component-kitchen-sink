import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const ALLOWED_TYPES = {
	image: [ 'image' ],
	video: [ 'video' ],
	audio: [ 'audio' ],
	all: undefined,
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		mediaId,
		mediaUrl,
		allowedTypes,
		multiple,
		gallery,
		addToGallery,
		modalTitle,
		modalClass,
		mode,
		closes,
	} = attributes;

	// Every prop exercised by this block. onSelect receives a single media
	// object, or an array when `multiple` or `gallery` is on.
	const mediaUploadProps = {
		allowedTypes: ALLOWED_TYPES[ allowedTypes ],
		multiple,
		gallery,
		addToGallery,
		title: modalTitle,
		modalClass: modalClass || undefined,
		mode: mode || undefined,
		value: mediaId || undefined,
		onSelect: ( media ) => {
			const first = Array.isArray( media ) ? media[ 0 ] : media;
			setAttributes( {
				mediaId: first?.id ?? 0,
				mediaUrl: first?.url ?? '',
			} );
		},
		onClose: () => setAttributes( { closes: closes + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'MediaUpload', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="allowedTypes"
						value={ allowedTypes }
						options={ Object.keys( ALLOWED_TYPES ).map(
							( value ) => ( { label: value, value } )
						) }
						onChange={ ( next ) =>
							setAttributes( { allowedTypes: next } )
						}
					/>
					<ToggleControl
						label="multiple"
						checked={ multiple }
						onChange={ ( next ) =>
							setAttributes( { multiple: next } )
						}
					/>
					<ToggleControl
						label="gallery"
						checked={ gallery }
						onChange={ ( next ) =>
							setAttributes( { gallery: next } )
						}
					/>
					<ToggleControl
						label="addToGallery"
						checked={ addToGallery }
						help={ __(
							'Only applies when gallery is on.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { addToGallery: next } )
						}
					/>
					<TextControl
						label="title"
						value={ modalTitle }
						onChange={ ( next ) =>
							setAttributes( { modalTitle: next } )
						}
					/>
					<TextControl
						label="modalClass"
						value={ modalClass }
						onChange={ ( next ) =>
							setAttributes( { modalClass: next } )
						}
					/>
					<SelectControl
						label="mode"
						value={ mode }
						options={ [
							{ label: '(default)', value: '' },
							{ label: 'browse', value: 'browse' },
							{ label: 'upload', value: 'upload' },
						] }
						onChange={ ( next ) => setAttributes( { mode: next } ) }
					/>
					<Button
						variant="tertiary"
						isDestructive
						size="compact"
						onClick={ () =>
							setAttributes( {
								mediaId: 0,
								mediaUrl: '',
								closes: 0,
							} )
						}
					>
						{ __( 'Clear media', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>MediaUpload</h3>
				<MediaUploadCheck
					fallback={
						<p>
							{ __(
								'You are not allowed to upload media.',
								'component-kitchen-sink'
							) }
						</p>
					}
				>
					<MediaUpload
						{ ...mediaUploadProps }
						render={ ( { open } ) => (
							<Button variant="secondary" onClick={ open }>
								{ __(
									'Open Media Library',
									'component-kitchen-sink'
								) }
							</Button>
						) }
					/>
				</MediaUploadCheck>
				{ mediaUrl && (
					<img
						src={ mediaUrl }
						alt=""
						style={ { maxWidth: '100%', height: 'auto' } }
					/>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
