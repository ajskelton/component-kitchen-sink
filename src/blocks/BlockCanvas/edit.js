import { __ } from '@wordpress/i18n';
import {
	BlockCanvas,
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

function createSampleBlocks( count ) {
	const blocks = [
		createBlock( 'core/heading', { level: 3, content: 'Canvas' } ),
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
	const { blockCount, height, applyStyles, paragraphColor } = attributes;

	// `styles` is injected into the canvas iframe; keep its identity stable.
	const styles = useMemo(
		() =>
			applyStyles
				? [ { css: 'p { color: ' + paragraphColor + '; }' } ]
				: undefined,
		[ applyStyles, paragraphColor ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockCanvas', 'component-kitchen-sink' ) }
				>
					<RangeControl
						label="blocks in state"
						min={ 1 }
						max={ 5 }
						value={ blockCount }
						onChange={ ( next ) =>
							setAttributes( { blockCount: next } )
						}
					/>
					<TextControl
						label="height"
						help={ __(
							'Any CSS length, defaults to 300px.',
							'component-kitchen-sink'
						) }
						value={ height }
						onChange={ ( next ) =>
							setAttributes( { height: next } )
						}
					/>
					<ToggleControl
						label="styles"
						help={ __(
							'Injects a paragraph colour rule into the canvas iframe.',
							'component-kitchen-sink'
						) }
						checked={ applyStyles }
						onChange={ ( next ) =>
							setAttributes( { applyStyles: next } )
						}
					/>
					<TextControl
						label="styles (paragraph colour)"
						type="color"
						value={ paragraphColor }
						disabled={ ! applyStyles }
						onChange={ ( next ) =>
							setAttributes( { paragraphColor: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockCanvas</h3>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<BlockCanvas height={ height } styles={ styles }>
						<BlockList />
					</BlockCanvas>
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
