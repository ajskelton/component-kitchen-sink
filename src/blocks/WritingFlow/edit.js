import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	WritingFlow,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

function createSampleBlocks( count ) {
	return Array.from( { length: count }, ( _, index ) =>
		createBlock( 'core/paragraph', {
			content:
				'Paragraph ' +
				( index + 1 ) +
				': arrow keys cross block borders.',
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
	const { blockCount, ariaLabel, className } = attributes;

	// WritingFlow spreads its props on a div.
	const flowProps = {
		'aria-label': ariaLabel || undefined,
		className,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'WritingFlow', 'component-kitchen-sink' ) }
				>
					<RangeControl
						label="blocks in state"
						min={ 2 }
						max={ 5 }
						value={ blockCount }
						onChange={ ( next ) =>
							setAttributes( { blockCount: next } )
						}
					/>
					<TextControl
						label="aria-label (div prop)"
						value={ ariaLabel }
						onChange={ ( next ) =>
							setAttributes( { ariaLabel: next } )
						}
					/>
					<TextControl
						label="className (div prop)"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>WritingFlow</h3>
				<p>
					{ __(
						'Click into a paragraph and use the arrow keys, Tab, Shift + click or Shift + arrow to move and select across blocks.',
						'component-kitchen-sink'
					) }
				</p>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<WritingFlow { ...flowProps }>
						<BlockList />
					</WritingFlow>
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
