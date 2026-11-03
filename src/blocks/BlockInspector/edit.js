import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockInspector,
	BlockList,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

const SAMPLE_BLOCKS = [
	() => createBlock( 'core/paragraph', { content: 'A paragraph' } ),
	() => createBlock( 'core/heading', { level: 3, content: 'A heading' } ),
	() => createBlock( 'core/separator' ),
	() => createBlock( 'core/spacer', { height: '24px' } ),
];

function NestedEditor( { blockCount, children } ) {
	const [ blocks, setBlocks ] = useState( () =>
		SAMPLE_BLOCKS.slice( 0, blockCount ).map( ( make ) => make() )
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
 * Selects the block at `index` in the nested store so the inspector has
 * something to show. Passing `null` as the position avoids stealing focus.
 *
 * @param {Object} props       Props.
 * @param {number} props.index Index of the block to select.
 */
function SelectBlock( { index } ) {
	const clientId = useSelect(
		( select ) => select( blockEditorStore ).getBlockOrder()[ index ],
		[ index ]
	);
	const { selectBlock } = useDispatch( blockEditorStore );
	useEffect( () => {
		if ( clientId ) {
			selectBlock( clientId, null );
		}
	}, [ clientId, selectBlock ] );
	return null;
}

export default function Edit( { attributes, setAttributes } ) {
	const { blockCount, preselect, selectedIndex } = attributes;
	const index = Math.min( selectedIndex, blockCount - 1 );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockInspector', 'component-kitchen-sink' ) }
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
					<ToggleControl
						label="select a block on mount (not a prop)"
						help={ __(
							'BlockInspector has no props; it shows the settings of whatever is selected in the nearest block editor.',
							'component-kitchen-sink'
						) }
						checked={ preselect }
						onChange={ ( next ) =>
							setAttributes( { preselect: next } )
						}
					/>
					<RangeControl
						label="selected block index (not a prop)"
						min={ 0 }
						max={ 3 }
						value={ selectedIndex }
						disabled={ ! preselect }
						onChange={ ( next ) =>
							setAttributes( { selectedIndex: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockInspector</h3>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					{ preselect && <SelectBlock index={ index } /> }
					<div
						style={ {
							border: '1px dashed #949494',
							padding: '8px',
						} }
					>
						<BlockList />
					</div>
					<div
						style={ {
							border: '1px solid #ddd',
							marginTop: '8px',
							maxHeight: '320px',
							overflow: 'auto',
						} }
					>
						<BlockInspector />
					</div>
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
