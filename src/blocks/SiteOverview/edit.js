import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
import './editor.scss';

/**
 * Editor view of the Site Overview block.
 *
 * The block has no attributes; it renders the same output as the front end
 * through the REST block-renderer endpoint.
 *
 * @return {Element} The block.
 */
export default function Edit() {
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Site Overview', 'component-kitchen-sink' ) }
				>
					<p>
						{ __(
							'Read-only. Counts and links come from the published Component and Core Block posts and the test pages.',
							'component-kitchen-sink'
						) }
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender block={ metadata.name } attributes={ {} } />
			</div>
		</>
	);
}
