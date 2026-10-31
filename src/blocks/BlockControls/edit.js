import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { starFilled } from '@wordpress/icons';
import './editor.scss';

const GROUP_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: 'block', value: 'block' },
	{ label: 'other', value: 'other' },
	{ label: 'inline', value: 'inline' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { group, label, useControlsProp, active, clicks } = attributes;

	const toggle = () =>
		setAttributes( { active: ! active, clicks: clicks + 1 } );

	// `controls` is only honoured by the `default` group.
	const controls =
		group === 'default' && useControlsProp
			? [
					{
						icon: starFilled,
						title: `${ label } (controls prop)`,
						isActive: active,
						onClick: toggle,
					},
				]
			: undefined;

	return (
		<>
			<BlockControls group={ group } controls={ controls }>
				<ToolbarGroup>
					<ToolbarButton
						icon={ starFilled }
						label={ `${ label } (group=${ group })` }
						isActive={ active }
						onClick={ toggle }
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockControls', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="group"
						value={ group }
						options={ GROUP_OPTIONS }
						help={ __(
							'The star button appears in this group of the block toolbar. Click it to toggle active.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { group: next } )
						}
					/>
					<ToggleControl
						label="controls (only for group default)"
						checked={ useControlsProp }
						onChange={ ( next ) =>
							setAttributes( { useControlsProp: next } )
						}
					/>
					<TextControl
						label={ __(
							'Toolbar button label',
							'component-kitchen-sink'
						) }
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<ToggleControl
						label={ __(
							'active (mirrors the toolbar button)',
							'component-kitchen-sink'
						) }
						checked={ active }
						onChange={ ( next ) =>
							setAttributes( { active: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockControls</h3>
				{ /* BlockControls renders into the block toolbar; the canvas shows its state. */ }
				<p>
					{ __( 'Toolbar button is', 'component-kitchen-sink' ) }{ ' ' }
					<strong>
						{ active
							? __( 'active', 'component-kitchen-sink' )
							: __( 'inactive', 'component-kitchen-sink' ) }
					</strong>
					{ ' · ' }
					{ clicks } { __( 'clicks', 'component-kitchen-sink' ) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
