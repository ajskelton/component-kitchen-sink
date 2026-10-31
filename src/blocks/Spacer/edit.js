import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	TextControl,
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

// Every Spacer spacing prop. Attributes hold strings; an empty string means
// the prop is not passed.
const SPACING_PROPS = [
	'margin',
	'marginTop',
	'marginBottom',
	'marginLeft',
	'marginRight',
	'marginX',
	'marginY',
	'padding',
	'paddingTop',
	'paddingBottom',
	'paddingLeft',
	'paddingRight',
	'paddingX',
	'paddingY',
];

// SpaceInput is a number (multiplier of 4px) or a CSS length string.
const toSpaceInput = ( value ) => {
	if ( value === '' ) {
		return undefined;
	}
	return /^-?\d+(\.\d+)?$/.test( value ) ? Number( value ) : value;
};

const box = ( background ) => ( {
	background,
	color: '#fff',
	padding: '8px 12px',
} );

export default function Edit( { attributes, setAttributes } ) {
	const spacerProps = {};
	for ( const name of SPACING_PROPS ) {
		spacerProps[ name ] = toSpaceInput( attributes[ name ] );
	}

	// The Spacer is tinted so its padding area is visible next to its margin.
	const demo = (
		<div style={ { border: '1px dashed #999', padding: 8 } }>
			<div style={ box( '#0073aa' ) }>Before</div>
			<Spacer
				{ ...spacerProps }
				style={ {
					background: '#ffe066',
					outline: '1px solid #f08c00',
				} }
			>
				<div style={ box( '#e8590c' ) }>Spacer content</div>
			</Spacer>
			<div style={ box( '#2b8a3e' ) }>After</div>
		</div>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Spacer', 'component-kitchen-sink' ) }>
					<p>
						{ __(
							'A number is a multiple of 4px. A string such as 10px is used as is. Empty leaves the prop unset (marginBottom then defaults to 2).',
							'component-kitchen-sink'
						) }
					</p>
					{ SPACING_PROPS.map( ( name ) => (
						<TextControl
							key={ name }
							label={ name }
							value={ attributes[ name ] }
							onChange={ ( next ) =>
								setAttributes( { [ name ]: next } )
							}
						/>
					) ) }
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Spacer</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
