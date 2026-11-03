import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import './editor.scss';

const GROUP_OPTIONS = [
	'default',
	'advanced',
	'styles',
	'typography',
	'color',
	'dimensions',
	'border',
	'effects',
	'position',
	'layout',
	'bindings',
	'list',
].map( ( group ) => ( { label: group, value: group } ) );

export default function Edit( { attributes, setAttributes } ) {
	const { group, note } = attributes;

	return (
		<>
			{ /* The fill under test: a labelled field rendered into the chosen inspector group. */ }
			<InspectorControls group={ group }>
				<PanelBody
					title={ __(
						'InspectorControls',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label={ `InspectorControls group=${ group }` }
						value={ note }
						onChange={ ( next ) => setAttributes( { note: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			{ /* Settings tab control that chooses where the fill above lands. */ }
			<InspectorControls>
				<PanelBody
					title={ __(
						'InspectorControls (group picker)',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="group"
						value={ group }
						options={ GROUP_OPTIONS }
						help={ __(
							'Where the "InspectorControls group=…" field is rendered. Non-default groups appear in the Styles tab or the Advanced panel.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { group: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>InspectorControls</h3>
				{ /* InspectorControls renders into the sidebar; the canvas echoes its value. */ }
				<p>
					{ __( 'Field value:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ note }</code>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
