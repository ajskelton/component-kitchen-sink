import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';
import './editor.scss';

/**
 * JSON.stringify that survives functions (the `ref` callback), React elements
 * and circular references.
 *
 * @param {unknown} value Value to print.
 * @return {string} Pretty JSON.
 */
function toJSON( value ) {
	const seen = new WeakSet();
	return JSON.stringify(
		value,
		( key, val ) => {
			if ( typeof val === 'function' ) {
				return '[Function]';
			}
			if ( val && typeof val === 'object' ) {
				if ( '$$typeof' in val ) {
					return '[React element]';
				}
				if ( seen.has( val ) ) {
					return '[Circular]';
				}
				seen.add( val );
			}
			return val;
		},
		2
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { extraClassName, dataDemo, backgroundColor, outlineWidth } =
		attributes;

	// The props passed to useBlockProps are merged with the editor's own
	// (id, class, tabindex, aria-label, data-block, ref, ...).
	const blockProps = useBlockProps( {
		className: extraClassName,
		'data-demo': dataDemo,
		style: {
			backgroundColor,
			outline: `${ outlineWidth }px solid #3858e9`,
		},
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'useBlockProps', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="props.className"
						value={ extraClassName }
						onChange={ ( next ) =>
							setAttributes( { extraClassName: next } )
						}
					/>
					<TextControl
						label="props['data-demo']"
						value={ dataDemo }
						onChange={ ( next ) =>
							setAttributes( { dataDemo: next } )
						}
					/>
					<TextControl
						label="props.style.backgroundColor"
						type="color"
						value={ backgroundColor }
						onChange={ ( next ) =>
							setAttributes( { backgroundColor: next } )
						}
					/>
					<RangeControl
						label="props.style.outline (width)"
						value={ outlineWidth }
						min={ 0 }
						max={ 10 }
						onChange={ ( next ) =>
							setAttributes( { outlineWidth: next ?? 0 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<h3>useBlockProps</h3>
				<p>
					{ __(
						'This wrapper element is the block: it received the props below.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>{ toJSON( blockProps ) }</pre>
			</div>
		</>
	);
}
