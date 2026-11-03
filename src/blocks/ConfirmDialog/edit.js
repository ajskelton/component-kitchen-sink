import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	Button,
	__experimentalConfirmDialog as ConfirmDialog,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const SIZE_OPTIONS = [
	{ label: 'small', value: 'small' },
	{ label: 'medium', value: 'medium' },
	{ label: 'large', value: 'large' },
	{ label: 'fill', value: 'fill' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		message,
		title,
		confirmButtonText,
		cancelButtonText,
		size,
		isBusy,
		hideHeader,
		timesOpened,
		result,
	} = attributes;
	// Controlled mode: the parent owns `isOpen`.
	const [ isOpen, setIsOpen ] = useState( false );

	const open = () => {
		setAttributes( { timesOpened: timesOpened + 1 } );
		setIsOpen( true );
	};
	const confirm = () => {
		setAttributes( { result: 'confirmed' } );
		setIsOpen( false );
	};
	const cancel = () => {
		setAttributes( { result: 'cancelled' } );
		setIsOpen( false );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ConfirmDialog', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="children (message)"
						value={ message }
						onChange={ ( next ) =>
							setAttributes( { message: next } )
						}
					/>
					<TextControl
						label="title"
						value={ title }
						help={ __(
							'Only visible when __experimentalHideHeader is off.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
						}
					/>
					<TextControl
						label="confirmButtonText"
						value={ confirmButtonText }
						onChange={ ( next ) =>
							setAttributes( { confirmButtonText: next } )
						}
					/>
					<TextControl
						label="cancelButtonText"
						value={ cancelButtonText }
						onChange={ ( next ) =>
							setAttributes( { cancelButtonText: next } )
						}
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<ToggleControl
						label="isBusy"
						checked={ isBusy }
						onChange={ ( next ) =>
							setAttributes( { isBusy: next } )
						}
					/>
					<ToggleControl
						label="__experimentalHideHeader"
						checked={ hideHeader }
						onChange={ ( next ) =>
							setAttributes( { hideHeader: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( { timesOpened: 0, result: '' } )
						}
					>
						{ __( 'Reset counters', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ConfirmDialog</h3>
				<Button variant="secondary" onClick={ open }>
					{ __( 'Open ConfirmDialog', 'component-kitchen-sink' ) }
				</Button>
				<p>
					{ `Opened ${ timesOpened } time(s). Last result: ${
						result || 'n/a'
					}` }
				</p>
				<ConfirmDialog
					isOpen={ isOpen }
					title={ title }
					size={ size }
					isBusy={ isBusy }
					__experimentalHideHeader={ hideHeader }
					confirmButtonText={ confirmButtonText || undefined }
					cancelButtonText={ cancelButtonText || undefined }
					onConfirm={ confirm }
					onCancel={ cancel }
				>
					{ message }
				</ConfirmDialog>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
