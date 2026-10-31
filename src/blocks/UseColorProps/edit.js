import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalUseColorProps as useColorProps,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { label } = attributes;

	// Reads backgroundColor, textColor, gradient and style.color (written by
	// the Color panel of the block supports) and returns { className, style }.
	const colorProps = useColorProps( attributes );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__experimentalUseColorProps',
						'component-kitchen-sink'
					) }
				>
					<p>
						{ __(
							'Use the Color panel in the Styles tab (text, background, gradient). The result of the hook is applied to the box in the canvas.',
							'component-kitchen-sink'
						) }
					</p>
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
				<h3>useColorProps</h3>
				<div
					className={ colorProps.className }
					style={ { padding: '1em', ...colorProps.style } }
				>
					{ label }
				</div>
				<pre>
					{ JSON.stringify(
						{ 'useColorProps( attributes )': colorProps },
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
