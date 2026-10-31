import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	SearchControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

const SIZE_OPTIONS = [ 'default', 'compact' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		label,
		help,
		placeholder,
		hideLabelFromVision,
		size,
		showOnClose,
	} = attributes;
	const [ closeCount, setCloseCount ] = useState( 0 );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const searchProps = {
		label,
		help: help || undefined,
		placeholder: placeholder || undefined,
		hideLabelFromVision,
		size,
		value,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		onClose: showOnClose
			? () => setCloseCount( ( count ) => count + 1 )
			: undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'SearchControl', 'component-kitchen-sink' ) }
				>
					<SearchControl { ...searchProps } />
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="help"
						value={ help }
						onChange={ ( next ) => setAttributes( { help: next } ) }
					/>
					<TextControl
						label="placeholder"
						value={ placeholder }
						onChange={ ( next ) =>
							setAttributes( { placeholder: next } )
						}
					/>
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
						}
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<ToggleControl
						label="onClose"
						help={ __(
							'Shows a close button that counts clicks.',
							'component-kitchen-sink'
						) }
						checked={ showOnClose }
						onChange={ ( next ) =>
							setAttributes( { showOnClose: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>SearchControl</h3>
				<SearchControl { ...searchProps } />
				<p>
					{ __( 'onClose calls:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ closeCount }</code>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
