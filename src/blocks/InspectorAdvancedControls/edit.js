import { __ } from '@wordpress/i18n';
import {
	InspectorAdvancedControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { note } = attributes;

	return (
		<>
			{ /* The fill under test: rendered into the sidebar's Advanced panel. */ }
			<InspectorAdvancedControls>
				<TextControl
					label="InspectorAdvancedControls field"
					value={ note }
					help={ __(
						'Rendered inside the Advanced panel.',
						'component-kitchen-sink'
					) }
					onChange={ ( next ) => setAttributes( { note: next } ) }
				/>
			</InspectorAdvancedControls>
			<InspectorControls>
				<PanelBody
					title={ __(
						'InspectorAdvancedControls',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label={ __(
							'Mirror of the Advanced panel field',
							'component-kitchen-sink'
						) }
						value={ note }
						help={ __(
							'Edits here write the same note attribute.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) => setAttributes( { note: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>InspectorAdvancedControls</h3>
				{ /* InspectorAdvancedControls renders into the sidebar; the canvas echoes its value. */ }
				<p>
					{ __( 'Field value:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ note }</code>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
