import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	DropZone,
	DropZoneProvider,
	PanelBody,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { label, drops } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'DropZoneProvider', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="DropZone label"
						help={ __(
							'DropZoneProvider takes only children and does nothing but render them.',
							'component-kitchen-sink'
						) }
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { drops: 0 } ) }
					>
						{ __( 'Reset drops', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>DropZoneProvider</h3>
				<p>
					{ __(
						'Drag a file or some text over the box below.',
						'component-kitchen-sink'
					) }
				</p>
				{ /* Deprecated since 5.8: logs a deprecation warning when rendered. */ }
				<DropZoneProvider>
					<div
						style={ {
							position: 'relative',
							minHeight: 100,
							border: '1px dashed #949494',
						} }
					>
						<p style={ { margin: 0, padding: 16 } }>
							{ `Drops: ${ drops }` }
						</p>
						<DropZone
							label={ label }
							onDrop={ () =>
								setAttributes( { drops: drops + 1 } )
							}
							onFilesDrop={ () =>
								setAttributes( { drops: drops + 1 } )
							}
							onHTMLDrop={ () =>
								setAttributes( { drops: drops + 1 } )
							}
						/>
					</div>
				</DropZoneProvider>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
