import { useInnerBlocksProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';

// The block is dynamic (render.php), but its inner blocks still have to be
// serialized so render.php can output them through $content.
function Save() {
	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'ajs-use-inner-blocks-props-content',
	} );
	return <div { ...innerBlocksProps } />;
}

registerBlockType( metadata.name, {
	edit: Edit,
	save: Save,
} );
