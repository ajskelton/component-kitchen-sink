import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalHeading as Heading,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const LEVEL_OPTIONS = [ 1, 2, 3, 4, 5, 6 ].map( ( level ) => ( {
	label: String( level ),
	value: String( level ),
} ) );

const ALIGN_OPTIONS = [
	{ label: __( 'Default', 'component-kitchen-sink' ), value: '' },
	...[ 'left', 'center', 'right', 'justify' ].map( ( value ) => ( {
		label: value,
		value,
	} ) ),
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		text,
		level,
		align,
		color,
		weight,
		isBlock,
		isDestructive,
		truncate,
		upperCase,
		letterSpacing,
		lineHeight,
		highlightWords,
	} = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	// Empty strings mean "prop not passed".
	const headingProps = {
		level,
		align: align || undefined,
		color: color || undefined,
		weight: weight || undefined,
		isBlock,
		isDestructive,
		truncate,
		upperCase,
		letterSpacing: letterSpacing || undefined,
		lineHeight: lineHeight || undefined,
		highlightWords: highlightWords
			? highlightWords.split( ',' ).map( ( word ) => word.trim() )
			: undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Heading', 'component-kitchen-sink' ) }>
					<TextControl
						label="children"
						value={ text }
						onChange={ set( 'text' ) }
					/>
					<SelectControl
						label="level"
						value={ String( level ) }
						options={ LEVEL_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { level: Number( next ) } )
						}
					/>
					<SelectControl
						label="align"
						value={ align }
						options={ ALIGN_OPTIONS }
						onChange={ set( 'align' ) }
					/>
					<TextControl
						label="color"
						help="e.g. #c92a2a"
						value={ color }
						onChange={ set( 'color' ) }
					/>
					<TextControl
						label="weight"
						help="e.g. 300 or 800"
						value={ weight }
						onChange={ set( 'weight' ) }
					/>
					<TextControl
						label="letterSpacing"
						help="e.g. 0.2em"
						value={ letterSpacing }
						onChange={ set( 'letterSpacing' ) }
					/>
					<TextControl
						label="lineHeight"
						help="e.g. 2"
						value={ lineHeight }
						onChange={ set( 'lineHeight' ) }
					/>
					<TextControl
						label="highlightWords"
						help={ __(
							'Comma separated words.',
							'component-kitchen-sink'
						) }
						value={ highlightWords }
						onChange={ set( 'highlightWords' ) }
					/>
					<ToggleControl
						label="isBlock"
						help={ __(
							'Truncation only works when isBlock is off.',
							'component-kitchen-sink'
						) }
						checked={ isBlock }
						onChange={ set( 'isBlock' ) }
					/>
					<ToggleControl
						label="isDestructive"
						checked={ isDestructive }
						onChange={ set( 'isDestructive' ) }
					/>
					<ToggleControl
						label="truncate"
						checked={ truncate }
						onChange={ set( 'truncate' ) }
					/>
					<ToggleControl
						label="upperCase"
						checked={ upperCase }
						onChange={ set( 'upperCase' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Heading</h3>
				<div style={ { maxWidth: 360 } }>
					<Heading { ...headingProps }>{ text }</Heading>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
