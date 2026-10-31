import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Flex,
	FlexBlock,
	FlexItem,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
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
	const { display, text, gap } = attributes;

	// FlexBlock is a FlexItem that grows to fill the available space.
	const blockProps = { display: display || undefined };

	// FlexBlock only makes sense inside a Flex, between two fixed-size items.
	const demo = (
		<Flex gap={ gap } justify="flex-start">
			<FlexItem>
				<div style={ boxStyle( '#0073aa' ) }>FlexItem</div>
			</FlexItem>
			<FlexBlock { ...blockProps }>
				<div style={ boxStyle( '#e8590c' ) }>{ text }</div>
			</FlexBlock>
			<FlexItem>
				<div style={ boxStyle( '#2b8a3e' ) }>FlexItem</div>
			</FlexItem>
		</Flex>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'FlexBlock', 'component-kitchen-sink' ) }
				>
					{ demo }
					<SelectControl
						label="display"
						value={ display }
						options={ DISPLAY_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { display: next } )
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
				<h3>FlexBlock</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
