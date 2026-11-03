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
	TextControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import metadata from './block.json';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { label } = attributes;
	const { removeAllBlockBindings } = useBlockBindingsUtils();

	const binding = attributes.metadata?.bindings?.label;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockBindingsSourceFieldsList',
						'component-kitchen-sink'
					) }
				>
					{ /*
					 * BlockBindingsSourceFieldsList renders Menu submenus from
					 * @wordpress/ui, so it only works inside the Menu.Root that
					 * BlockBindingsAttributeControl provides. Open the menu on
					 * the "label" row below to see the list of sources.
					 */ }
					<ToolsPanel
						label={ __( 'Attributes', 'component-kitchen-sink' ) }
						resetAll={ () => removeAllBlockBindings() }
					>
						<BlockBindingsAttributeControl
							attribute="label"
							binding={ binding }
							blockName={ metadata.name }
						/>
					</ToolsPanel>
					<TextControl
						label="label (attribute)"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
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
				<h3>BlockBindingsSourceFieldsList</h3>
				<p>
					{ __(
						'The source fields list is not rendered here. It only works inside the menu of a bound attribute control, so open the "label" row in the inspector: each registered source with a compatible field becomes a submenu rendered by BlockBindingsSourceFieldsList.',
						'component-kitchen-sink'
					) }
				</p>
				<p>
					{ __( 'label:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ label }</code>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
