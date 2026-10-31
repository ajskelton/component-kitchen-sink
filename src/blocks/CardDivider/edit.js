import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Card,
	CardBody,
	CardDivider,
	PanelBody,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

// SpaceInput is a number (multiplier of 4px) or a CSS length string.
const toSpaceInput = ( value ) => {
	if ( value === '' ) {
		return undefined;
	}
	return /^-?\d+(\.\d+)?$/.test( value ) ? Number( value ) : value;
};

export default function Edit( { attributes, setAttributes } ) {
	const { margin, marginStart, marginEnd } = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	// CardDivider is a Divider, so it takes the Divider margin props.
	const dividerProps = {
		margin: toSpaceInput( margin ),
		marginStart: toSpaceInput( marginStart ),
		marginEnd: toSpaceInput( marginEnd ),
	};

	const demo = (
		<Card>
			<CardBody>
				{ __( 'First CardBody', 'component-kitchen-sink' ) }
			</CardBody>
			<CardDivider { ...dividerProps } />
			<CardBody>
				{ __( 'Second CardBody', 'component-kitchen-sink' ) }
			</CardBody>
		</Card>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'CardDivider', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="margin"
						help="Number (x4px) or CSS length"
						value={ margin }
						onChange={ set( 'margin' ) }
					/>
					<TextControl
						label="marginStart"
						value={ marginStart }
						onChange={ set( 'marginStart' ) }
					/>
					<TextControl
						label="marginEnd"
						value={ marginEnd }
						onChange={ set( 'marginEnd' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>CardDivider</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
