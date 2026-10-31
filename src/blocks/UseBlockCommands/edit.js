import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	store as blockEditorStore,
	useBlockCommands,
	useBlockEditContext,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import './editor.scss';

/**
 * Calls useBlockCommands(), which registers two command loaders with the
 * command palette ("Transform to …", and quick actions such as Duplicate,
 * Group and Delete for the selected blocks). Mounting this component
 * registers the loaders; unmounting unregisters them.
 */
function BlockCommandsRegistrar() {
	useBlockCommands();
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
