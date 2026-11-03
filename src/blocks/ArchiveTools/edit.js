import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
import './editor.scss';

/**
 * Editor view of the Archive Tools block.
 *
 * Renders the same form as the front end through the REST block-renderer
 * endpoint. Outside an archive the result count is not shown.
 *
 * @param {Object}                 props               Block props.
 * @param {Object}                 props.attributes    Block attributes.
 * @param {(next: Object) => void} props.setAttributes Attribute setter.
 * @return {Element} The block.
 */
export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Archive Tools', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label={ __( 'Archive', 'component-kitchen-sink' ) }
						value={ attributes.postType }
						options={ [
							{
								label: __(
									'Components',
									'component-kitchen-sink'
								),
								value: 'ajs_component',
							},
							{
								label: __(
									'Core Blocks',
									'component-kitchen-sink'
								),
								value: 'ajs_core_block',
							},
						] }
						onChange={ ( postType ) =>
							setAttributes( { postType } )
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender
					block={ metadata.name }
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
