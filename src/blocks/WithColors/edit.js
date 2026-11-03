import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	PanelColorSettings,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

function Edit( {
	attributes,
	setAttributes,
	// Injected by withColors:
	backgroundColor,
	setBackgroundColor,
	textColor,
	setTextColor,
	colorUtils,
} ) {
	const { label } = attributes;

	const className = [
		backgroundColor.class,
		textColor.class,
		backgroundColor.color && 'has-background',
		textColor.color && 'has-text-color',
	]
		.filter( Boolean )
		.join( ' ' );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'withColors', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __(
						'withColors setters',
						'component-kitchen-sink'
					) }
					colorSettings={ [
						{
							label: 'setBackgroundColor',
							value: backgroundColor.color,
							onChange: setBackgroundColor,
						},
						{
							label: 'setTextColor',
							value: textColor.color,
							onChange: setTextColor,
						},
					] }
				/>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>withColors</h3>
				<div
					className={ className }
					style={ {
						padding: '1em',
						backgroundColor: backgroundColor.color,
						color: textColor.color,
					} }
				>
					{ label }
				</div>
				<pre>
					{ JSON.stringify(
						{
							'withColors( "backgroundColor", { textColor: "color" } )':
								{
									backgroundColor,
									textColor,
									'colorUtils.getMostReadableColor( backgroundColor.color )':
										backgroundColor.color
											? colorUtils.getMostReadableColor(
													backgroundColor.color
												)
											: null,
								},
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

// Reads the backgroundColor/customBackgroundColor and
// textColor/customTextColor attributes and injects the color objects, their
// setters and colorUtils as props.
export default withColors( 'backgroundColor', { textColor: 'color' } )( Edit );
