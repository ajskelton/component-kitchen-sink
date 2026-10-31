import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	withSpokenMessages,
} from '@wordpress/components';
import './editor.scss';

const POLITENESS_OPTIONS = [ 'polite', 'assertive' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

/**
 * Wrapped component: receives `speak` and `debouncedSpeak` from the HOC.
 *
 * @param {Object}   props                Component props.
 * @param {()=>void} props.speak          Announces a message to screen readers.
 * @param {()=>void} props.debouncedSpeak Same, debounced by 500ms.
 * @param {string}   props.message        Message to announce.
 * @param {string}   props.politeness     'polite' or 'assertive'.
 * @param {()=>void} props.onSpoken       Called with the function name used.
 */
function SpeakDemo( { speak, debouncedSpeak, message, politeness, onSpoken } ) {
	return (
		<div>
			<Button
				variant="secondary"
				onClick={ () => {
					speak( message, politeness );
					onSpoken( 'speak' );
				} }
			>
				speak
			</Button>{ ' ' }
			<Button
				variant="secondary"
				onClick={ () => {
					debouncedSpeak( message, politeness );
					onSpoken( 'debouncedSpeak' );
				} }
			>
				debouncedSpeak
			</Button>
		</div>
	);
}

// Created once at module level, never inside render.
const SpeakDemoWithSpokenMessages = withSpokenMessages( SpeakDemo );

export default function Edit( { attributes, setAttributes } ) {
	const { message, politeness, speakCount } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'withSpokenMessages',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="message"
						value={ message }
						onChange={ ( next ) =>
							setAttributes( { message: next } )
						}
					/>
					<SelectControl
						label="ariaLive (politeness)"
						value={ politeness }
						options={ POLITENESS_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { politeness: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>withSpokenMessages</h3>
				<SpeakDemoWithSpokenMessages
					message={ message }
					politeness={ politeness }
					onSpoken={ ( name ) =>
						setAttributes( {
							lastSpoken: name,
							speakCount: speakCount + 1,
						} )
					}
				/>
				<p>
					{ __(
						'Messages go to the hidden #a11y-speak-* live regions; turn on a screen reader to hear them.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
