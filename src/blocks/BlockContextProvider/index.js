import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';
import { PROBE_NAME, probeSettings } from './probe';

registerBlockType( metadata.name, {
	edit: Edit,
} );

// Client-only fixture block that displays the context it receives.
registerBlockType( PROBE_NAME, probeSettings );
