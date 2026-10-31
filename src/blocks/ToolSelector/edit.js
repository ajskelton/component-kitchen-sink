import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	ToolSelector,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { render } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ToolSelector', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label={ __(
							'Mount ToolSelector',
							'component-kitchen-sink'
						) }
						help={ __(
							'ToolSelector is deprecated and renders nothing. Mounting it logs a deprecation warning to the console.',
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
				<h3>ToolSelector</h3>
				<p>
					{ __(
						'Smoke test only: since WordPress 6.9 ToolSelector renders nothing (it only logs a deprecation notice), so there is nothing to see here.',
						'component-kitchen-sink'
					) }
				</p>
				{ render && <ToolSelector /> }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
