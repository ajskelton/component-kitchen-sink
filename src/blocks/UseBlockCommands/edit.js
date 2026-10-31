import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	store as blockEditorStore,
	useBlockCommands,
	useBlockEditContext,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { useRegistry, useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import './editor.scss';

// useBlockCommands() registers its loaders under fixed names, the same names
// the editor registers its own copy under, and unregisters them on unmount.
// Deleting this block would therefore also remove the editor's Duplicate,
// Delete, Group and "Transform to" commands from the command palette.
const COMMANDS_STORE = 'core/commands';
const LOADER_NAMES = [
	'core/block-editor/blockTransforms',
	'core/block-editor/blockQuickActions',
];

/**
 * Calls useBlockCommands(), which registers two command loaders with the
 * command palette ("Transform to …", and quick actions such as Duplicate,
 * Group and Delete for the selected blocks). Mounting this component
 * registers the loaders; unmounting unregisters them.
 *
 * The loader names cannot be changed (they are hard-coded in the hook), and
 * the editor registers the same names itself. So after each render this
 * component keeps a copy of the registered loaders (they are built by the
 * same code as the editor's), and puts them back when it unmounts and the
 * hook has unregistered them.
 */
function BlockCommandsRegistrar() {
	const registry = useRegistry();
	const registeredLoaders = useRef( [] );

	useBlockCommands();

	// Declared after the hook, so these effects run after the hook's own.
	useEffect( () => {
		const selectors = registry.select( COMMANDS_STORE );
		if ( ! selectors?.getCommandLoaders ) {
			return;
		}
		// Contextual loaders (quick actions) only show up with `true`.
		registeredLoaders.current = [
			...selectors.getCommandLoaders( false ),
			...selectors.getCommandLoaders( true ),
		].filter( ( loader ) => LOADER_NAMES.includes( loader.name ) );
	} );

	useEffect( () => {
		return () => {
			// Runs after the hook's cleanup, which unregistered the loaders.
			const actions = registry.dispatch( COMMANDS_STORE );
			registeredLoaders.current.forEach( ( loader ) =>
				actions?.registerCommandLoader?.( loader )
			);
		};
	}, [ registry ] );

	return null;
}

export default function Edit( { attributes, setAttributes } ) {
	const { registerLoader, maxItems } = attributes;
	const { clientId, isSelected } = useBlockEditContext();

	// The same list the "Transform to …" commands are built from.
	const transformItems = useSelect(
		( select ) => {
			const { getBlock, getBlockRootClientId, getBlockTransformItems } =
				select( blockEditorStore );
			const block = getBlock( clientId );
			return block
				? getBlockTransformItems(
						[ block ],
						getBlockRootClientId( clientId )
					)
				: [];
		},
		[ clientId ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'useBlockCommands', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="registerLoader (mount the hook)"
						checked={ registerLoader }
						onChange={ ( next ) =>
							setAttributes( { registerLoader: next } )
						}
					/>
					<RangeControl
						label={ __(
							'Transform items to list',
							'component-kitchen-sink'
						) }
						value={ maxItems }
						min={ 1 }
						max={ 30 }
						onChange={ ( next ) =>
							setAttributes( { maxItems: next ?? 8 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				{ registerLoader && <BlockCommandsRegistrar /> }
				<h3>useBlockCommands</h3>
				<p>
					{ __(
						'The hook returns nothing; its effect is in the command palette. Select this block and press Cmd/Ctrl+K: look for "Transform to …", Duplicate, Add before, Add after, Group and Delete.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>
					{ JSON.stringify(
						{
							loaderMounted: registerLoader,
							blockSelected: isSelected,
							transformCommands: transformItems
								.slice( 0, maxItems )
								.map(
									( item ) => `Transform to ${ item.title }`
								),
							transformCommandsTotal: transformItems.length,
						},
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
