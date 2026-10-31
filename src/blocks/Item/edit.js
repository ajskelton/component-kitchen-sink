import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
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
	const { size, text, clickable, clicks } = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	// Passing onClick makes Item render as a button.
	const itemProps = {
		size,
		onClick: clickable
			? () => setAttributes( { clicks: clicks + 1 } )
			: undefined,
	};

	// Item takes its defaults from an ItemGroup parent, so the demo wraps it
	// and adds plain siblings for comparison.
	const demo = (
		<ItemGroup isBordered isSeparated>
			<Item>{ __( 'Sibling Item', 'component-kitchen-sink' ) }</Item>
			<Item { ...itemProps }>{ text }</Item>
			<Item>{ __( 'Sibling Item', 'component-kitchen-sink' ) }</Item>
		</ItemGroup>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Item', 'component-kitchen-sink' ) }>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ set( 'size' ) }
					/>
					<TextControl
						label="children"
						value={ text }
						onChange={ set( 'text' ) }
					/>
					<ToggleControl
						label="onClick"
						help={ __(
							'Renders the Item as a button that increments clicks.',
							'component-kitchen-sink'
						) }
						checked={ clickable }
						onChange={ set( 'clickable' ) }
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { clicks: 0 } ) }
					>
						{ __( 'Reset clicks', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Item</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
