import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	useBlockProps,
	/* eslint-disable @wordpress/no-unsafe-wp-apis */
	__experimentalListView as ListView,
	/* eslint-enable @wordpress/no-unsafe-wp-apis */
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

/** A group with children plus siblings, so there is something to expand. */
function createSampleBlocks() {
	return [
		createBlock( 'core/heading', { level: 3, content: 'A heading' } ),
		createBlock( 'core/group', {}, [
			createBlock( 'core/paragraph', { content: 'Inside the group' } ),
			createBlock( 'core/paragraph', { content: 'Also inside' } ),
		] ),
		createBlock( 'core/paragraph', { content: 'A paragraph' } ),
	];
}

function NestedEditor( { children } ) {
	const [ blocks, setBlocks ] = useState( createSampleBlocks );
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
	const {
		showBlockMovers,
		isExpanded,
		showAppender,
		showContentPopover,
		description,
	} = attributes;

	// Props shared with the ListView in the canvas.
	const listViewProps = {
		showBlockMovers,
		isExpanded,
		showAppender,
		showContentPopover,
		description: description || undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'ListView', 'component-kitchen-sink' ) }>
					<ToggleControl
						label="showBlockMovers"
						checked={ showBlockMovers }
						onChange={ ( next ) =>
							setAttributes( { showBlockMovers: next } )
						}
					/>
					<ToggleControl
						label="isExpanded"
						checked={ isExpanded }
						onChange={ ( next ) =>
							setAttributes( { isExpanded: next } )
						}
					/>
					<ToggleControl
						label="showAppender"
						checked={ showAppender }
						onChange={ ( next ) =>
							setAttributes( { showAppender: next } )
						}
					/>
					<ToggleControl
						label="showContentPopover"
						checked={ showContentPopover }
						onChange={ ( next ) =>
							setAttributes( { showContentPopover: next } )
						}
					/>
					<TextControl
						label="description"
						value={ description }
						onChange={ ( next ) =>
							setAttributes( { description: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ListView</h3>
				<NestedEditor>
					<div
						style={ {
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: '8px',
						} }
					>
						{ /* Remount when isExpanded changes: it is only the initial state. */ }
						<div style={ { border: '1px solid #ddd' } }>
							<ListView
								key={ String( isExpanded ) }
								{ ...listViewProps }
							/>
						</div>
						<div
							style={ {
								border: '1px dashed #949494',
								padding: '8px',
							} }
						>
							<BlockList />
						</div>
					</div>
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
