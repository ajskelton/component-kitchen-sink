import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalInputControl as InputControl,
	__experimentalInputControlPrefixWrapper as InputControlPrefixWrapper,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const SIZE_OPTIONS = [ 'default', 'small', 'compact' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

const VARIANT_OPTIONS = [ 'default', 'icon', 'control' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const { text, size, variant, value } = attributes;

	// The wrapper only makes sense as the `prefix` of an InputControl.
	const inputProps = {
		label: __( 'Input with a prefix', 'component-kitchen-sink' ),
		size,
		value,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		prefix: (
			<InputControlPrefixWrapper size={ size } variant={ variant }>
				{ text }
			</InputControlPrefixWrapper>
		),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'InputControlPrefixWrapper',
						'component-kitchen-sink'
					) }
				>
					<InputControl { ...inputProps } />
					<TextControl
						label="children"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<SelectControl
						label="variant"
						value={ variant }
						options={ VARIANT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { variant: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>InputControlPrefixWrapper</h3>
				<InputControl { ...inputProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
