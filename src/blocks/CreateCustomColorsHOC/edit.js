import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	createCustomColorsHOC,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	ColorPalette,
	PanelBody,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

const BRAND_COLORS = [
	{ name: 'Brand red', slug: 'brand-red', color: '#c1121f' },
	{ name: 'Brand navy', slug: 'brand-navy', color: '#003049' },
	{ name: 'Brand sand', slug: 'brand-sand', color: '#fdf0d5' },
];

// A HOC factory bound to a fixed palette, instead of the editor's palette.
const withBrandColors = createCustomColorsHOC( BRAND_COLORS );

function Edit( {
	attributes,
	setAttributes,
	// Injected by the HOC:
	backgroundColor,
	setBackgroundColor,
	borderColor,
	setBorderColor,
} ) {
	const { label } = attributes;

	const className = [ backgroundColor.class, borderColor.class ]
		.filter( Boolean )
		.join( ' ' );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'createCustomColorsHOC',
						'component-kitchen-sink'
					) }
				>
					<BaseControl
						id="ajs-custom-colors-background"
						label="setBackgroundColor"
					>
						<ColorPalette
							colors={ BRAND_COLORS }
							value={ backgroundColor.color }
							onChange={ setBackgroundColor }
						/>
					</BaseControl>
					<BaseControl
						id="ajs-custom-colors-border"
						label="setBorderColor"
					>
						<ColorPalette
							colors={ BRAND_COLORS }
							value={ borderColor.color }
							onChange={ setBorderColor }
						/>
					</BaseControl>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>createCustomColorsHOC</h3>
				<div
					className={ className }
					style={ {
						padding: '1em',
						backgroundColor: backgroundColor.color,
						border: `4px solid ${
							borderColor.color ?? 'transparent'
						}`,
					} }
				>
					{ label }
				</div>
				<pre>
					{ JSON.stringify(
						{
							'createCustomColorsHOC( palette )( "backgroundColor", "borderColor" )':
								{ backgroundColor, borderColor },
							attributes,
						},
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}

export default withBrandColors( 'backgroundColor', 'borderColor' )( Edit );
