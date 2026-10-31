import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	store as blockEditorStore,
	useBlockDisplayInformation,
	useBlockEditContext,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import './editor.scss';

const TARGET_OPTIONS = [
	{ label: 'self (this block)', value: 'self' },
	{ label: 'parent (root block)', value: 'parent' },
	{ label: 'firstBlock (first top-level block)', value: 'firstBlock' },
	{ label: 'none (empty clientId)', value: 'none' },
];

/**
 * JSON.stringify that survives functions, React elements (the block icon) and
 * circular references.
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
	const { target } = attributes;
	const { clientId } = useBlockEditContext();

	// Resolve the clientId argument from the selected target.
	const targetClientId = useSelect(
		( select ) => {
			const { getBlockRootClientId, getBlockOrder } =
				select( blockEditorStore );
			switch ( target ) {
				case 'parent':
					return getBlockRootClientId( clientId ) ?? '';
				case 'firstBlock':
					return getBlockOrder()[ 0 ] ?? '';
				case 'none':
					return '';
				default:
					return clientId;
			}
		},
		[ target, clientId ]
	);

	const information = useBlockDisplayInformation( targetClientId );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'useBlockDisplayInformation',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="clientId"
						value={ target }
						options={ TARGET_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { target: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useBlockDisplayInformation</h3>
				<p>
					{ __( 'clientId argument:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ targetClientId || '(empty)' }</code>
				</p>
				<pre>{ toJSON( information ) }</pre>
			</div>
		</>
	);
}
