import { __ } from '@wordpress/i18n';
import {
	BlockBreadcrumb,
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

const TARGET_OPTIONS = [
	{ label: 'paragraph inside the group', value: 'inner' },
	{ label: 'the group', value: 'group' },
	{ label: 'top-level paragraph', value: 'top' },
	{ label: 'nothing selected', value: 'none' },
];

/** A group with a paragraph inside, then a top-level paragraph. */
function createSampleBlocks() {
	return [
		createBlock( 'core/group', {}, [
			createBlock( 'core/paragraph', { content: 'Inside the group' } ),
		] ),
		createBlock( 'core/paragraph', { content: 'Top-level paragraph' } ),
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

/**
 * Selects one of the sample blocks in the nested store. `null` as the initial
 * position avoids stealing focus.
 *
 * @param {Object} props        Props.
 * @param {string} props.target One of inner, group, top or none.
 */
function SelectTarget( { target } ) {
	const clientId = useSelect(
		( select ) => {
			const blocks = select( blockEditorStore ).getBlocks();
			if ( target === 'inner' ) {
				return blocks[ 0 ]?.innerBlocks[ 0 ]?.clientId;
			}
			if ( target === 'group' ) {
				return blocks[ 0 ]?.clientId;
			}
			return target === 'top' ? blocks[ 1 ]?.clientId : undefined;
		},
		[ target ]
	);
	const { selectBlock, clearSelectedBlock } = useDispatch( blockEditorStore );
	useEffect( () => {
		if ( clientId ) {
			selectBlock( clientId, null );
		} else {
			clearSelectedBlock();
		}
	}, [ clientId, selectBlock, clearSelectedBlock ] );
	return null;
}

export default function Edit( { attributes, setAttributes } ) {
	const { rootLabelText, className, target } = attributes;

	// Props shared with the BlockBreadcrumb in the canvas.
	const breadcrumbProps = {
		rootLabelText,
		className: className || undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockBreadcrumb', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="rootLabelText"
						help={ __(
							'Empty falls back to "Document".',
							'component-kitchen-sink'
						) }
						value={ rootLabelText }
						onChange={ ( next ) =>
							setAttributes( { rootLabelText: next } )
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
						label="selected block (not a prop)"
						value={ target }
						options={ TARGET_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { target: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockBreadcrumb</h3>
				<NestedEditor>
					<SelectTarget target={ target } />
					<BlockBreadcrumb { ...breadcrumbProps } />
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
