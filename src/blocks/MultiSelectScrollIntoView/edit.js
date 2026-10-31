import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	MultiSelectScrollIntoView,
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
			content: 'Shift + arrow to multi-select ' + ( index + 1 ),
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
	const { blockCount, mounted } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'MultiSelectScrollIntoView',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="mount MultiSelectScrollIntoView"
						checked={ mounted }
						onChange={ ( next ) =>
							setAttributes( { mounted: next } )
						}
					/>
					<RangeControl
						label="blocks in state"
						min={ 2 }
						max={ 5 }
						value={ blockCount }
						onChange={ ( next ) =>
							setAttributes( { blockCount: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>MultiSelectScrollIntoView</h3>
				<p>
					{ __(
						'Smoke test only. This component is deprecated since WordPress 5.8: it renders nothing, does nothing (scrolling is built in) and logs a console deprecation warning when mounted.',
						'component-kitchen-sink'
					) }
				</p>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					{ mounted && <MultiSelectScrollIntoView /> }
					<WritingFlow>
						<BlockList />
					</WritingFlow>
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
