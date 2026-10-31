import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const options = ( values ) =>
	values.map( ( value ) => ( { label: value, value } ) );

const SIZE_OPTIONS = options( [
	'none',
	'xSmall',
	'small',
	'medium',
	'large',
] );
const JUSTIFY_OPTIONS = options( [
	'flex-start',
	'center',
	'flex-end',
	'space-between',
	'space-around',
	'space-evenly',
] );

export default function Edit( { attributes, setAttributes } ) {
	const { size, isBorderless, isShady, justify, gap } = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	// CardFooter is a Flex, so Flex props such as justify and gap apply.
	const footerProps = { size, isBorderless, isShady, justify, gap };

	const demo = (
		<Card>
			<CardBody>
				{ __(
					'CardFooter needs a Card parent.',
					'component-kitchen-sink'
				) }
			</CardBody>
			<CardFooter { ...footerProps }>
				<Button variant="tertiary">
					{ __( 'Cancel', 'component-kitchen-sink' ) }
				</Button>
				<Button variant="primary">
					{ __( 'Save', 'component-kitchen-sink' ) }
				</Button>
			</CardFooter>
		</Card>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'CardFooter', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ set( 'size' ) }
					/>
					<ToggleControl
						label="isBorderless"
						checked={ isBorderless }
						onChange={ set( 'isBorderless' ) }
					/>
					<ToggleControl
						label="isShady"
						checked={ isShady }
						onChange={ set( 'isShady' ) }
					/>
					<SelectControl
						label="justify"
						value={ justify }
						options={ JUSTIFY_OPTIONS }
						onChange={ set( 'justify' ) }
					/>
					<RangeControl
						label="gap"
						value={ gap }
						min={ 0 }
						max={ 10 }
						onChange={ ( next ) =>
							setAttributes( { gap: next ?? 2 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>CardFooter</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
