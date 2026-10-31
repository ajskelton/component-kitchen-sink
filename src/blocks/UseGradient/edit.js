import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalUseGradient as useGradient,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	BaseControl,
	GradientPicker,
	PanelBody,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { label, gradient, customGradient } = attributes;

	// Reads the `gradient` (preset slug) and `customGradient` (CSS value)
	// attributes of this block and returns a class, a value and a setter.
	// The setter stores a preset as a slug, anything else as a custom value.
	const { gradientClass, gradientValue, setGradient } = useGradient();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__experimentalUseGradient',
						'component-kitchen-sink'
					) }
				>
					<BaseControl
						id="ajs-use-gradient-picker"
						label="setGradient( value )"
						help={ __(
							'The Color panel in the Styles tab also writes the gradient attribute (presets).',
							'component-kitchen-sink'
						) }
					>
						<GradientPicker
							value={ gradientValue }
							onChange={ setGradient }
							clearable
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
				<h3>useGradient</h3>
				<div
					className={ gradientClass }
					style={ {
						padding: '1em',
						minHeight: '5em',
						background: gradientValue,
					} }
				>
					{ label }
				</div>
				<pre>
					{ JSON.stringify(
						{
							'useGradient()': { gradientClass, gradientValue },
							attributes: { gradient, customGradient },
						},
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
