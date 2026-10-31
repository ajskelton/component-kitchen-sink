import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	SelectControl,
	TextControl,
	__experimentalDivider as Divider,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const ORIENTATION_OPTIONS = [
	{ label: 'horizontal', value: 'horizontal' },
	{ label: 'vertical', value: 'vertical' },
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
	const { orientation, margin, marginStart, marginEnd } = attributes;

	const dividerProps = {
		orientation,
		margin: toSpaceInput( margin ),
		marginStart: toSpaceInput( marginStart ),
		marginEnd: toSpaceInput( marginEnd ),
	};

	// A vertical Divider needs a row container whose items stretch.
	const isVertical = orientation === 'vertical';

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Divider', 'component-kitchen-sink' ) }>
					<SelectControl
						label="orientation"
						value={ orientation }
						options={ ORIENTATION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { orientation: next } )
						}
					/>
					<TextControl
						label="margin"
						help="Number (x4px) or CSS length"
						value={ margin }
						onChange={ ( next ) =>
							setAttributes( { margin: next } )
						}
					/>
					<TextControl
						label="marginStart"
						value={ marginStart }
						onChange={ ( next ) =>
							setAttributes( { marginStart: next } )
						}
					/>
					<TextControl
						label="marginEnd"
						value={ marginEnd }
						onChange={ ( next ) =>
							setAttributes( { marginEnd: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Divider</h3>
				<div
					style={ {
						display: 'flex',
						flexDirection: isVertical ? 'row' : 'column',
						alignItems: 'stretch',
						border: '1px dashed #999',
						padding: 8,
					} }
				>
					<div style={ box( '#0073aa' ) }>Above / left</div>
					<Divider { ...dividerProps } />
					<div style={ box( '#e8590c' ) }>Below / right</div>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
