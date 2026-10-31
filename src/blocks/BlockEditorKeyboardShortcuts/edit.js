import { __ } from '@wordpress/i18n';
import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	BlockList,
	BlockTools,
	InspectorControls,
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
			content: 'Select me and try the shortcuts ' + ( index + 1 ),
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

// Reads live state so the effect of the shortcuts is visible.
function Status() {
	const { count, duplicate } = useSelect(
		( select ) => ( {
			count: select( blockEditorStore ).getBlockCount(),
			duplicate: select(
				'core/keyboard-shortcuts'
			).getShortcutRepresentation( 'core/block-editor/duplicate' ),
		} ),
		[]
	);
	return (
		<p>
			{ __( 'Blocks in the nested editor:', 'component-kitchen-sink' ) }{ ' ' }
			{ count }. { __( 'Duplicate shortcut:', 'component-kitchen-sink' ) }{ ' ' }
			<code>{ duplicate ?? 'not registered' }</code>
		</p>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { blockCount, register } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockEditorKeyboardShortcuts',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="render BlockEditorKeyboardShortcuts.Register"
						help={ __(
							'The editor already registers these shortcuts; rendering Register again is harmless.',
							'component-kitchen-sink'
						) }
						checked={ register }
						onChange={ ( next ) =>
							setAttributes( { register: next } )
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
				<h3>BlockEditorKeyboardShortcuts</h3>
				<p>
					{ __(
						'The component itself renders nothing (it returns null); .Register only registers the shortcut definitions. The nested editor below shows them in use: select a block and press Shift + Cmd/Ctrl + D to duplicate it.',
						'component-kitchen-sink'
					) }
				</p>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<BlockEditorKeyboardShortcuts />
					{ register && <BlockEditorKeyboardShortcuts.Register /> }
					<Status />
					<BlockTools>
						<WritingFlow>
							<BlockList />
						</WritingFlow>
					</BlockTools>
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
