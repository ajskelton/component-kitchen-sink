import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalUseBorderProps as useBorderProps,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { label } = attributes;

	// Reads attributes.style.border and attributes.borderColor (written by the
	// Border panel of the block supports) and returns { className, style }.
	const borderProps = useBorderProps( attributes );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__experimentalUseBorderProps',
						'component-kitchen-sink'
					) }
				>
					<p>
						{ __(
							'Use the Border panel in the Styles tab (color, style, width, radius). The result of the hook is applied to the box in the canvas.',
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
				<h3>useBorderProps</h3>
				<div
					className={ borderProps.className }
					style={ { padding: '1em', ...borderProps.style } }
				>
					{ label }
				</div>
				<pre>
					{ JSON.stringify(
						{ 'useBorderProps( attributes )': borderProps },
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
