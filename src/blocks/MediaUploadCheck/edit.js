import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const {
		simulateNoPermission,
		withFallback,
		fallbackMessage,
		childLabel,
		mediaUrl,
	} = attributes;

	const settings = useSelect(
		( select ) => select( blockEditorStore ).getSettings(),
		[]
	);

	// Every prop exercised by this block: `fallback` and `children`.
	const check = (
		<MediaUploadCheck
			fallback={
				withFallback ? <p role="status">{ fallbackMessage }</p> : null
			}
		>
			<MediaUpload
				allowedTypes={ [ 'image' ] }
				onSelect={ ( media ) =>
					setAttributes( { mediaUrl: media?.url ?? '' } )
				}
				render={ ( { open } ) => (
					<Button variant="secondary" onClick={ open }>
						{ childLabel }
					</Button>
				) }
			/>
		</MediaUploadCheck>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'MediaUploadCheck', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="simulate no upload permission"
						checked={ simulateNoPermission }
						help={ __(
							'Renders the check inside a nested editor whose settings have no mediaUpload, so the fallback shows.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { simulateNoPermission: next } )
						}
					/>
					<ToggleControl
						label="fallback"
						checked={ withFallback }
						onChange={ ( next ) =>
							setAttributes( { withFallback: next } )
						}
					/>
					<TextControl
						label="fallback text"
						value={ fallbackMessage }
						onChange={ ( next ) =>
							setAttributes( { fallbackMessage: next } )
						}
					/>
					<TextControl
						label="children (button label)"
						value={ childLabel }
						onChange={ ( next ) =>
							setAttributes( { childLabel: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>MediaUploadCheck</h3>
				<p>
					{ `settings.mediaUpload: ${
						settings.mediaUpload ? 'available' : 'missing'
					}` }
				</p>
				{ simulateNoPermission ? (
					<BlockEditorProvider
						value={ [] }
						onInput={ () => {} }
						onChange={ () => {} }
						settings={ { ...settings, mediaUpload: undefined } }
					>
						{ check }
					</BlockEditorProvider>
				) : (
					check
				) }
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
