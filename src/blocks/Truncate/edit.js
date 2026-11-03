import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	TextareaControl,
	__experimentalTruncate as Truncate,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const ELLIPSIZE_OPTIONS = [ 'auto', 'head', 'tail', 'middle', 'none' ].map(
	( value ) => ( { label: value, value } )
);

export default function Edit( { attributes, setAttributes } ) {
	const { text, ellipsizeMode, limit, numberOfLines, ellipsis, width } =
		attributes;

	// `limit` needs an ellipsizeMode of head, middle or tail. 0 is "unset".
	const truncateProps = {
		ellipsizeMode,
		limit: limit || undefined,
		numberOfLines: numberOfLines || undefined,
		ellipsis,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Truncate', 'component-kitchen-sink' ) }>
					<TextareaControl
						label="children"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<SelectControl
						label="ellipsizeMode"
						value={ ellipsizeMode }
						options={ ELLIPSIZE_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { ellipsizeMode: next } )
						}
					/>
					<RangeControl
						label="limit"
						help={ __(
							'0 leaves the prop unset.',
							'component-kitchen-sink'
						) }
						value={ limit }
						min={ 0 }
						max={ 120 }
						onChange={ ( next ) =>
							setAttributes( { limit: next ?? 0 } )
						}
					/>
					<RangeControl
						label="numberOfLines"
						help={ __(
							'0 leaves the prop unset.',
							'component-kitchen-sink'
						) }
						value={ numberOfLines }
						min={ 0 }
						max={ 6 }
						onChange={ ( next ) =>
							setAttributes( { numberOfLines: next ?? 0 } )
						}
					/>
					<TextControl
						label="ellipsis"
						value={ ellipsis }
						onChange={ ( next ) =>
							setAttributes( { ellipsis: next } )
						}
					/>
					<RangeControl
						label={ __(
							'Container width (px)',
							'component-kitchen-sink'
						) }
						value={ width }
						min={ 100 }
						max={ 600 }
						onChange={ ( next ) =>
							setAttributes( { width: next ?? 280 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Truncate</h3>
				{ /* Truncate needs a width-constrained parent to clip against. */ }
				<div
					style={ {
						width,
						maxWidth: '100%',
						border: '1px dashed #999',
						padding: 8,
					} }
				>
					<Truncate { ...truncateProps }>{ text }</Truncate>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
