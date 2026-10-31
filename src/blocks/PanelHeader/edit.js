import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Panel,
	PanelBody,
	PanelHeader,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { label, showChildren } = attributes;

	// PanelHeader is used by Panel internally. Rendering it alone, inside a
	// Panel wrapper, shows the label and any extra children.
	const demo = (
		<Panel>
			<PanelHeader label={ label }>
				{ showChildren && (
					<Button variant="secondary" size="small">
						{ __( 'Child button', 'component-kitchen-sink' ) }
					</Button>
				) }
			</PanelHeader>
		</Panel>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'PanelHeader', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<ToggleControl
						label="children"
						checked={ showChildren }
						onChange={ ( next ) =>
							setAttributes( { showChildren: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>PanelHeader</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
