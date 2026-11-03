/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__unstableRichTextInputEvent as RichTextInputEvent,
	store as blockEditorStore,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { useDispatch, useSelect } from '@wordpress/data';
// Not a direct dependency: it ships with @wordpress/block-editor and is provided by WordPress at runtime.
// eslint-disable-next-line import/no-extraneous-dependencies
import { registerFormatType } from '@wordpress/rich-text';
import metadata from './block.json';

export const FORMAT_NAME = 'ajs/rich-text-input-event-demo';

/*
 * RichTextInputEvent only works inside a format type's `edit` function, where
 * RichText provides the input event context. It reads `inputType` from the
 * selected ajs/rich-text-input-event block and renders nothing for any other
 * block.
 */
function InputEventFormatEdit() {
	const block = useSelect(
		( select ) => select( blockEditorStore ).getSelectedBlock(),
		[]
	);
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	if ( block?.name !== metadata.name ) {
		return null;
	}

	return (
		<RichTextInputEvent
			inputType={ block.attributes.inputType }
			onInput={ () =>
				updateBlockAttributes( block.clientId, {
					handled: block.attributes.handled + 1,
				} )
			}
		/>
	);
}

registerFormatType( FORMAT_NAME, {
	title: 'Input event demo',
	tagName: 'mark',
	className: 'ajs-input-event-demo',
	edit: InputEventFormatEdit,
} );
