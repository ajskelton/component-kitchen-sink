import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	__experimentalItem as Item,
	__experimentalItemGroup as ItemGroup,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const SIZE_OPTIONS = [ 'small', 'medium', 'large' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const { isBordered, isRounded, isSeparated, size, itemCount } = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	const groupProps = { isBordered, isRounded, isSeparated, size };

	const demo = (
		<ItemGroup { ...groupProps }>
			{ Array.from( { length: itemCount }, ( _, index ) => (
				<Item key={ index }>
					{ __( 'Item', 'component-kitchen-sink' ) } { index + 1 }
				</Item>
			) ) }
		</ItemGroup>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ItemGroup', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="isBordered"
						checked={ isBordered }
						onChange={ set( 'isBordered' ) }
					/>
					<ToggleControl
						label="isRounded"
						checked={ isRounded }
						onChange={ set( 'isRounded' ) }
					/>
					<ToggleControl
						label="isSeparated"
						checked={ isSeparated }
						onChange={ set( 'isSeparated' ) }
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ set( 'size' ) }
					/>
					<RangeControl
						label="children (number of Items)"
						value={ itemCount }
						min={ 1 }
						max={ 8 }
						onChange={ ( next ) =>
							setAttributes( { itemCount: next ?? 3 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ItemGroup</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
