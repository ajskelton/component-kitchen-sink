import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockBindingsUtils,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { targetAttribute, source, sourceKey } = attributes;

	// Returns { updateBlockBindings, removeAllBlockBindings } for this block.
	// Both write to the block's `metadata.bindings` attribute.
	const { updateBlockBindings, removeAllBlockBindings } =
		useBlockBindingsUtils();

	const bindings = attributes.metadata?.bindings ?? null;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'useBlockBindingsUtils',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="attribute"
						help={ __(
							'The block attribute to bind.',
							'component-kitchen-sink'
						) }
						value={ targetAttribute }
						onChange={ ( next ) =>
							setAttributes( { targetAttribute: next } )
						}
					/>
					<TextControl
						label="binding.source"
						value={ source }
						onChange={ ( next ) =>
							setAttributes( { source: next } )
						}
					/>
					<TextControl
						label="binding.args.key"
						value={ sourceKey }
						onChange={ ( next ) =>
							setAttributes( { sourceKey: next } )
						}
					/>
					<div style={ { display: 'flex', gap: '8px' } }>
						<Button
							variant="primary"
							onClick={ () =>
								updateBlockBindings( {
									[ targetAttribute ]: {
										source,
										args: { key: sourceKey },
									},
								} )
							}
						>
							updateBlockBindings
						</Button>
						<Button
							variant="secondary"
							onClick={ () =>
								updateBlockBindings( {
									[ targetAttribute ]: undefined,
								} )
							}
						>
							{ __(
								'Unbind attribute',
								'component-kitchen-sink'
							) }
						</Button>
					</div>
					<div style={ { marginTop: '8px' } }>
						<Button
							variant="tertiary"
							isDestructive
							onClick={ () => removeAllBlockBindings() }
						>
							removeAllBlockBindings
						</Button>
					</div>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useBlockBindingsUtils</h3>
				<p>
					{ __(
						'metadata.bindings after using the buttons in the inspector:',
						'component-kitchen-sink'
					) }
				</p>
				<pre>
					{ JSON.stringify(
						{ 'metadata.bindings': bindings, attributes },
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
