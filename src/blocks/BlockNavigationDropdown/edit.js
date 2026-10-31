import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	BlockNavigationDropdown,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

// Paragraphs plus a group with a child, so the list view has depth.
function createSampleBlocks( count ) {
	if ( count === 0 ) {
		return [];
	}
	const blocks = [
		createBlock( 'core/group', {}, [
			createBlock( 'core/paragraph', { content: 'Inside the group' } ),
		] ),
	];
	for ( let index = 1; index < count; index++ ) {
		blocks.push(
			createBlock( 'core/paragraph', { content: 'Paragraph ' + index } )
		);
	}
	return blocks;
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
	const { blockCount, isDisabled } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockNavigationDropdown',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="isDisabled"
						checked={ isDisabled }
						onChange={ ( next ) =>
							setAttributes( { isDisabled: next } )
						}
					/>
					<RangeControl
						label="blocks in state (0 also disables the toggle)"
						min={ 0 }
						max={ 4 }
						value={ blockCount }
						onChange={ ( next ) =>
							setAttributes( { blockCount: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockNavigationDropdown</h3>
				<p>
					{ __(
						'Deprecated since WordPress 6.1; it logs a deprecation warning in the console. The button opens a List view popover for the nested editor.',
						'component-kitchen-sink'
					) }
				</p>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<BlockNavigationDropdown isDisabled={ isDisabled } />
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
