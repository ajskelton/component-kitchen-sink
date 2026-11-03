import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	MediaReplaceFlow,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	MenuItem,
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
	all: [],
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		mediaId,
		mediaUrl,
		allowedTypes,
		accept,
		name,
		variant,
		withSelectURL,
		withReset,
		withChildren,
		handleUpload,
	} = attributes;

	// Every prop exercised by this block. With handleUpload off, onSelect gets
	// the raw FileList instead of an uploaded media object.
	const replaceFlowProps = {
		mediaId,
		mediaURL: mediaUrl,
		allowedTypes: ALLOWED_TYPES[ allowedTypes ],
		accept: accept || undefined,
		name: name || undefined,
		variant: variant || undefined,
		handleUpload,
		onSelect: ( media ) => {
			if ( ! media?.url ) {
				return;
			}
			setAttributes( { mediaId: media.id ?? 0, mediaUrl: media.url } );
		},
		onSelectURL: withSelectURL
			? ( url ) => setAttributes( { mediaId: 0, mediaUrl: url } )
			: undefined,
		onReset: withReset
			? () => setAttributes( { mediaId: 0, mediaUrl: '' } )
			: undefined,
		onError: ( message ) =>
			// eslint-disable-next-line no-console
			console.warn( 'MediaReplaceFlow onError:', message ),
	};

	return (
		<>
			{ /* The component is a toolbar dropdown, so it lives in BlockControls. */ }
			<BlockControls group="other">
				<MediaReplaceFlow { ...replaceFlowProps }>
					{ withChildren
						? ( { onClose } ) => (
								<MenuItem onClick={ onClose }>
									{ __(
										'Extra child item',
										'component-kitchen-sink'
									) }
								</MenuItem>
							)
						: undefined }
				</MediaReplaceFlow>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'MediaReplaceFlow', 'component-kitchen-sink' ) }
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
						onChange={ ( next ) =>
							setAttributes( { accept: next } )
						}
					/>
					<TextControl
						label="name"
						value={ name }
						help={ __(
							'Label of the toolbar button.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) => setAttributes( { name: next } ) }
					/>
					<SelectControl
						label="variant"
						value={ variant }
						options={ [
							{ label: '(none)', value: '' },
							{ label: 'toolbar', value: 'toolbar' },
						] }
						onChange={ ( next ) =>
							setAttributes( { variant: next } )
						}
					/>
					<ToggleControl
						label="handleUpload"
						checked={ handleUpload }
						onChange={ ( next ) =>
							setAttributes( { handleUpload: next } )
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
						label="onReset"
						checked={ withReset }
						onChange={ ( next ) =>
							setAttributes( { withReset: next } )
						}
					/>
					<ToggleControl
						label="children"
						checked={ withChildren }
						onChange={ ( next ) =>
							setAttributes( { withChildren: next } )
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
				<h3>MediaReplaceFlow</h3>
				<p>
					{ __(
						'Select the block, then use the Replace button in the block toolbar.',
						'component-kitchen-sink'
					) }
				</p>
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
