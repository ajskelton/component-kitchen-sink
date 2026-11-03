import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	FormFileUpload,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { check, cog, plus, upload } from '@wordpress/icons';
import './editor.scss';

/**
 * Icons offered by the icon select. The attribute stores the key, the
 * component receives the icon element from `@wordpress/icons`.
 */
const ICONS = { upload, plus, cog, check };

const ICON_OPTIONS = [
	{ label: __( 'None', 'component-kitchen-sink' ), value: '' },
	...Object.keys( ICONS ).map( ( key ) => ( { label: key, value: key } ) ),
];

const ACCEPT_OPTIONS = [
	{ label: __( 'Any file', 'component-kitchen-sink' ), value: '' },
	{ label: 'image/*', value: 'image/*' },
	{ label: 'application/pdf', value: 'application/pdf' },
	{ label: 'audio/*', value: 'audio/*' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { fileNames, accept, multiple, icon, text, useRenderProp } =
		attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	// A file cannot be persisted in a block attribute, so only the chosen
	// file names are stored.
	const uploadProps = {
		accept: accept || undefined,
		multiple,
		icon: ICONS[ icon ] ?? undefined,
		onChange: ( event ) =>
			setAttributes( {
				fileNames: Array.from( event.currentTarget.files ?? [] ).map(
					( file ) => file.name
				),
			} ),
		onClick: ( event ) => {
			// Allow picking the same file twice in a row.
			event.currentTarget.value = '';
		},
		...( useRenderProp
			? {
					render: ( { openFileDialog } ) => (
						<Button variant="secondary" onClick={ openFileDialog }>
							{ __(
								'Custom render prop button',
								'component-kitchen-sink'
							) }
						</Button>
					),
				}
			: {} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'FormFileUpload', 'component-kitchen-sink' ) }
				>
					<FormFileUpload { ...uploadProps }>{ text }</FormFileUpload>
					<TextControl
						label="children"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<SelectControl
						label="accept"
						value={ accept }
						options={ ACCEPT_OPTIONS }
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
					<SelectControl
						label="icon"
						value={ icon }
						options={ ICON_OPTIONS }
						onChange={ ( next ) => setAttributes( { icon: next } ) }
					/>
					<ToggleControl
						label="render"
						help={ __(
							'Use the render prop to draw a custom trigger.',
							'component-kitchen-sink'
						) }
						checked={ useRenderProp }
						onChange={ ( next ) =>
							setAttributes( { useRenderProp: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { fileNames: [] } ) }
					>
						{ __( 'Clear file names', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>FormFileUpload</h3>
				<FormFileUpload { ...uploadProps }>{ text }</FormFileUpload>
				<ul>
					{ fileNames.map( ( name, index ) => (
						<li key={ `${ name }-${ index }` }>{ name }</li>
					) ) }
				</ul>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
