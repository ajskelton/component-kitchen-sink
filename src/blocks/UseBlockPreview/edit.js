import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalUseBlockPreview as useBlockPreview,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { createBlock } from '@wordpress/blocks';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import './editor.scss';

const PRESET_OPTIONS = [
	'paragraph',
	'heading-paragraph',
	'buttons',
	'quote',
].map( ( value ) => ( { label: value, value } ) );

const LAYOUTS = {
	default: undefined,
	flex: { type: 'flex', orientation: 'horizontal' },
	constrained: { type: 'constrained', contentSize: '320px' },
};

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
					content: 'A single paragraph from useBlockPreview.',
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
					content: 'Preview paragraph rendered in place.',
				} ),
			];
	}
}

export default function Edit( { attributes, setAttributes } ) {
	const { preset, layout, className } = attributes;

	const blocks = useMemo( () => createBlocks( preset ), [ preset ] );

	// The hook returns props (ref, className, children) for any element, which
	// becomes a live, non-interactive preview of the blocks. Unlike
	// BlockPreview it renders in place, not in an iframe.
	const previewProps = useBlockPreview( {
		blocks,
		props: { className: className || undefined },
		layout: LAYOUTS[ layout ],
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'useBlockPreview', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="blocks (preset)"
						value={ preset }
						options={ PRESET_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { preset: next } )
						}
					/>
					<SelectControl
						label="layout"
						value={ layout }
						options={ Object.keys( LAYOUTS ).map( ( value ) => ( {
							label: value,
							value,
						} ) ) }
						onChange={ ( next ) =>
							setAttributes( { layout: next } )
						}
					/>
					<TextControl
						label="props.className"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useBlockPreview</h3>
				<div { ...previewProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
