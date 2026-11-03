import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	VisuallyHidden,
} from '@wordpress/components';
import './editor.scss';

const AS_OPTIONS = [
	{ label: 'div (default)', value: 'div' },
	{ label: 'span', value: 'span' },
	{ label: 'h4', value: 'h4' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { text, as, showMirror } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const hiddenProps = { as };

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'VisuallyHidden', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="children"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<SelectControl
						label="as"
						value={ as }
						options={ AS_OPTIONS }
						onChange={ ( next ) => setAttributes( { as: next } ) }
					/>
					<ToggleControl
						label="show the hidden text below (debug)"
						checked={ showMirror }
						onChange={ ( next ) =>
							setAttributes( { showMirror: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>VisuallyHidden</h3>
				<p>
					{ __(
						'The text after this sentence is hidden visually but still exposed to assistive technology:',
						'component-kitchen-sink'
					) }
				</p>
				<VisuallyHidden { ...hiddenProps }>{ text }</VisuallyHidden>
				{ showMirror && (
					<p>
						<em>{ `Hidden text is: "${ text }"` }</em>
					</p>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
