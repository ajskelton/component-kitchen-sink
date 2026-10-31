import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	Toolbar,
	ToolbarButton,
} from '@wordpress/components';
import { formatBold, formatItalic, link, trash } from '@wordpress/icons';
import './editor.scss';

/**
 * Icons offered by the icon select. The attribute stores the key, the
 * ToolbarButton receives the icon element from `@wordpress/icons`.
 */
const ICONS = { formatBold, formatItalic, link, trash };

const ICON_OPTIONS = [
	{ label: __( 'None', 'component-kitchen-sink' ), value: '' },
	...Object.keys( ICONS ).map( ( key ) => ( { label: key, value: key } ) ),
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		text,
		label,
		icon,
		isActive,
		disabled,
		isDestructive,
		showTooltip,
		subscript,
		clicks,
	} = attributes;

	// ToolbarButton takes the Button API; build the props once and share them.
	const buttonProps = {
		icon: ICONS[ icon ] ?? undefined,
		label: label || __( 'Toolbar button', 'component-kitchen-sink' ),
		isActive,
		disabled,
		isDestructive,
		showTooltip,
		subscript: subscript || undefined,
		onClick: () => setAttributes( { clicks: clicks + 1 } ),
		children: text || undefined,
	};

	// ToolbarButton needs a Toolbar parent to get the roving-tabindex context.
	const renderToolbar = () => (
		<Toolbar label={ __( 'ToolbarButton demo', 'component-kitchen-sink' ) }>
			<ToolbarButton { ...buttonProps } />
		</Toolbar>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ToolbarButton', 'component-kitchen-sink' ) }
				>
					{ renderToolbar() }
					<TextControl
						label="children (text)"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<SelectControl
						label="icon"
						value={ icon }
						options={ ICON_OPTIONS }
						onChange={ ( next ) => setAttributes( { icon: next } ) }
					/>
					<ToggleControl
						label="isActive"
						checked={ isActive }
						onChange={ ( next ) =>
							setAttributes( { isActive: next } )
						}
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
					<ToggleControl
						label="isDestructive"
						checked={ isDestructive }
						onChange={ ( next ) =>
							setAttributes( { isDestructive: next } )
						}
					/>
					<ToggleControl
						label="showTooltip"
						checked={ showTooltip }
						onChange={ ( next ) =>
							setAttributes( { showTooltip: next } )
						}
					/>
					<TextControl
						label="subscript"
						value={ subscript }
						onChange={ ( next ) =>
							setAttributes( { subscript: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { clicks: 0 } ) }
					>
						{ __( 'Reset clicks', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ToolbarButton</h3>
				{ renderToolbar() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
