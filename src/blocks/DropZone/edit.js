import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	DropZone,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { cog, upload } from '@wordpress/icons';
import './editor.scss';

const ICONS = { upload, cog };

const ICON_OPTIONS = [
	{ label: 'upload (default)', value: 'upload' },
	{ label: 'cog', value: 'cog' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		label,
		icon,
		isEligible,
		useHandlers,
		drops,
		htmlDrops,
		fileDrops,
		lastDrop,
	} = attributes;

	const record = ( kind, countKey, count ) =>
		setAttributes( { [ countKey ]: count + 1, lastDrop: kind } );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const dropZoneProps = {
		label: label || undefined,
		icon: ICONS[ icon ],
		// isEligible only gates the generic onDrop path.
		isEligible: () => isEligible,
		onDrop: () => record( 'onDrop', 'drops', drops ),
		onHTMLDrop: useHandlers
			? () => record( 'onHTMLDrop', 'htmlDrops', htmlDrops )
			: undefined,
		onFilesDrop: useHandlers
			? () => record( 'onFilesDrop', 'fileDrops', fileDrops )
			: undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'DropZone', 'component-kitchen-sink' ) }>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<SelectControl
						label="icon"
						value={ icon }
						options={ ICON_OPTIONS }
						onChange={ ( next ) => setAttributes( { icon: next } ) }
					/>
					<ToggleControl
						label="isEligible"
						checked={ isEligible }
						onChange={ ( next ) =>
							setAttributes( { isEligible: next } )
						}
					/>
					<ToggleControl
						label="onHTMLDrop and onFilesDrop"
						help={ __(
							'Off: only the generic onDrop handler is set.',
							'component-kitchen-sink'
						) }
						checked={ useHandlers }
						onChange={ ( next ) =>
							setAttributes( { useHandlers: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( {
								drops: 0,
								htmlDrops: 0,
								fileDrops: 0,
								lastDrop: '',
							} )
						}
					>
						{ __( 'Reset drop counts', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>DropZone</h3>
				<p>
					{ __(
						'Drag the handle below (or a file from your desktop) over this block.',
						'component-kitchen-sink'
					) }
				</p>
				<div
					draggable
					onDragStart={ ( event ) =>
						event.dataTransfer.setData(
							'text/plain',
							'ajs-drop-zone-demo'
						)
					}
					style={ {
						display: 'inline-block',
						padding: 8,
						background: '#f0f0f0',
						cursor: 'grab',
					} }
				>
					{ __( 'Draggable text', 'component-kitchen-sink' ) }
				</div>
				<div
					style={ {
						position: 'relative',
						marginTop: 12,
						minHeight: 100,
						border: '1px dashed #949494',
					} }
				>
					<p style={ { margin: 0, padding: 16 } }>
						{ `onDrop: ${ drops }, onHTMLDrop: ${ htmlDrops }, onFilesDrop: ${ fileDrops }, last: ${
							lastDrop || '-'
						}` }
					</p>
					<DropZone { ...dropZoneProps } />
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
