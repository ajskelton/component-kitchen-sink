import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__unstableUseClipboardHandler as useClipboardHandler,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { Button, PanelBody, ToggleControl } from '@wordpress/components';
import './editor.scss';

/**
 * Calls the (deprecated) hook and attaches the returned ref to a focusable
 * element. The hook adds copy, cut, paste and drop listeners on the whole
 * document, exactly like the editor's own WritingFlow does, so mounting it
 * makes block copy/paste be handled twice.
 *
 * @param {Object}     props        Component props.
 * @param {() => void} props.onCopy Called on a copy event inside the element.
 */
function ClipboardArea( { onCopy } ) {
	const clipboardRef = useClipboardHandler();
	return (
		<div
			ref={ clipboardRef }
			tabIndex={ 0 }
			onCopy={ onCopy }
			style={ { border: '2px dashed currentColor', padding: 8 } }
		>
			{ __(
				'Focus this box and press Cmd/Ctrl+C. The hook copies the selected block(s) as block markup instead of plain text.',
				'component-kitchen-sink'
			) }
		</div>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { enabled, copyCount } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__unstableUseClipboardHandler',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="enabled (mount the hook)"
						help={ __(
							'Off by default: while on, copy/paste in the editor is handled twice.',
							'component-kitchen-sink'
						) }
						checked={ enabled }
						onChange={ ( next ) =>
							setAttributes( { enabled: next } )
						}
					/>
					<Button
						variant="tertiary"
						onClick={ () => setAttributes( { copyCount: 0 } ) }
					>
						{ __( 'Reset copy count', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useClipboardHandler</h3>
				{ enabled ? (
					<ClipboardArea
						onCopy={ () =>
							setAttributes( { copyCount: copyCount + 1 } )
						}
					/>
				) : (
					<p>
						{ __(
							'Turn on "enabled" in the inspector to mount the deprecated hook.',
							'component-kitchen-sink'
						) }
					</p>
				) }
				<pre>
					{ JSON.stringify(
						{ enabled, copyEventsInArea: copyCount },
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
