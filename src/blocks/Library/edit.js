import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	BlockEditorProvider,
	InspectorControls,
	__experimentalLibrary as Library,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import './editor.scss';

const TAB_OPTIONS = [ 'blocks', 'patterns', 'media' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		initialTab,
		filterValue,
		showInserterHelpPanel,
		showMostUsedBlocks,
		isAppender,
		shouldFocusBlock,
		selections,
	} = attributes;

	// Library inserts into a block editor store, so it is rendered inside a
	// nested editor that holds a tiny block list.
	const [ blocks, setBlocks ] = useState( () => [
		createBlock( 'core/paragraph', {
			content: 'Nested editor: insert a block from the Library below.',
		} ),
	] );
	const settings = useSelect(
		( select ) => select( blockEditorStore ).getSettings(),
		[]
	);

	// Every prop exercised by this block.
	const libraryProps = {
		__experimentalInitialTab: initialTab,
		__experimentalFilterValue: filterValue || undefined,
		showInserterHelpPanel,
		showMostUsedBlocks,
		isAppender,
		shouldFocusBlock,
		onSelect: () => setAttributes( { selections: selections + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Library', 'component-kitchen-sink' ) }>
					<SelectControl
						label="__experimentalInitialTab"
						value={ initialTab }
						options={ TAB_OPTIONS }
						help={ __(
							'Read when the Library mounts: the block remounts it when this changes.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { initialTab: next } )
						}
					/>
					<TextControl
						label="__experimentalFilterValue"
						value={ filterValue }
						onChange={ ( next ) =>
							setAttributes( { filterValue: next } )
						}
					/>
					<ToggleControl
						label="showInserterHelpPanel"
						checked={ showInserterHelpPanel }
						onChange={ ( next ) =>
							setAttributes( { showInserterHelpPanel: next } )
						}
					/>
					<ToggleControl
						label="showMostUsedBlocks"
						checked={ showMostUsedBlocks }
						onChange={ ( next ) =>
							setAttributes( { showMostUsedBlocks: next } )
						}
					/>
					<ToggleControl
						label="isAppender"
						checked={ isAppender }
						onChange={ ( next ) =>
							setAttributes( { isAppender: next } )
						}
					/>
					<ToggleControl
						label="shouldFocusBlock"
						checked={ shouldFocusBlock }
						onChange={ ( next ) =>
							setAttributes( { shouldFocusBlock: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { selections: 0 } ) }
					>
						{ __(
							'Reset onSelect count',
							'component-kitchen-sink'
						) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Library</h3>
				<p>{ `Nested editor blocks: ${ blocks.length }` }</p>
				<BlockEditorProvider
					value={ blocks }
					onInput={ setBlocks }
					onChange={ setBlocks }
					settings={ settings }
				>
					<div className="ajs-library-frame">
						<Library
							key={ `${ initialTab }-${ isAppender }` }
							{ ...libraryProps }
						/>
					</div>
				</BlockEditorProvider>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
