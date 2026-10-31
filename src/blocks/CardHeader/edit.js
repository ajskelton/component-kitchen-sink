import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Card,
	CardBody,
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
const JUSTIFY_OPTIONS = options( [
	'flex-start',
	'center',
	'flex-end',
	'space-between',
	'space-around',
	'space-evenly',
] );

export default function Edit( { attributes, setAttributes } ) {
	const { size, isBorderless, isShady, justify, gap, title } = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	// CardHeader is a Flex, so Flex props such as justify and gap apply.
	const headerProps = { size, isBorderless, isShady, justify, gap };

	const demo = (
		<Card>
			<CardHeader { ...headerProps }>
				<strong>{ title }</strong>
				<Button variant="secondary" size="small">
					{ __( 'Action', 'component-kitchen-sink' ) }
				</Button>
			</CardHeader>
			<CardBody>
				{ __(
					'CardHeader needs a Card parent.',
					'component-kitchen-sink'
				) }
			</CardBody>
		</Card>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'CardHeader', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="children"
						value={ title }
						onChange={ set( 'title' ) }
					/>
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
				<h3>CardHeader</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
