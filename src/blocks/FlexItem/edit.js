import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Flex,
	FlexItem,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const DISPLAY_OPTIONS = [
	{ label: __( 'Default', 'component-kitchen-sink' ), value: '' },
	...[ 'block', 'inline-block', 'flex', 'inline-flex' ].map( ( value ) => ( {
		label: value,
		value,
	} ) ),
];

const boxStyle = ( background ) => ( {
	background,
	color: '#fff',
	padding: '12px',
} );

export default function Edit( { attributes, setAttributes } ) {
	const { display, isBlock, text, gap } = attributes;

	const itemProps = { display: display || undefined, isBlock };

	// FlexItem needs a Flex parent. The middle item is the one under test; the
	// siblings stay plain so the effect of `isBlock` (it fills the free space)
	// is visible.
	const demo = (
		<Flex gap={ gap } justify="flex-start">
			<FlexItem>
				<div style={ boxStyle( '#0073aa' ) }>Sibling</div>
			</FlexItem>
			<FlexItem { ...itemProps }>
				<div style={ boxStyle( '#e8590c' ) }>{ text }</div>
			</FlexItem>
			<FlexItem>
				<div style={ boxStyle( '#2b8a3e' ) }>Sibling</div>
			</FlexItem>
		</Flex>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'FlexItem', 'component-kitchen-sink' ) }>
					{ demo }
					<SelectControl
						label="display"
						value={ display }
						options={ DISPLAY_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { display: next } )
						}
					/>
					<ToggleControl
						label="isBlock"
						checked={ isBlock }
						onChange={ ( next ) =>
							setAttributes( { isBlock: next } )
						}
					/>
					<TextControl
						label="children"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<RangeControl
						label={ __(
							'Flex gap (parent)',
							'component-kitchen-sink'
						) }
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
				<h3>FlexItem</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
