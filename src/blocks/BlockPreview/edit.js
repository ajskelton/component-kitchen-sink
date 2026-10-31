import { __ } from '@wordpress/i18n';
import {
	BlockPreview,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import './editor.scss';

const PRESET_OPTIONS = [
	'paragraph',
	'heading-paragraph',
	'buttons',
	'quote',
].map( ( value ) => ( { label: value, value } ) );

/**
 * Creates a small array of blocks for the chosen preset.
 *
 * @param {string} preset One of the PRESET_OPTIONS values.
 * @return {Object[]} Blocks created with createBlock.
 */
function createBlocks( preset ) {
	switch ( preset ) {
		case 'paragraph':
			return [
				createBlock( 'core/paragraph', {
					content: 'A single paragraph, previewed.',
				} ),
			];
		case 'buttons':
			return [
				createBlock( 'core/buttons', {}, [
					createBlock( 'core/button', { text: 'First' } ),
					createBlock( 'core/button', { text: 'Second' } ),
				] ),
			];
		case 'quote':
			return [
				createBlock( 'core/quote', { citation: 'Someone' }, [
					createBlock( 'core/paragraph', {
						content: 'A quote with an inner paragraph.',
					} ),
				] ),
			];
		default:
			return [
				createBlock( 'core/heading', {
					level: 3,
					content: 'Preview heading',
				} ),
				createBlock( 'core/paragraph', {
					content: 'Preview paragraph rendered inside an iframe.',
				} ),
			];
	}
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		preset,
		viewportWidth,
		minHeight,
		withAdditionalStyles,
		paddingPx,
	} = attributes;

	const blocks = useMemo( () => createBlocks( preset ), [ preset ] );

	// Every prop exercised by this block.
	const blockPreviewProps = {
		blocks,
		viewportWidth,
		minHeight: minHeight > 0 ? minHeight : undefined,
		additionalStyles: withAdditionalStyles
			? [
					{
						css: `body { padding: ${ paddingPx }px; background: #f0f0f1; }`,
					},
				]
			: undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockPreview', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="blocks (preset)"
						value={ preset }
						options={ PRESET_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { preset: next } )
						}
					/>
					<RangeControl
						label="viewportWidth"
						help={ __(
							'0 matches the container width.',
							'component-kitchen-sink'
						) }
						value={ viewportWidth }
						min={ 0 }
						max={ 1600 }
						step={ 50 }
						onChange={ ( next ) =>
							setAttributes( { viewportWidth: next ?? 0 } )
						}
					/>
					<TextControl
						type="number"
						label="minHeight"
						value={ minHeight }
						min={ 0 }
						onChange={ ( next ) =>
							setAttributes( { minHeight: Number( next ) || 0 } )
						}
					/>
					<ToggleControl
						label="additionalStyles"
						checked={ withAdditionalStyles }
						onChange={ ( next ) =>
							setAttributes( { withAdditionalStyles: next } )
						}
					/>
					<RangeControl
						label="additionalStyles (body padding)"
						value={ paddingPx }
						min={ 0 }
						max={ 64 }
						disabled={ ! withAdditionalStyles }
						onChange={ ( next ) =>
							setAttributes( { paddingPx: next ?? 0 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockPreview</h3>
				<BlockPreview { ...blockPreviewProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
