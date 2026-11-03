import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	useBlockProps,
	/* eslint-disable @wordpress/no-unsafe-wp-apis */
	__unstableEditorStyles as EditorStyles,
	/* eslint-enable @wordpress/no-unsafe-wp-apis */
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	RangeControl,
	TextControl,
	TextareaControl,
	ToggleControl,
} from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

function createSampleBlocks( count ) {
	return Array.from( { length: count }, ( _, index ) =>
		createBlock( 'core/paragraph', {
			content: 'Styled by EditorStyles ' + ( index + 1 ),
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
	const { blockCount, css, scope, applyScope } = attributes;

	// EditorStyles memoises on `styles`, so keep the array stable.
	const styles = useMemo( () => [ { css } ], [ css ] );
	const editorStylesProps = {
		styles,
		scope: applyScope ? scope : undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'EditorStyles', 'component-kitchen-sink' ) }
				>
					<TextareaControl
						label="styles (css of the first style)"
						value={ css }
						rows={ 4 }
						onChange={ ( next ) => setAttributes( { css: next } ) }
					/>
					<ToggleControl
						label="scope"
						help={ __(
							'On: selectors are prefixed with the scope. Off: the rules are applied unscoped to the whole editor document.',
							'component-kitchen-sink'
						) }
						checked={ applyScope }
						onChange={ ( next ) =>
							setAttributes( { applyScope: next } )
						}
					/>
					<TextControl
						label="scope (selector)"
						value={ scope }
						disabled={ ! applyScope }
						onChange={ ( next ) =>
							setAttributes( { scope: next } )
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
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>EditorStyles</h3>
				<p>
					{ __(
						'EditorStyles renders transformed <style> elements, not visible UI. The scoped rules below only affect the paragraphs inside the dashed box, which has the class in the scope field.',
						'component-kitchen-sink'
					) }
				</p>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<EditorStyles { ...editorStylesProps } />
					<div
						className="ajs-editor-styles-scope"
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
