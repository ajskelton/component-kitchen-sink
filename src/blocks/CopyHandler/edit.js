import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	CopyHandler,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	PanelBody,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

function createSampleBlocks( count ) {
	return Array.from( { length: count }, ( _, index ) =>
		createBlock( 'core/paragraph', {
			content:
				'Select the block (click its edge) and copy ' + ( index + 1 ),
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
	const { blockCount, className, copyEvents } = attributes;

	// CopyHandler spreads its props on a div, so DOM props work.
	const handlerProps = {
		className,
		onCopy: () => setAttributes( { copyEvents: copyEvents + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'CopyHandler', 'component-kitchen-sink' ) }
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
					<TextControl
						label="className (div prop)"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { copyEvents: 0 } ) }
					>
						{ __( 'Reset copy events', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>CopyHandler</h3>
				<p>
					{ __(
						'Deprecated since WordPress 6.4 (logs a console warning). Select a nested block and press Cmd/Ctrl + C, X or V.',
						'component-kitchen-sink'
					) }
				</p>
				<NestedEditor key={ blockCount } blockCount={ blockCount }>
					<CopyHandler { ...handlerProps }>
						<BlockList />
					</CopyHandler>
				</NestedEditor>
				<p>
					{ __( 'Copy events seen:', 'component-kitchen-sink' ) }{ ' ' }
					{ copyEvents }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
