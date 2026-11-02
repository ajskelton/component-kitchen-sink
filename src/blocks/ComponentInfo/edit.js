import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
import './editor.scss';

/**
 * Editor view of the Component Info block.
 *
 * The block has no attributes: everything it shows comes from the post's
 * package and export-name meta and the JSON under data/, so the editor
 * simply renders the same output as the front end through the REST
 * block-renderer endpoint.
 *
 * @param {Object} props         Block props.
 * @param {Object} props.context Block context (postId, postType).
 * @return {Element} The block.
 */
export default function Edit( { context } ) {
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Component Info', 'component-kitchen-sink' ) }
				>
					<p>
						{ __(
							'Read-only. The usage and history shown here are generated from data/usage.json and data/history.json; run `npm run data` to refresh them.',
							'component-kitchen-sink'
						) }
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender
					block={ metadata.name }
					attributes={ {} }
					urlQueryArgs={
						context?.postId ? { post_id: context.postId } : {}
					}
				/>
			</div>
		</>
	);
}
