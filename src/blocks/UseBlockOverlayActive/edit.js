import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	store as blockEditorStore,
	__experimentalUseBlockOverlayActive as useBlockOverlayActive,
	useBlockEditContext,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import './editor.scss';

const TARGET_OPTIONS = [
	{ label: 'self (this block)', value: 'self' },
	{ label: 'parent (root block)', value: 'parent' },
	{ label: 'firstBlock (first top-level block)', value: 'firstBlock' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { target } = attributes;
	const { clientId } = useBlockEditContext();

	const { parentClientId, firstClientId } = useSelect(
		( select ) => {
			const { getBlockRootClientId, getBlockOrder } =
				select( blockEditorStore );
			return {
				parentClientId: getBlockRootClientId( clientId ) ?? '',
				firstClientId: getBlockOrder()[ 0 ] ?? '',
			};
		},
		[ clientId ]
	);

	// Whether the block overlay (the click-catching layer shown over locked
	// blocks, in navigation mode and in zoom-out mode) is active.
	const selfActive = useBlockOverlayActive( clientId );
	const parentActive = useBlockOverlayActive( parentClientId );
	const firstActive = useBlockOverlayActive( firstClientId );

	const results = {
		self: selfActive,
		parent: parentActive,
		firstBlock: firstActive,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__experimentalUseBlockOverlayActive',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="clientId (highlighted result)"
						value={ target }
						options={ TARGET_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { target: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useBlockOverlayActive</h3>
				<p>
					{ __(
						'The overlay is only active in special situations: a locked block, zoom-out mode, or (for blocks with controlled children) when unselected. Switch the editor to Zoom Out and watch the values change.',
						'component-kitchen-sink'
					) }
				</p>
				<p>
					<strong>{ target }:</strong>{ ' ' }
					<code>{ String( results[ target ] ) }</code>
				</p>
				<pre>
					{ JSON.stringify(
						{
							clientIds: {
								self: clientId,
								parent: parentClientId || null,
								firstBlock: firstClientId || null,
							},
							results,
						},
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
