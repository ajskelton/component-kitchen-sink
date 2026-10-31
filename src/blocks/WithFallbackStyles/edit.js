import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import {
	Button,
	PanelBody,
	SelectControl,
	withFallbackStyles,
} from '@wordpress/components';
import './editor.scss';

const VARIANT_OPTIONS = [ 'primary', 'secondary', 'tertiary' ].map(
	( value ) => ( { label: value, value } )
);

/**
 * Wrapped component. `fallbackBackgroundColor` and `fallbackTextColor` are
 * injected by the HOC after it measures the rendered Button.
 *
 * @param {Object}   props                         Component props.
 * @param {string}   props.variant                 Button variant being measured.
 * @param {string}   props.fallbackBackgroundColor Measured background colour.
 * @param {string}   props.fallbackTextColor       Measured text colour.
 * @param {()=>void} props.onMeasured              Receives the measured colours.
 */
function StylesDemo( {
	variant,
	fallbackBackgroundColor,
	fallbackTextColor,
	onMeasured,
} ) {
	useEffect( () => {
		if ( fallbackBackgroundColor || fallbackTextColor ) {
			onMeasured( fallbackBackgroundColor, fallbackTextColor );
		}
	}, [ fallbackBackgroundColor, fallbackTextColor, onMeasured ] );

	return (
		<div>
			<Button
				variant={ variant }
			>{ `Measured ${ variant } button` }</Button>
			<ul>
				<li>{ `fallbackBackgroundColor: ${ fallbackBackgroundColor }` }</li>
				<li>{ `fallbackTextColor: ${ fallbackTextColor }` }</li>
			</ul>
		</div>
	);
}

// Created once at module level. mapNodeToProps reads computed styles from the
// wrapper node; use the node's own window so it works inside the canvas iframe.
const StylesDemoWithFallbackStyles = withFallbackStyles( ( node ) => {
	const button = node.querySelector( 'button' );
	if ( ! button ) {
		return {};
	}
	const styles = node.ownerDocument.defaultView.getComputedStyle( button );
	return {
		fallbackBackgroundColor: styles.backgroundColor,
		fallbackTextColor: styles.color,
	};
} )( StylesDemo );

export default function Edit( { attributes, setAttributes } ) {
	const { variant, measuredBackground, measuredColor } = attributes;

	const onMeasured = ( background, color ) => {
		if ( background !== measuredBackground || color !== measuredColor ) {
			setAttributes( {
				measuredBackground: background,
				measuredColor: color,
			} );
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'withFallbackStyles',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="Button variant to measure"
						value={ variant }
						options={ VARIANT_OPTIONS }
						help={ __(
							'The HOC measures once until every style resolves, so the demo remounts when this changes.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { variant: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>withFallbackStyles</h3>
				<StylesDemoWithFallbackStyles
					key={ variant }
					variant={ variant }
					onMeasured={ onMeasured }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
