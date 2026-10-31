import {
	RichTextToolbarButton,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { check, code, plus, starFilled } from '@wordpress/icons';
// Not a direct dependency: it ships with @wordpress/block-editor and is provided by WordPress at runtime.
// eslint-disable-next-line import/no-extraneous-dependencies
import { registerFormatType, toggleFormat } from '@wordpress/rich-text';
import metadata from './block.json';

export const FORMAT_NAME = 'ajs/rich-text-toolbar-button-demo';

/** Icons offered by the block; the attribute stores the key. */
export const ICONS = { starFilled, code, check, plus };

/*
 * RichTextToolbarButton is a Fill, so it only renders inside a format type's
 * `edit` function while a RichText is focused. This edit function reads its
 * props from the selected ajs/rich-text-toolbar-button block and renders
 * nothing for any other block.
 */
function ToolbarButtonFormatEdit( { isActive, value, onChange } ) {
	const block = useSelect(
		( select ) => select( blockEditorStore ).getSelectedBlock(),
		[]
	);
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	if ( block?.name !== metadata.name ) {
		return null;
	}

	const { title, icon, name, shortcutType, shortcutCharacter, clicks } =
		block.attributes;

	return (
		<RichTextToolbarButton
			name={ name || undefined }
			icon={ ICONS[ icon ] }
			title={ title }
			isActive={ isActive }
			shortcutType={ shortcutType || undefined }
			shortcutCharacter={ shortcutCharacter || undefined }
			onClick={ () => {
				onChange( toggleFormat( value, { type: FORMAT_NAME } ) );
				updateBlockAttributes( block.clientId, {
					clicks: clicks + 1,
				} );
			} }
		/>
	);
}

registerFormatType( FORMAT_NAME, {
	title: 'Toolbar button demo',
	tagName: 'mark',
	className: 'ajs-toolbar-button-demo',
	edit: ToolbarButtonFormatEdit,
} );
