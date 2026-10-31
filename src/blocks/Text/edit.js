import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	TextareaControl,
	ToggleControl,
	__experimentalText as Text,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const withDefault = ( values ) => [
	{ label: __( 'Default', 'component-kitchen-sink' ), value: '' },
	...values.map( ( value ) => ( { label: value, value } ) ),
];

const SIZE_OPTIONS = withDefault( [
	'body',
	'caption',
	'footnote',
	'largeTitle',
	'subheadline',
	'title',
] );
const VARIANT_OPTIONS = withDefault( [ 'muted' ] );
const ALIGN_OPTIONS = withDefault( [ 'left', 'center', 'right', 'justify' ] );
const DISPLAY_OPTIONS = withDefault( [ 'block', 'inline', 'inline-block' ] );
const ELLIPSIZE_OPTIONS = [ 'auto', 'head', 'tail', 'middle', 'none' ].map(
	( value ) => ( { label: value, value } )
);

export default function Edit( { attributes, setAttributes } ) {
	const {
		text,
		size,
		variant,
		align,
		color,
		display,
		weight,
		lineHeight,
		letterSpacing,
		isBlock,
		isDestructive,
		upperCase,
		truncate,
		numberOfLines,
		ellipsizeMode,
		limit,
		highlightWords,
		highlightCaseSensitive,
		highlightEscape,
	} = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	// Empty strings and 0 mean "prop not passed".
	const textProps = {
		size: size || undefined,
		variant: variant || undefined,
		align: align || undefined,
		color: color || undefined,
		display: display || undefined,
		weight: weight || undefined,
		lineHeight: lineHeight || undefined,
		letterSpacing: letterSpacing || undefined,
		isBlock,
		isDestructive,
		upperCase,
		truncate,
		numberOfLines: numberOfLines || undefined,
		ellipsizeMode,
		limit: limit || undefined,
		highlightWords: highlightWords
			? highlightWords.split( ',' ).map( ( word ) => word.trim() )
			: undefined,
		highlightCaseSensitive,
		highlightEscape,
	};

	const toggle = ( name ) => (
		<ToggleControl
			label={ name }
			checked={ attributes[ name ] }
			onChange={ set( name ) }
		/>
	);
	const field = ( name, help ) => (
		<TextControl
			label={ name }
			help={ help }
			value={ attributes[ name ] }
			onChange={ set( name ) }
		/>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Text', 'component-kitchen-sink' ) }>
					<TextareaControl
						label="children"
						value={ text }
						onChange={ set( 'text' ) }
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ set( 'size' ) }
					/>
					<SelectControl
						label="variant"
						value={ variant }
						options={ VARIANT_OPTIONS }
						onChange={ set( 'variant' ) }
					/>
					<SelectControl
						label="align"
						value={ align }
						options={ ALIGN_OPTIONS }
						onChange={ set( 'align' ) }
					/>
					<SelectControl
						label="display"
						value={ display }
						options={ DISPLAY_OPTIONS }
						onChange={ set( 'display' ) }
					/>
					{ field( 'color', 'e.g. #c92a2a' ) }
					{ field( 'weight', 'e.g. 300 or bold' ) }
					{ field( 'lineHeight', 'e.g. 2' ) }
					{ field( 'letterSpacing', 'e.g. 0.1em' ) }
					{ toggle( 'isBlock' ) }
					{ toggle( 'isDestructive' ) }
					{ toggle( 'upperCase' ) }
					{ toggle( 'truncate' ) }
					<RangeControl
						label="numberOfLines"
						help={ __(
							'0 leaves the prop unset.',
							'component-kitchen-sink'
						) }
						value={ numberOfLines }
						min={ 0 }
						max={ 6 }
						onChange={ ( next ) =>
							setAttributes( { numberOfLines: next ?? 0 } )
						}
					/>
					<SelectControl
						label="ellipsizeMode"
						value={ ellipsizeMode }
						options={ ELLIPSIZE_OPTIONS }
						onChange={ set( 'ellipsizeMode' ) }
					/>
					<RangeControl
						label="limit"
						help={ __(
							'Characters kept when ellipsizeMode is head, middle or tail.',
							'component-kitchen-sink'
						) }
						value={ limit }
						min={ 0 }
						max={ 150 }
						onChange={ ( next ) =>
							setAttributes( { limit: next ?? 0 } )
						}
					/>
					{ field(
						'highlightWords',
						__( 'Comma separated words.', 'component-kitchen-sink' )
					) }
					{ toggle( 'highlightCaseSensitive' ) }
					{ toggle( 'highlightEscape' ) }
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Text</h3>
				<div style={ { maxWidth: 420 } }>
					<Text { ...textProps }>{ text }</Text>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
