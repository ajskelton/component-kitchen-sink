import { __ } from '@wordpress/i18n';
import {
	BlockContextProvider,
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';
import { CONTEXT_NUMBER_KEY, CONTEXT_TEXT_KEY, PROBE_NAME } from './probe';
import './editor.scss';

const EDITOR_SETTINGS = {};

function NestedEditor( { blockCount, children } ) {
	const [ blocks, setBlocks ] = useState( () =>
		Array.from( { length: blockCount }, () => createBlock( PROBE_NAME ) )
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
	const { blockCount, contextText, contextNumber } = attributes;

	// `value` is merged into the block context; keep its identity stable.
	const contextValue = useMemo(
		() => ( {
			[ CONTEXT_TEXT_KEY ]: contextText,
			[ CONTEXT_NUMBER_KEY ]: contextNumber,
		} ),
		[ contextText, contextNumber ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockContextProvider',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label={ 'value[ "' + CONTEXT_TEXT_KEY + '" ]' }
						value={ contextText }
						onChange={ ( next ) =>
							setAttributes( { contextText: next } )
						}
					/>
					<RangeControl
						label={ 'value[ "' + CONTEXT_NUMBER_KEY + '" ]' }
						min={ 0 }
						max={ 100 }
						value={ contextNumber }
						onChange={ ( next ) =>
							setAttributes( { contextNumber: next } )
						}
					/>
					<RangeControl
						label="blocks in state (consumers)"
						min={ 1 }
						max={ 3 }
						value={ blockCount }
						onChange={ ( next ) =>
							setAttributes( { blockCount: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockContextProvider</h3>
				<p>
					{ __(
						'The boxes below are a client-only "Context probe" block. It declares usesContext for the two keys and prints what it receives from the provider.',
						'component-kitchen-sink'
					) }
				</p>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<BlockContextProvider value={ contextValue }>
						<BlockList />
					</BlockContextProvider>
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
