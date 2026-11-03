import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	BlockPopover,
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
import { useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

function createSampleBlocks( count ) {
	return Array.from( { length: count }, ( _, index ) =>
		createBlock( 'core/paragraph', {
			content: 'Block ' + ( index + 1 ) + ' (the popover anchors here)',
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

// Anchors a BlockPopover to blocks of the nested store, looked up by index.
function PopoverForBlocks( { index, bottomIndex, shift, label } ) {
	const [ clientId, bottomClientId ] = useSelect(
		( select ) => {
			const order = select( blockEditorStore ).getBlockOrder();
			return [ order[ index ], order[ bottomIndex ] ];
		},
		[ index, bottomIndex ]
	);
	if ( ! clientId ) {
		return null;
	}
	return (
		<BlockPopover
			clientId={ clientId }
			bottomClientId={ bottomClientId }
			shift={ shift }
		>
			<div
				style={ {
					background: '#1e1e1e',
					color: '#fff',
					padding: '4px 8px',
					borderRadius: '2px',
				} }
			>
				{ label }
			</div>
		</BlockPopover>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { blockCount, index, spanToIndex, shift, label, showPopover } =
		attributes;
	const topIndex = Math.min( index, blockCount - 1 );
	// With the toggle off no bottomClientId is passed at all.
	const bottomIndex =
		spanToIndex > 0 ? Math.min( spanToIndex, blockCount - 1 ) : topIndex;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockPopover', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="render the popover"
						checked={ showPopover }
						onChange={ ( next ) =>
							setAttributes( { showPopover: next } )
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
					<RangeControl
						label="clientId (block index)"
						min={ 0 }
						max={ 3 }
						value={ index }
						onChange={ ( next ) =>
							setAttributes( { index: next } )
						}
					/>
					<RangeControl
						label="bottomClientId (block index, 0 = unset)"
						min={ 0 }
						max={ 3 }
						value={ spanToIndex }
						onChange={ ( next ) =>
							setAttributes( { spanToIndex: next } )
						}
					/>
					<ToggleControl
						label="shift"
						checked={ shift }
						onChange={ ( next ) =>
							setAttributes( { shift: next } )
						}
					/>
					<TextControl
						label="children (popover text)"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockPopover</h3>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					{ showPopover && (
						<PopoverForBlocks
							index={ topIndex }
							bottomIndex={ bottomIndex }
							shift={ shift }
							label={ label }
						/>
					) }
					<div
						style={ {
							border: '1px dashed #949494',
							padding: '8px',
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
