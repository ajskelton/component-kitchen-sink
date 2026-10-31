import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	LineHeightControl,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const SIZE_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: 'small', value: 'small' },
	{ label: 'compact', value: 'compact' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { value, size, inputWidth, disabled } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		value: value || undefined,
		onChange: ( next ) => setAttributes( { value: String( next ?? '' ) } ),
		size,
		__unstableInputWidth: inputWidth,
		disabled,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'LineHeightControl',
						'component-kitchen-sink'
					) }
				>
					<LineHeightControl { ...controlProps } />
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<TextControl
						label="__unstableInputWidth"
						value={ inputWidth }
						onChange={ ( next ) =>
							setAttributes( { inputWidth: next } )
						}
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>LineHeightControl</h3>
				<p style={ { lineHeight: value || undefined } }>
					{ __(
						'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
