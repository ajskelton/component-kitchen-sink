import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	store as blockEditorStore,
	__unstableUseMouseMoveTypingReset as useMouseMoveTypingReset,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { Button, PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { starts } = attributes;

	// Returns a ref callback. While the editor's typing flag is set, a real
	// mouse movement inside the element's document clears the flag.
	const resetRef = useMouseMoveTypingReset();

	const isTyping = useSelect(
		( select ) => select( blockEditorStore ).isTyping(),
		[]
	);
	const { startTyping, stopTyping } = useDispatch( blockEditorStore );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__unstableUseMouseMoveTypingReset',
						'component-kitchen-sink'
					) }
				>
					<Button
						variant="tertiary"
						onClick={ () => setAttributes( { starts: 0 } ) }
					>
						{ __( 'Reset start count', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useMouseMoveTypingReset</h3>
				{ /* The ref is attached to this element. */ }
				<div ref={ resetRef } style={ { padding: 8 } }>
					<p>
						{ __(
							'Press "startTyping()" (this hides the block toolbar), then move the mouse: the hook clears the typing flag again.',
							'component-kitchen-sink'
						) }
					</p>
					<Button
						variant="secondary"
						onClick={ () => {
							startTyping();
							setAttributes( { starts: starts + 1 } );
						} }
					>
						startTyping()
					</Button>{ ' ' }
					<Button variant="tertiary" onClick={ () => stopTyping() }>
						stopTyping()
					</Button>
				</div>
				<pre>{ JSON.stringify( { isTyping, starts }, null, 2 ) }</pre>
			</div>
		</>
	);
}
