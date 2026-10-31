import { __ } from '@wordpress/i18n';
import {
	BlockFormatControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { formatBold } from '@wordpress/icons';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { label, active, clicks } = attributes;

	return (
		<>
			{ /* BlockFormatControls is BlockControls with group="inline". */ }
			<BlockFormatControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ formatBold }
						label={ label }
						isActive={ active }
						onClick={ () =>
							setAttributes( {
								active: ! active,
								clicks: clicks + 1,
							} )
						}
					/>
				</ToolbarGroup>
			</BlockFormatControls>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockFormatControls',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label={ __(
							'Toolbar button label',
							'component-kitchen-sink'
						) }
						value={ label }
						help={ __(
							'The bold button appears in the inline (format) group of the block toolbar.',
							'component-kitchen-sink'
						) }
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
				<h3>BlockFormatControls</h3>
				{ /* BlockFormatControls renders into the block toolbar; the canvas shows its state. */ }
				<p>
					{ __( 'Format button is', 'component-kitchen-sink' ) }{ ' ' }
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
