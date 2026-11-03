import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	Typewriter,
	WritingFlow,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

function createSampleBlocks( count ) {
	return Array.from( { length: count }, ( _, index ) =>
		createBlock( 'core/paragraph', {
			content: 'Line ' + ( index + 1 ) + ': press Enter and keep typing.',
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

export default function Edit( { attributes, setAttributes } ) {
	const { blockCount, maxHeight, enabled } = attributes;

	const list = (
		<WritingFlow>
			<BlockList />
		</WritingFlow>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Typewriter', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="wrap the list in Typewriter"
						checked={ enabled }
						onChange={ ( next ) =>
							setAttributes( { enabled: next } )
						}
					/>
					<RangeControl
						label="blocks in state"
						min={ 3 }
						max={ 12 }
						value={ blockCount }
						onChange={ ( next ) =>
							setAttributes( { blockCount: next } )
						}
					/>
					<RangeControl
						label="scroll container height (px, not a prop)"
						min={ 80 }
						max={ 400 }
						value={ maxHeight }
						onChange={ ( next ) =>
							setAttributes( { maxHeight: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Typewriter</h3>
				<p>
					{ __(
						'Typewriter keeps the caret at the same height while you type and press Enter in a scrolling container.',
						'component-kitchen-sink'
					) }
				</p>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<div
						style={ {
							maxHeight,
							overflow: 'auto',
							border: '1px dashed #949494',
							padding: '8px',
						} }
					>
						{ enabled ? <Typewriter>{ list }</Typewriter> : list }
					</div>
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
