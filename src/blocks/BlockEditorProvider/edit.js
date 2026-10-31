import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';
import './editor.scss';

/**
 * Builds the small block array the nested editor starts from.
 *
 * @param {number} count Number of blocks.
 * @param {string} text  Content of the first (heading) block.
 * @return {Array} Blocks created with createBlock.
 */
function createSampleBlocks( count, text ) {
	const blocks = [
		createBlock( 'core/heading', { level: 3, content: text } ),
	];
	for ( let index = 1; index < count; index++ ) {
		blocks.push(
			createBlock( 'core/paragraph', {
				content: 'Nested paragraph ' + index,
			} )
		);
	}
	return blocks;
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		blockCount,
		seedText,
		hasFixedToolbar,
		useSubRegistry,
		changeCount,
		inputCount,
	} = attributes;

	// `value` is controlled by this component, as the README describes.
	const [ blocks, setBlocks ] = useState( () =>
		createSampleBlocks( blockCount, seedText )
	);
	// Bumping the key rebuilds the provider (and its store) from scratch.
	const [ resetKey, setResetKey ] = useState( 0 );

	// `settings` should keep a stable identity or the store is re-initialised.
	const settings = useMemo(
		() => ( { hasFixedToolbar } ),
		[ hasFixedToolbar ]
	);

	const rebuild = ( count, text ) => {
		setBlocks( createSampleBlocks( count, text ) );
		setResetKey( ( key ) => key + 1 );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockEditorProvider',
						'component-kitchen-sink'
					) }
				>
					<RangeControl
						label="value (block count)"
						min={ 1 }
						max={ 4 }
						value={ blockCount }
						onChange={ ( next ) => {
							setAttributes( { blockCount: next } );
							rebuild( next, seedText );
						} }
					/>
					<TextControl
						label="value (first block text)"
						value={ seedText }
						onChange={ ( next ) => {
							setAttributes( { seedText: next } );
							rebuild( blockCount, next );
						} }
					/>
					<ToggleControl
						label="settings.hasFixedToolbar"
						checked={ hasFixedToolbar }
						onChange={ ( next ) =>
							setAttributes( { hasFixedToolbar: next } )
						}
					/>
					<ToggleControl
						label="useSubRegistry"
						checked={ useSubRegistry }
						onChange={ ( next ) => {
							setAttributes( { useSubRegistry: next } );
							setResetKey( ( key ) => key + 1 );
						} }
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( { changeCount: 0, inputCount: 0 } )
						}
					>
						{ __( 'Reset counters', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockEditorProvider</h3>
				<p>
					{ __(
						'The list below is a nested editor: BlockEditorProvider owns the store and BlockList renders it. Edit the text to fire onInput, then pause or blur to fire onChange.',
						'component-kitchen-sink'
					) }
				</p>
				<BlockEditorProvider
					key={ resetKey }
					value={ blocks }
					onInput={ ( next ) => {
						setBlocks( next );
						setAttributes( { inputCount: inputCount + 1 } );
					} }
					onChange={ ( next ) => {
						setBlocks( next );
						setAttributes( { changeCount: changeCount + 1 } );
					} }
					settings={ settings }
					useSubRegistry={ useSubRegistry }
				>
					<div
						style={ {
							border: '1px dashed #949494',
							padding: '8px',
						} }
					>
						<BlockList />
					</div>
				</BlockEditorProvider>
				<p>
					{ 'blocks.length: ' + blocks.length + ' | onInput: ' }
					{ inputCount + ' | onChange: ' + changeCount }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
