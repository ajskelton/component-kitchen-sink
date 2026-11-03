import { __ } from '@wordpress/i18n';
import {
	BlockEditorProvider,
	BlockList,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
	/* eslint-disable @wordpress/no-unsafe-wp-apis */
	__unstableIframe as Iframe,
	/* eslint-enable @wordpress/no-unsafe-wp-apis */
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import './editor.scss';

function createSampleBlocks( count ) {
	const blocks = [
		createBlock( 'core/heading', {
			level: 3,
			content: 'Inside an iframe',
		} ),
	];
	for ( let index = 1; index < count; index++ ) {
		blocks.push(
			createBlock( 'core/paragraph', {
				content: 'Paragraph ' + index + ' rendered by BlockList.',
			} )
		);
	}
	return blocks;
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
	const { blockCount, height, scale, frameSize, readonly, title } =
		attributes;

	// Hand the iframe the real editor's resolved assets so it gets the theme
	// and block styles; with empty settings it would be unstyled.
	const resolvedAssets = useSelect(
		( select ) =>
			select( blockEditorStore ).getSettings().__unstableResolvedAssets,
		[]
	);
	const settings = useMemo(
		() => ( { __unstableResolvedAssets: resolvedAssets } ),
		[ resolvedAssets ]
	);

	// Everything passed to Iframe; other props land on the iframe element.
	const iframeProps = {
		scale,
		frameSize,
		readonly,
		title,
		style: { width: '100%', height, border: '1px solid #949494' },
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Iframe', 'component-kitchen-sink' ) }>
					<RangeControl
						label="scale"
						min={ 0.25 }
						max={ 1 }
						step={ 0.05 }
						value={ scale }
						onChange={ ( next ) =>
							setAttributes( { scale: next } )
						}
					/>
					<RangeControl
						label="frameSize (px)"
						min={ 0 }
						max={ 60 }
						value={ frameSize }
						onChange={ ( next ) =>
							setAttributes( { frameSize: next } )
						}
					/>
					<ToggleControl
						label="readonly"
						checked={ readonly }
						onChange={ ( next ) =>
							setAttributes( { readonly: next } )
						}
					/>
					<TextControl
						label="title (iframe element prop)"
						value={ title }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
						}
					/>
					<TextControl
						label="style.height (iframe element prop)"
						value={ height }
						onChange={ ( next ) =>
							setAttributes( { height: next } )
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
				<h3>Iframe</h3>
				<NestedEditor
					key={ blockCount }
					blockCount={ blockCount }
					settings={ settings }
				>
					<Iframe { ...iframeProps }>
						<BlockList />
					</Iframe>
				</NestedEditor>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
