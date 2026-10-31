import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	store as blockEditorStore,
	__unstableUseTypingObserver as useTypingObserver,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { sampleText } = attributes;

	// Returns a ref callback. Typing in a text field inside the element sets
	// the editor's typing flag; Escape, Tab, selecting text or moving the
	// mouse clears it.
	const typingRef = useTypingObserver();

	const isTyping = useSelect(
		( select ) => select( blockEditorStore ).isTyping(),
		[]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__unstableUseTypingObserver',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="sampleText"
						help={ __(
							'Typing here does not set the flag: only the field in the canvas is observed.',
							'component-kitchen-sink'
						) }
						value={ sampleText }
						onChange={ ( next ) =>
							setAttributes( { sampleText: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useTypingObserver</h3>
				{ /* The ref is attached to this element. */ }
				<div ref={ typingRef } style={ { padding: 8 } }>
					<label htmlFor="ajs-typing-observer-input">
						{ __(
							'Type in this field, then move the mouse:',
							'component-kitchen-sink'
						) }
					</label>
					<br />
					<input
						id="ajs-typing-observer-input"
						type="text"
						value={ sampleText }
						onChange={ ( event ) =>
							setAttributes( { sampleText: event.target.value } )
						}
					/>
				</div>
				<pre>
					{ JSON.stringify( { isTyping, sampleText }, null, 2 ) }
				</pre>
			</div>
		</>
	);
}
