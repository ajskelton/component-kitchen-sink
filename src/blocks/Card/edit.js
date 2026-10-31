import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
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
const VARIANT_OPTIONS = options( [
	'primary',
	'secondary',
	'tertiary',
	'dotted',
	'grid',
] );

export default function Edit( { attributes, setAttributes } ) {
	const { size, variant, elevation, isBorderless, isRounded, title } =
		attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	const cardProps = { size, variant, elevation, isBorderless, isRounded };

	// A Card with the three usual children, so `size` padding is visible on
	// each of them.
	const demo = (
		<Card { ...cardProps }>
			<CardHeader>{ title }</CardHeader>
			<CardBody>
				{ __(
					'Card body content. The Card size prop sets the padding of its header, body and footer.',
					'component-kitchen-sink'
				) }
			</CardBody>
			<CardFooter>
				{ __( 'Card footer', 'component-kitchen-sink' ) }
			</CardFooter>
		</Card>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Card', 'component-kitchen-sink' ) }>
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
					<RangeControl
						label="elevation"
						value={ elevation }
						min={ 0 }
						max={ 6 }
						onChange={ ( next ) =>
							setAttributes( { elevation: next ?? 0 } )
						}
					/>
					<ToggleControl
						label="isBorderless"
						checked={ isBorderless }
						onChange={ set( 'isBorderless' ) }
					/>
					<ToggleControl
						label="isRounded"
						checked={ isRounded }
						onChange={ set( 'isRounded' ) }
					/>
					<TextControl
						label={ __(
							'CardHeader children',
							'component-kitchen-sink'
						) }
						value={ title }
						onChange={ set( 'title' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Card</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
