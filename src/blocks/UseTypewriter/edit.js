import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__unstableUseTypewriter as useTypewriter,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { lines, enabled } = attributes;

	// Returns a ref callback. While the user types or moves the caret with the
	// arrow keys inside the element, the nearest scroll container is scrolled
	// so that the caret stays at the same height (typewriter mode).
	const typewriterRef = useTypewriter();

	const [ scrollTop, setScrollTop ] = useState( 0 );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__unstableUseTypewriter',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="ref (attach to the element)"
						checked={ enabled }
						onChange={ ( next ) =>
							setAttributes( { enabled: next } )
						}
					/>
					<RangeControl
						label={ __(
							'Lines of text',
							'component-kitchen-sink'
						) }
						value={ lines }
						min={ 5 }
						max={ 100 }
						onChange={ ( next ) =>
							setAttributes( { lines: next ?? 30 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useTypewriter</h3>
				<p>
					{ __(
						'Click into the text below and press Enter or the arrow keys: the box scrolls to keep the caret in place.',
						'component-kitchen-sink'
					) }
				</p>
				<div
					ref={ enabled ? typewriterRef : undefined }
					onScroll={ ( event ) =>
						setScrollTop(
							Math.round( event.currentTarget.scrollTop )
						)
					}
					style={ {
						height: 140,
						overflow: 'auto',
						border: '1px solid currentColor',
					} }
				>
					<div
						contentEditable
						suppressContentEditableWarning
						role="textbox"
						tabIndex={ 0 }
						aria-label={ __(
							'Typewriter sample',
							'component-kitchen-sink'
						) }
						style={ { padding: 8 } }
					>
						{ Array.from( { length: lines }, ( _, index ) => (
							<p key={ index } style={ { margin: 0 } }>
								{ `Line ${ index + 1 }` }
							</p>
						) ) }
					</div>
				</div>
				<pre>
					{ JSON.stringify( { enabled, lines, scrollTop }, null, 2 ) }
				</pre>
			</div>
		</>
	);
}
