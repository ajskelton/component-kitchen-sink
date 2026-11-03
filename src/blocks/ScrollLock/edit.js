import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ScrollLock, ToggleControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { locked } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ScrollLock', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="mounted (locks scroll)"
						checked={ locked }
						help={ __(
							'While mounted, ScrollLock adds the lockscroll class to the top-level document element and body.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { locked: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ScrollLock</h3>
				{ /* ScrollLock renders nothing; its effect is a class on the top-level document. */ }
				{ locked && <ScrollLock /> }
				<p>
					{ __( 'Scroll locked:', 'component-kitchen-sink' ) }{ ' ' }
					<strong>{ locked ? 'Yes' : 'No' }</strong>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
