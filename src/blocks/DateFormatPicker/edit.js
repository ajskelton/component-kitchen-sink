import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalDateFormatPicker as DateFormatPicker,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

// wp.date is loaded in the editor as a dependency of the block editor.
const dateI18n = ( format, date ) =>
	window.wp?.date?.dateI18n?.( format, date ) ?? date.toLocaleDateString();

export default function Edit( { attributes, setAttributes } ) {
	const { format, defaultFormat } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	// An empty format attribute stands for `null` (the Default switch).
	const pickerProps = {
		format: format || null,
		defaultFormat,
		onChange: ( next ) => setAttributes( { format: next ?? '' } ),
	};

	const shownFormat =
		format && format !== 'human-diff' ? format : defaultFormat;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'DateFormatPicker', 'component-kitchen-sink' ) }
				>
					<DateFormatPicker { ...pickerProps } />
					<TextControl
						label="defaultFormat"
						value={ defaultFormat }
						onChange={ ( next ) =>
							setAttributes( { defaultFormat: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>DateFormatPicker</h3>
				<p>
					{ format === 'human-diff'
						? __(
								'Human time difference',
								'component-kitchen-sink'
							)
						: dateI18n( shownFormat, new Date() ) }
				</p>
				<DateFormatPicker { ...pickerProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
