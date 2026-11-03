import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	SkipToSelectedBlock,
	store as blockEditorStore,
	WritingFlow,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

function createSampleBlocks( count ) {
	return Array.from( { length: count }, ( _, index ) =>
		createBlock( 'core/paragraph', {
			content: 'Paragraph ' + ( index + 1 ),
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

// Selects the first nested block without moving focus (position null).
function SelectFirstBlock() {
	const clientId = useSelect(
		( select ) => select( blockEditorStore ).getBlockOrder()[ 0 ],
		[]
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
	const { blockCount, preselect } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'SkipToSelectedBlock',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="select the first block on mount (not a prop)"
						help={ __(
							'The component renders nothing until a block is selected in the nearest block editor.',
							'component-kitchen-sink'
						) }
						checked={ preselect }
						onChange={ ( next ) =>
							setAttributes( { preselect: next } )
						}
					/>
					<RangeControl
						label="blocks in state"
						min={ 1 }
						max={ 4 }
						value={ blockCount }
						onChange={ ( next ) =>
							setAttributes( { blockCount: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>SkipToSelectedBlock</h3>
				<p>
					{ __(
						'SkipToSelectedBlock takes no props. It renders a button that focuses the selected block; it is visually hidden until it receives keyboard focus (Tab to it from the list).',
						'component-kitchen-sink'
					) }
				</p>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					{ preselect && <SelectFirstBlock /> }
					<WritingFlow>
						<BlockList />
					</WritingFlow>
					<SkipToSelectedBlock />
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
