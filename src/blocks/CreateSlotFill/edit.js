import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';
import {
	createSlotFill,
	PanelBody,
	SlotFillProvider,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { slotName, bubblesVirtually, fillVisible, fillText } = attributes;

	const name = slotName || 'ajs-created-slot';

	// createSlotFill returns a { name, Slot, Fill } trio bound to one name.
	// Memoise it: calling it on every render would remount the components.
	const { Slot, Fill } = useMemo( () => createSlotFill( name ), [ name ] );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'createSlotFill', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="key"
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
						label="render the Fill"
						checked={ fillVisible }
						onChange={ ( next ) =>
							setAttributes( { fillVisible: next } )
						}
					/>
					<TextControl
						label="Fill text"
						value={ fillText }
						onChange={ ( next ) =>
							setAttributes( { fillText: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>createSlotFill</h3>
				<SlotFillProvider>
					{ /* The created Slot takes no `name`: it is bound to the key. */ }
					{ bubblesVirtually ? (
						<Slot
							bubblesVirtually
							style={ { padding: 8, border: '1px dashed' } }
						/>
					) : (
						<Slot />
					) }
					{ fillVisible && (
						<Fill>
							<p>{ fillText }</p>
						</Fill>
					) }
				</SlotFillProvider>
				<p>
					<code>{ `Slot.__unstableName: ${ String( Slot.__unstableName ) }` }</code>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
