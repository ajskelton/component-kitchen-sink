import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalUseSlot as useSlot,
	Fill,
	PanelBody,
	Slot,
	SlotFillProvider,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

/**
 * Calls useSlot. It must live below the SlotFillProvider because the hook
 * reads the registry from context. `ref` is only defined for a Slot that
 * bubbles virtually (a portal slot).
 *
 * @param {Object} props      Component props.
 * @param {string} props.name Slot name.
 */
function SlotReader( { name } ) {
	const { ref } = useSlot( name );
	return (
		<p>
			<code>
				{ ref
					? `ref defined, node: <${ ref.current?.tagName?.toLowerCase() }>`
					: 'ref: undefined (no portal Slot registered)' }
			</code>
		</p>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { slotName, bubblesVirtually, slotMounted } = attributes;

	const name = slotName || 'ajs-use-slot';

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'useSlot', 'component-kitchen-sink' ) }>
					<TextControl
						label="name"
						value={ slotName }
						onChange={ ( next ) =>
							setAttributes( { slotName: next } )
						}
					/>
					<ToggleControl
						label="Slot bubblesVirtually"
						checked={ bubblesVirtually }
						onChange={ ( next ) =>
							setAttributes( { bubblesVirtually: next } )
						}
					/>
					<ToggleControl
						label="Slot mounted"
						checked={ slotMounted }
						onChange={ ( next ) =>
							setAttributes( { slotMounted: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useSlot</h3>
				<SlotFillProvider>
					<SlotReader name={ name } />
					{ slotMounted &&
						( bubblesVirtually ? (
							<Slot
								name={ name }
								bubblesVirtually
								style={ { padding: 8, border: '1px dashed' } }
							/>
						) : (
							<Slot name={ name } />
						) ) }
					<Fill name={ name }>
						<p>
							{ __(
								'A Fill in the Slot',
								'component-kitchen-sink'
							) }
						</p>
					</Fill>
				</SlotFillProvider>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
