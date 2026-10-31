import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	BlockSelectionClearer,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import './editor.scss';

function createSampleBlocks( count ) {
	return Array.from( { length: count }, ( _, index ) =>
		createBlock( 'core/paragraph', {
			content: 'Click me, then click the grey padding. ' + ( index + 1 ),
		} )
	);
}

function NestedEditor( { blockCount, settings, children } ) {
	const [ blocks, setBlocks ] = useState( () =>
		createSampleBlocks( blockCount )
	);
	return (
		<BlockEditorProvider
			value={ blocks }
			onInput={ setBlocks }
			onChange={ setBlocks }
			settings={ settings }
		>
			{ children }
		</BlockEditorProvider>
	);
}

// Prints the nested store's selection so clearing it is visible.
function SelectionStatus() {
	const selectedId = useSelect(
		( select ) => select( blockEditorStore ).getSelectedBlockClientId(),
		[]
	);
	return (
		<p>
			{ __( 'Selected block:', 'component-kitchen-sink' ) }{ ' ' }
			<code>{ selectedId ?? 'none' }</code>
		</p>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { blockCount, padding, className, clearBlockSelection } = attributes;
	const settings = useMemo(
		() => ( { clearBlockSelection } ),
		[ clearBlockSelection ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockSelectionClearer',
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
						label="style.padding (px, the clickable area)"
						min={ 0 }
						max={ 64 }
						value={ padding }
						onChange={ ( next ) =>
							setAttributes( { padding: next } )
						}
					/>
					<TextControl
						label="className (div prop)"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
					<ToggleControl
						label="settings.clearBlockSelection (editor setting)"
						help={ __(
							'When off the clearer ignores clicks.',
							'component-kitchen-sink'
						) }
						checked={ clearBlockSelection }
						onChange={ ( next ) =>
							setAttributes( { clearBlockSelection: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockSelectionClearer</h3>
				<NestedEditor
					key={ blockCount }
					blockCount={ blockCount }
					settings={ settings }
				>
					<SelectionStatus />
					<BlockSelectionClearer
						className={ className }
						style={ { padding, background: '#f0f0f0' } }
					>
						<BlockList />
					</BlockSelectionClearer>
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
