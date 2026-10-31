import { __ } from '@wordpress/i18n';
import {
	BlockColorsStyleSelector,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { Children, cloneElement, useMemo } from '@wordpress/element';
import './editor.scss';

// Creates a wrapper like the TextColor and BackgroundColor components that
// withColors provides: it clones its child, merging in a style (and class)
// that sets one CSS property.
function createColorWrapper( property, value ) {
	return function ColorWrapper( { children, style, className } ) {
		return Children.map( children, ( child ) =>
			cloneElement( child, {
				className: [ child.props.className, className ]
					.filter( Boolean )
					.join( ' ' ),
				style: { ...child.props.style, ...style, [ property ]: value },
			} )
		);
	};
}

export default function Edit( { attributes, setAttributes } ) {
	const { textColor, backgroundColor, popoverText } = attributes;

	// Stable component identities, rebuilt only when a color changes.
	const TextColor = useMemo(
		() => createColorWrapper( 'color', textColor ),
		[ textColor ]
	);
	const BackgroundColor = useMemo(
		() => createColorWrapper( 'backgroundColor', backgroundColor ),
		[ backgroundColor ]
	);

	// Every prop exercised by this block.
	const selectorProps = { TextColor, BackgroundColor };

	return (
		<>
			{ /* A toolbar control, so it lives in BlockControls. */ }
			<BlockControls>
				<BlockColorsStyleSelector { ...selectorProps }>
					<p style={ { margin: 12 } }>{ popoverText }</p>
				</BlockColorsStyleSelector>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockColorsStyleSelector',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="TextColor"
						help={ __(
							'Any CSS color.',
							'component-kitchen-sink'
						) }
						value={ textColor }
						onChange={ ( next ) =>
							setAttributes( { textColor: next } )
						}
					/>
					<TextControl
						label="BackgroundColor"
						help={ __(
							'Any CSS color.',
							'component-kitchen-sink'
						) }
						value={ backgroundColor }
						onChange={ ( next ) =>
							setAttributes( { backgroundColor: next } )
						}
					/>
					<TextControl
						label="children"
						value={ popoverText }
						onChange={ ( next ) =>
							setAttributes( { popoverText: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockColorsStyleSelector</h3>
				<p>
					{ __(
						'Deprecated export: expect a deprecation warning in the console. Select the block and use the colors button in the block toolbar.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
