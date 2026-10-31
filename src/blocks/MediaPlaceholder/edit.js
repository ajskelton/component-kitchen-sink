import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	MediaPlaceholder,
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
		isAppender,
		disableDropZone,
		dropZoneUIOnly,
		disableMediaButtons,
		labelTitle,
		labelInstructions,
		accept,
		withSelectURL,
		withPreview,
	} = attributes;

	// onSelect receives one media object, or an array when `multiple` is on.
	const onSelect = ( media ) => {
		const first = Array.isArray( media ) ? media[ 0 ] : media;
		setAttributes( {
			mediaId: first?.id ?? 0,
			mediaUrl: first?.url ?? '',
		} );
	};

	// Every prop exercised by this block.
	const placeholderProps = {
		onSelect,
		onSelectURL: withSelectURL
			? ( url ) => setAttributes( { mediaId: 0, mediaUrl: url } )
			: undefined,
		allowedTypes: ALLOWED_TYPES[ allowedTypes ],
		accept: accept || undefined,
		multiple,
		isAppender,
		disableDropZone,
		dropZoneUIOnly,
		disableMediaButtons,
		labels: { title: labelTitle, instructions: labelInstructions },
		value: mediaId ? { id: mediaId, src: mediaUrl } : undefined,
		mediaPreview:
			withPreview && mediaUrl ? (
				<img src={ mediaUrl } alt="" style={ { maxWidth: '100%' } } />
			) : undefined,
		onError: ( message ) =>
			// eslint-disable-next-line no-console
			console.warn( 'MediaPlaceholder onError:', message ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'MediaPlaceholder', 'component-kitchen-sink' ) }
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
					<TextControl
						label="accept"
						value={ accept }
						help={ __(
							'e.g. image/*,video/*',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { accept: next } )
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
						label="isAppender"
						checked={ isAppender }
						onChange={ ( next ) =>
							setAttributes( { isAppender: next } )
						}
					/>
					<ToggleControl
						label="disableDropZone"
						checked={ disableDropZone }
						onChange={ ( next ) =>
							setAttributes( { disableDropZone: next } )
						}
					/>
					<ToggleControl
						label="dropZoneUIOnly"
						checked={ dropZoneUIOnly }
						onChange={ ( next ) =>
							setAttributes( { dropZoneUIOnly: next } )
						}
					/>
					<ToggleControl
						label="disableMediaButtons"
						checked={ disableMediaButtons }
						onChange={ ( next ) =>
							setAttributes( { disableMediaButtons: next } )
						}
					/>
					<ToggleControl
						label="onSelectURL"
						checked={ withSelectURL }
						onChange={ ( next ) =>
							setAttributes( { withSelectURL: next } )
						}
					/>
					<ToggleControl
						label="mediaPreview"
						checked={ withPreview }
						onChange={ ( next ) =>
							setAttributes( { withPreview: next } )
						}
					/>
					<TextControl
						label="labels.title"
						value={ labelTitle }
						onChange={ ( next ) =>
							setAttributes( { labelTitle: next } )
						}
					/>
					<TextControl
						label="labels.instructions"
						value={ labelInstructions }
						onChange={ ( next ) =>
							setAttributes( { labelInstructions: next } )
						}
					/>
					<Button
						variant="tertiary"
						isDestructive
						size="compact"
						onClick={ () =>
							setAttributes( { mediaId: 0, mediaUrl: '' } )
						}
					>
						{ __( 'Clear media', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>MediaPlaceholder</h3>
				<MediaPlaceholder { ...placeholderProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
