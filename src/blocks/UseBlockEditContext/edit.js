import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockEditContext,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import './editor.scss';

/**
 * JSON.stringify that survives functions, React elements and circular
 * references.
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
	const { showSymbolKeys } = attributes;
	const context = useBlockEditContext();

	// The context also carries values under private Symbol keys, which
	// JSON.stringify skips. Read them out so they are visible.
	const symbolEntries = Object.fromEntries(
		Object.getOwnPropertySymbols( context ).map( ( symbol ) => [
			String( symbol.description ),
			context[ symbol ],
		] )
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'useBlockEditContext',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="show Symbol-keyed entries"
						checked={ showSymbolKeys }
						onChange={ ( next ) =>
							setAttributes( { showSymbolKeys: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useBlockEditContext</h3>
				<p>{ __( 'Return value:', 'component-kitchen-sink' ) }</p>
				<pre>
					{ toJSON(
						showSymbolKeys
							? { ...context, symbolKeys: symbolEntries }
							: context
					) }
				</pre>
			</div>
		</>
	);
}
