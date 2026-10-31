import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalWritingModeControl as WritingModeControl,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import './editor.scss';

const VALUE_OPTIONS = [
	{ label: __( 'Unset', 'component-kitchen-sink' ), value: '' },
	{ label: 'horizontal-tb', value: 'horizontal-tb' },
	{ label: 'vertical-rl', value: 'vertical-rl' },
	{ label: 'vertical-lr', value: 'vertical-lr' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { value, className } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		value: value || undefined,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		className: className || undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'WritingModeControl',
						'component-kitchen-sink'
					) }
				>
					<WritingModeControl { ...controlProps } />
					<SelectControl
						label="value"
						value={ value }
						options={ VALUE_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { value: next } )
						}
					/>
					<TextControl
						label="className"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>WritingModeControl</h3>
				<p
					style={ {
						writingMode: value || undefined,
						height: value ? 160 : undefined,
					} }
				>
					{ __(
						'The quick brown fox jumps over the lazy dog.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
