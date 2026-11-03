import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Fill,
	PanelBody,
	Slot,
	SlotFillProvider,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const {
		slotName,
		bubblesVirtually,
		placeholder,
		fillVisible,
		fillText,
		fillPropValue,
	} = attributes;

	const name = slotName || 'ajs-demo-slot';

	// `children` (a render function receiving the fills) is only valid when
	// bubblesVirtually is off; `className`/`style` only when it is on.
	const slotProps = bubblesVirtually
		? {
				bubblesVirtually: true,
				className: 'ajs-slot-demo',
				style: { padding: 8, border: '1px dashed currentColor' },
			}
		: {
				children: ( fills ) =>
					fills.length || ! placeholder ? (
						<div style={ { padding: 8, border: '1px solid' } }>
							{ fills }
						</div>
					) : (
						<em>
							{ __(
								'(Slot placeholder: no fills)',
								'component-kitchen-sink'
							) }
						</em>
					),
			};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Slot', 'component-kitchen-sink' ) }>
					<TextControl
						label="name"
						value={ slotName }
						onChange={ ( next ) =>
							setAttributes( { slotName: next } )
						}
					/>
					<ToggleControl
						label="bubblesVirtually"
						checked={ bubblesVirtually }
						onChange={ ( next ) =>
							setAttributes( { bubblesVirtually: next } )
						}
					/>
					<ToggleControl
						label="children placeholder (when no fills)"
						checked={ placeholder }
						disabled={ bubblesVirtually }
						onChange={ ( next ) =>
							setAttributes( { placeholder: next } )
						}
					/>
					<TextControl
						label="fillProps.value"
						value={ fillPropValue }
						onChange={ ( next ) =>
							setAttributes( { fillPropValue: next } )
						}
					/>
					<ToggleControl
						label="render a Fill for this Slot"
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
				<h3>Slot</h3>
				{ /* The block's own provider keeps this Slot isolated from the editor's slots. */ }
				<SlotFillProvider>
					<Slot
						name={ name }
						fillProps={ { value: fillPropValue } }
						{ ...slotProps }
					/>
					{ fillVisible && (
						<Fill name={ name }>
							{ ( fillProps ) => (
								<p>
									{ `${ fillText } (fillProps.value: ${ fillProps.value })` }
								</p>
							) }
						</Fill>
					) }
				</SlotFillProvider>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
