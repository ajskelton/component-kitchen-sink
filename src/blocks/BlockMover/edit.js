import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	BlockMover,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	RangeControl,
	Toolbar,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

function createSampleBlocks( count ) {
	return Array.from( { length: count }, ( _, index ) =>
		createBlock( 'core/paragraph', {
			content: 'Block ' + ( index + 1 ) + ' (use the mover to reorder)',
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

/**
 * Renders BlockMover for the blocks starting at `index` in the nested store.
 *
 * @param {Object}  props                Props.
 * @param {number}  props.index          Index of the first block to move.
 * @param {number}  props.length         How many consecutive blocks to move.
 * @param {boolean} props.hideDragHandle BlockMover hideDragHandle prop.
 */
function MoverForBlocks( { index, length, hideDragHandle } ) {
	const clientIds = useSelect(
		( select ) =>
			select( blockEditorStore )
				.getBlockOrder()
				.slice( index, index + length ),
		[ index, length ]
	);
	return (
		<BlockMover clientIds={ clientIds } hideDragHandle={ hideDragHandle } />
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { blockCount, targetIndex, moveLength, hideDragHandle } = attributes;
	const index = Math.min( targetIndex, blockCount - 1 );
	const length = Math.min( moveLength, blockCount - index );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockMover', 'component-kitchen-sink' ) }
				>
					<RangeControl
						label="blocks in state"
						min={ 2 }
						max={ 5 }
						value={ blockCount }
						onChange={ ( next ) =>
							setAttributes( { blockCount: next } )
						}
					/>
					<RangeControl
						label="clientIds (start index)"
						min={ 0 }
						max={ 4 }
						value={ targetIndex }
						onChange={ ( next ) =>
							setAttributes( { targetIndex: next } )
						}
					/>
					<RangeControl
						label="clientIds (length)"
						min={ 1 }
						max={ 3 }
						value={ moveLength }
						onChange={ ( next ) =>
							setAttributes( { moveLength: next } )
						}
					/>
					<ToggleControl
						label="hideDragHandle"
						checked={ hideDragHandle }
						onChange={ ( next ) =>
							setAttributes( { hideDragHandle: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockMover</h3>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<Toolbar
						label={ __( 'Nested mover', 'component-kitchen-sink' ) }
					>
						<MoverForBlocks
							index={ index }
							length={ length }
							hideDragHandle={ hideDragHandle }
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
