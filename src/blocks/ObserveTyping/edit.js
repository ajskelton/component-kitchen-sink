import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	ObserveTyping,
	WritingFlow,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

function createSampleBlocks( count ) {
	return Array.from( { length: count }, ( _, index ) =>
		createBlock( 'core/paragraph', {
			content: 'Type here and watch isTyping ' + ( index + 1 ),
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

// Live view of the typing flag ObserveTyping maintains.
function TypingStatus() {
	const isTyping = useSelect(
		( select ) => select( blockEditorStore ).isTyping(),
		[]
	);
	return (
		<p>
			{ __( 'isTyping:', 'component-kitchen-sink' ) }{ ' ' }
			<strong>{ String( isTyping ) }</strong>
		</p>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { blockCount, observe } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ObserveTyping', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="wrap the list in ObserveTyping"
						help={ __(
							'Off renders the same list without it, so isTyping never turns on.',
							'component-kitchen-sink'
						) }
						checked={ observe }
						onChange={ ( next ) =>
							setAttributes( { observe: next } )
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
				<h3>ObserveTyping</h3>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<TypingStatus />
					{ observe ? (
						<ObserveTyping>
							<WritingFlow>
								<BlockList />
							</WritingFlow>
						</ObserveTyping>
					) : (
						<WritingFlow>
							<BlockList />
						</WritingFlow>
					) }
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
