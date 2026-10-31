import { InnerBlocks } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: Edit,
	// The block is dynamic (render.php), but its inner blocks still have to be
	// serialized so render.php can output them through $content.
	save: () => <InnerBlocks.Content />,
} );
