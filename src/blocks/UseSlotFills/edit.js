import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalUseSlotFills as useSlotFills,
	Fill,
	PanelBody,
	RangeControl,
	Slot,
	SlotFillProvider,
	TextControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

/**
 * Calls useSlotFills below the SlotFillProvider. The hook returns an opaque
 * array with one entry per Fill, or undefined when nothing registered yet.
 *
 * @param {Object} props      Component props.
 * @param {string} props.name Slot name.
 */
function FillsReader( { name } ) {
	const fills = useSlotFills( name );
	return (
		<p>
			<code>
				{ `useSlotFills( "${ name }" ).length: ${
					fills ? fills.length : 'undefined'
				}` }
			</code>
		</p>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { slotName, fillCount } = attributes;

	const name = slotName || 'ajs-use-slot-fills';

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'useSlotFills', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="name"
						value={ slotName }
						onChange={ ( next ) =>
							setAttributes( { slotName: next } )
						}
					/>
					<RangeControl
						label="number of Fills"
						value={ fillCount }
						min={ 0 }
						max={ 5 }
						onChange={ ( next ) =>
							setAttributes( { fillCount: next ?? 0 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useSlotFills</h3>
				<SlotFillProvider>
					<FillsReader name={ name } />
					<Slot name={ name } />
					{ Array.from( { length: fillCount }, ( _, index ) => (
						<Fill key={ index } name={ name }>
							<p>{ `Fill ${ index + 1 }` }</p>
						</Fill>
					) ) }
				</SlotFillProvider>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
