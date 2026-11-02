import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
import './editor.scss';

/**
 * Editor view of the Core Block Info block.
 *
 * The block has no attributes: everything it shows comes from the post's
 * package and export-name meta and the JSON under data/, so the editor
 * simply renders the same output as the front end through the REST
 * block-renderer endpoint.
 *
 * @param {Object}                 props               Block props.
 * @param {Object}                 props.attributes    Block attributes.
 * @param {(next: Object) => void} props.setAttributes Attribute setter.
 * @param {Object}                 props.context       Block context (postId, postType).
 * @return {Element} The block.
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const { variant } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Core Block Info', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label={ __( 'Variant', 'component-kitchen-sink' ) }
						value={ variant }
						options={ [
							{
								label: __( 'Full', 'component-kitchen-sink' ),
								value: 'full',
							},
							{
								label: __(
									'Summary (one line, for archives)',
									'component-kitchen-sink'
								),
								value: 'summary',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { variant: value } )
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<p>
						{ __(
							'Read-only. The components listed here are generated from data/usage.json; run `npm run data:usage` to refresh them.',
							'component-kitchen-sink'
						) }
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender
					block={ metadata.name }
					attributes={ attributes }
					urlQueryArgs={
						context?.postId ? { post_id: context.postId } : {}
					}
				/>
			</div>
		</>
	);
}
