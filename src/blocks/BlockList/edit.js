import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

const APPENDER_OPTIONS = [
	{ label: 'default (omitted)', value: 'default' },
	{ label: 'false', value: 'none' },
	{ label: 'custom function', value: 'custom' },
];

const LAYOUT_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: 'constrained', value: 'constrained' },
	{ label: 'flex', value: 'flex' },
];

const LAYOUTS = {
	default: { type: 'default' },
	constrained: { type: 'constrained', contentSize: '320px' },
	flex: { type: 'flex', flexWrap: 'wrap' },
};

function createSampleBlocks( count ) {
	return Array.from( { length: count }, ( _, index ) =>
		createBlock( 'core/paragraph', {
			content: 'Paragraph ' + ( index + 1 ),
		} )
	);
}

/**
 * A custom `renderAppender`: a plain button that inserts a paragraph into the
 * nested editor's store.
 */
function CustomAppender() {
	const { insertBlock } = useDispatch( blockEditorStore );
	return (
		<Button
			variant="secondary"
			onClick={ () =>
				insertBlock(
					createBlock( 'core/paragraph', { content: 'Added' } )
				)
			}
		>
			{ __( 'Custom appender: add paragraph', 'component-kitchen-sink' ) }
		</Button>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { blockCount, appender, layoutType, className } = attributes;

	// Everything BlockList receives, shared by the notes under the canvas.
	const listProps = {
		className,
		layout: LAYOUTS[ layoutType ],
	};
	if ( appender === 'none' ) {
		listProps.renderAppender = false;
	} else if ( appender === 'custom' ) {
		listProps.renderAppender = CustomAppender;
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockList', 'component-kitchen-sink' ) }
				>
					<RangeControl
						label="blocks in state (0 shows the empty list)"
						min={ 0 }
						max={ 4 }
						value={ blockCount }
						onChange={ ( next ) =>
							setAttributes( { blockCount: next } )
						}
					/>
					<TextControl
						label="className"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
					<SelectControl
						label="renderAppender"
						value={ appender }
						options={ APPENDER_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { appender: next } )
						}
					/>
					<SelectControl
						label="layout"
						value={ layoutType }
						options={ LAYOUT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { layoutType: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockList</h3>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<div
						style={ {
							border: '1px dashed #949494',
							padding: '8px',
						} }
					>
						<BlockList { ...listProps } />
					</div>
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
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
