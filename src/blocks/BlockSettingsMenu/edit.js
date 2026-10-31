import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	BlockSettingsMenu,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	MenuGroup,
	MenuItem,
	PanelBody,
	RangeControl,
	TextControl,
	Toolbar,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

function createSampleBlocks( count ) {
	return Array.from( { length: count }, ( _, index ) =>
		createBlock( 'core/paragraph', {
			content: 'Block ' + ( index + 1 ),
		} )
	);
}

function NestedEditor( { blockCount, children } ) {
	const [ blocks, setBlocks ] = useState( () =>
		createSampleBlocks( blockCount )
	);
	return (
		<BlockEditorProvider
			value={ blocks }
			onInput={ setBlocks }
			onChange={ setBlocks }
			settings={ EDITOR_SETTINGS }
		>
			{ children }
		</BlockEditorProvider>
	);
}

// A custom child for the menu. `children` is passed as a render function
// because the dropdown calls it with `{ onClose }`.
function ExtraItem( { onClose, onClick } ) {
	return (
		<MenuGroup>
			<MenuItem
				onClick={ () => {
					onClick();
					onClose?.();
				} }
			>
				{ __(
					'Custom child item (counts clicks)',
					'component-kitchen-sink'
				) }
			</MenuItem>
		</MenuGroup>
	);
}

// Renders BlockSettingsMenu for one block of the nested store.
function MenuForBlock( {
	index,
	label,
	withExtraItem,
	selectOnAction,
	onExtra,
} ) {
	const clientIds = useSelect(
		( select ) => {
			const id = select( blockEditorStore ).getBlockOrder()[ index ];
			return id ? [ id ] : [];
		},
		[ index ]
	);
	const { selectBlock } = useDispatch( blockEditorStore );
	const menuProps = { clientIds, label };
	if ( selectOnAction ) {
		menuProps.__experimentalSelectBlock = ( id ) => selectBlock( id );
	}
	return (
		<BlockSettingsMenu { ...menuProps }>
			{ ( { onClose } ) =>
				withExtraItem ? (
					<ExtraItem onClose={ onClose } onClick={ onExtra } />
				) : null
			}
		</BlockSettingsMenu>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		blockCount,
		targetIndex,
		label,
		withExtraItem,
		selectOnAction,
		clicks,
	} = attributes;
	const index = Math.min( targetIndex, blockCount - 1 );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockSettingsMenu',
						'component-kitchen-sink'
					) }
				>
					<RangeControl
						label="blocks in state"
						min={ 1 }
						max={ 4 }
						value={ blockCount }
						onChange={ ( next ) =>
							setAttributes( { blockCount: next } )
						}
					/>
					<RangeControl
						label="clientIds (block index)"
						min={ 0 }
						max={ 3 }
						value={ targetIndex }
						onChange={ ( next ) =>
							setAttributes( { targetIndex: next } )
						}
					/>
					<TextControl
						label="label (passed to the DropdownMenu)"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<ToggleControl
						label="children (custom menu item)"
						checked={ withExtraItem }
						onChange={ ( next ) =>
							setAttributes( { withExtraItem: next } )
						}
					/>
					<ToggleControl
						label="__experimentalSelectBlock"
						help={ __(
							'When set, duplicating or removing selects a block through this callback.',
							'component-kitchen-sink'
						) }
						checked={ selectOnAction }
						onChange={ ( next ) =>
							setAttributes( { selectOnAction: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { clicks: 0 } ) }
					>
						{ __( 'Reset clicks', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockSettingsMenu</h3>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<Toolbar
						label={ __( 'Nested menu', 'component-kitchen-sink' ) }
					>
						<MenuForBlock
							index={ index }
							label={ label }
							withExtraItem={ withExtraItem }
							selectOnAction={ selectOnAction }
							onExtra={ () =>
								setAttributes( { clicks: clicks + 1 } )
							}
						/>
					</Toolbar>
					<div
						style={ {
							border: '1px dashed #949494',
							padding: '8px',
							marginTop: '8px',
						} }
					>
						<BlockList />
					</div>
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
