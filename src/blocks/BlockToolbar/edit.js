import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	BlockToolbar,
	InspectorControls,
	NavigableToolbar,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

const VARIANT_OPTIONS = [
	{ label: 'unstyled (default)', value: 'unstyled' },
	{ label: 'toolbar', value: 'toolbar' },
];

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

/**
 * Selects the block at `index` in the nested store. `null` as the initial
 * position avoids moving focus out of the inspector.
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
	const { blockCount, hideDragHandle, variant } = attributes;

	// Props shared with the (only) BlockToolbar instance.
	const toolbarProps = { hideDragHandle, variant };

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockToolbar', 'component-kitchen-sink' ) }
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
						label="hideDragHandle"
						checked={ hideDragHandle }
						onChange={ ( next ) =>
							setAttributes( { hideDragHandle: next } )
						}
					/>
					<SelectControl
						label="variant"
						value={ variant }
						options={ VARIANT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { variant: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockToolbar</h3>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<SelectBlock index={ 0 } />
					<NavigableToolbar
						aria-label={ __(
							'Nested block toolbar',
							'component-kitchen-sink'
						) }
					>
						<BlockToolbar { ...toolbarProps } />
					</NavigableToolbar>
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
