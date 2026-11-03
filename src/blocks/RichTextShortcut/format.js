import {
	RichTextShortcut,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
// Not a direct dependency: it ships with @wordpress/block-editor and is provided by WordPress at runtime.
// eslint-disable-next-line import/no-extraneous-dependencies
import { registerFormatType, toggleFormat } from '@wordpress/rich-text';
import metadata from './block.json';

export const FORMAT_NAME = 'ajs/rich-text-shortcut-demo';

/**
 * Format `edit` function. RichTextShortcut only works as a child of a format
 * type's edit function, because RichText provides the keyboard shortcut context
 * to them. The shortcut is read from the selected ajs/rich-text-shortcut block
 * and ignored for every other block, so it never affects the rest of the editor.
 *
 * @param {Object}                 props          Props passed by RichText to a format edit.
 * @param {Object}                 props.value    Rich text value.
 * @param {(next: Object) => void} props.onChange Rich text change handler.
 */
function ShortcutFormatEdit( { value, onChange } ) {
	const block = useSelect(
		( select ) => select( blockEditorStore ).getSelectedBlock(),
		[]
	);
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	if ( block?.name !== metadata.name ) {
		return null;
	}

	const { character, type, uses } = block.attributes;
	if ( ! character ) {
		return null;
	}

	return (
		<RichTextShortcut
			type={ type }
			character={ character }
			onUse={ () => {
				onChange( toggleFormat( value, { type: FORMAT_NAME } ) );
				updateBlockAttributes( block.clientId, { uses: uses + 1 } );
			} }
		/>
	);
}

registerFormatType( FORMAT_NAME, {
	title: 'Shortcut demo',
	tagName: 'mark',
	className: 'ajs-shortcut-demo',
	edit: ShortcutFormatEdit,
} );
