import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalPreviewOptions as PreviewOptions,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, ToggleControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { render } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'PreviewOptions', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label={ __(
							'Mount PreviewOptions',
							'component-kitchen-sink'
						) }
						help={ __(
							'PreviewOptions is deprecated and renders nothing. Mounting it logs a deprecation warning to the console.',
							'component-kitchen-sink'
						) }
						checked={ render }
						onChange={ ( next ) =>
							setAttributes( { render: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>PreviewOptions</h3>
				<p>
					{ __(
						'Smoke test only: PreviewOptions is deprecated since WordPress 6.5 and renders nothing (it only logs a deprecation notice), so there is nothing to see here.',
						'component-kitchen-sink'
					) }
				</p>
				{ render && <PreviewOptions /> }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
