import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalTextDecorationControl as TextDecorationControl,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import './editor.scss';

const VALUE_OPTIONS = [
	{ label: __( 'Unset', 'component-kitchen-sink' ), value: '' },
	{ label: 'none', value: 'none' },
	{ label: 'underline', value: 'underline' },
	{ label: 'line-through', value: 'line-through' },
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
						'TextDecorationControl',
						'component-kitchen-sink'
					) }
				>
					<TextDecorationControl { ...controlProps } />
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
				<h3>TextDecorationControl</h3>
				<p style={ { textDecoration: value || undefined } }>
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
