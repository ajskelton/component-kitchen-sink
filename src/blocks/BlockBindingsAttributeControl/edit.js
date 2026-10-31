import { __ } from '@wordpress/i18n';
import {
	BlockBindingsAttributeControl,
	InspectorControls,
	useBlockBindingsUtils,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalToolsPanel as ToolsPanel,
	Button,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import metadata from './block.json';
import './editor.scss';

const ATTRIBUTE_OPTIONS = [
	{ label: 'text', value: 'text' },
	{ label: 'href', value: 'href' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { attribute, text, href } = attributes;
	const { removeAllBlockBindings } = useBlockBindingsUtils();

	// The control reads the binding from the block's `metadata.bindings`.
	const binding = attributes.metadata?.bindings?.[ attribute ];

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockBindingsAttributeControl',
						'component-kitchen-sink'
					) }
				>
					{ /* The control renders a ToolsPanelItem, so it needs a ToolsPanel. */ }
					<ToolsPanel
						label={ __( 'Attributes', 'component-kitchen-sink' ) }
						resetAll={ () => removeAllBlockBindings() }
					>
						<BlockBindingsAttributeControl
							attribute={ attribute }
							binding={ binding }
							blockName={ metadata.name }
						/>
					</ToolsPanel>
					<SelectControl
						label="attribute"
						value={ attribute }
						options={ ATTRIBUTE_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { attribute: next } )
						}
					/>
					<TextControl
						label="text (attribute)"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<TextControl
						label="href (attribute)"
						value={ href }
						onChange={ ( next ) => setAttributes( { href: next } ) }
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => removeAllBlockBindings() }
					>
						{ __(
							'Remove all bindings',
							'component-kitchen-sink'
						) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockBindingsAttributeControl</h3>
				<p>
					{ __( 'text:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ text }</code>
					{ ' · ' }
					{ __( 'href:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ href }</code>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
