import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	ClipboardButton,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

const VARIANT_OPTIONS = [
	{ label: 'primary', value: 'primary' },
	{ label: 'secondary', value: 'secondary' },
	{ label: 'tertiary', value: 'tertiary' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { text, variant, copies } = attributes;
	const [ hasCopied, setHasCopied ] = useState( false );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const clipboardProps = {
		text,
		variant,
		__next40pxDefaultSize: true,
		onCopy: () => {
			setHasCopied( true );
			setAttributes( { copies: copies + 1 } );
		},
		// Called 4 seconds after onCopy.
		onFinishCopy: () => setHasCopied( false ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ClipboardButton', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="text (copied to the clipboard)"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<SelectControl
						label="variant"
						value={ variant }
						options={ VARIANT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { variant: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { copies: 0 } ) }
					>
						{ __( 'Reset copies', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ClipboardButton</h3>
				{ /* Deprecated since 5.8: logs a deprecation warning when rendered. */ }
				<ClipboardButton { ...clipboardProps }>
					{ hasCopied
						? __( 'Copied!', 'component-kitchen-sink' )
						: __( 'Copy text', 'component-kitchen-sink' ) }
				</ClipboardButton>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
