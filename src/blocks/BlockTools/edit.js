import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	BlockTools,
	InspectorControls,
	WritingFlow,
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

function createSampleBlocks( count ) {
	return Array.from( { length: count }, ( _, index ) =>
		createBlock( 'core/paragraph', {
			content: 'Click me to show the block tools ' + ( index + 1 ),
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

export default function Edit( { attributes, setAttributes } ) {
	const { blockCount, hasFixedToolbar, className } = attributes;
	const settings = useMemo(
		() => ( { hasFixedToolbar } ),
		[ hasFixedToolbar ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockTools', 'component-kitchen-sink' ) }
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
						label="settings.hasFixedToolbar (editor setting)"
						help={ __(
							'BlockTools reads this setting to decide between the floating and the fixed toolbar.',
							'component-kitchen-sink'
						) }
						checked={ hasFixedToolbar }
						onChange={ ( next ) =>
							setAttributes( { hasFixedToolbar: next } )
						}
					/>
					<TextControl
						label="className (passed through to the wrapper)"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockTools</h3>
				<NestedEditor
					key={ blockCount }
					blockCount={ blockCount }
					settings={ settings }
				>
					<BlockTools className={ className }>
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
