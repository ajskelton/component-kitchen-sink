import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	MenuGroup,
	MenuItem,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import {
	check,
	cog,
	external,
	plus,
	starFilled,
	trash,
} from '@wordpress/icons';
import './editor.scss';

const ICONS = { plus, cog, check, trash, external, starFilled };

const ICON_OPTIONS = [
	{ label: __( 'None', 'component-kitchen-sink' ), value: '' },
	...Object.keys( ICONS ).map( ( key ) => ( { label: key, value: key } ) ),
];

const ICON_POSITION_OPTIONS = [
	{ label: 'left', value: 'left' },
	{ label: 'right', value: 'right' },
];

const ROLE_OPTIONS = [
	{ label: 'menuitem', value: 'menuitem' },
	{ label: 'menuitemradio', value: 'menuitemradio' },
	{ label: 'menuitemcheckbox', value: 'menuitemcheckbox' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		text,
		info,
		icon,
		iconPosition,
		isSelected,
		role,
		shortcut,
		hasSuffix,
		isDestructive,
		disabled,
		clicks,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const itemProps = {
		info: info || undefined,
		icon: ICONS[ icon ] ?? undefined,
		iconPosition,
		isSelected,
		role,
		shortcut: shortcut || undefined,
		suffix: hasSuffix ? (
			<span>{ __( 'suffix', 'component-kitchen-sink' ) }</span>
		) : undefined,
		isDestructive,
		disabled,
		onClick: () => setAttributes( { clicks: clicks + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'MenuItem', 'component-kitchen-sink' ) }>
					<TextControl
						label="children"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<TextControl
						label="info"
						value={ info }
						onChange={ ( next ) => setAttributes( { info: next } ) }
					/>
					<SelectControl
						label="icon"
						value={ icon }
						options={ ICON_OPTIONS }
						onChange={ ( next ) => setAttributes( { icon: next } ) }
					/>
					<SelectControl
						label="iconPosition"
						value={ iconPosition }
						options={ ICON_POSITION_OPTIONS }
						disabled={ ! icon }
						onChange={ ( next ) =>
							setAttributes( { iconPosition: next } )
						}
					/>
					<ToggleControl
						label="isSelected"
						help={ __(
							'Only exposed as aria-checked for the menuitemradio and menuitemcheckbox roles.',
							'component-kitchen-sink'
						) }
						checked={ isSelected }
						onChange={ ( next ) =>
							setAttributes( { isSelected: next } )
						}
					/>
					<SelectControl
						label="role"
						value={ role }
						options={ ROLE_OPTIONS }
						onChange={ ( next ) => setAttributes( { role: next } ) }
					/>
					<TextControl
						label="shortcut"
						value={ shortcut }
						help={ __(
							'For example: mod+shift+k',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { shortcut: next } )
						}
					/>
					<ToggleControl
						label="suffix"
						checked={ hasSuffix }
						onChange={ ( next ) =>
							setAttributes( { hasSuffix: next } )
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
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
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
				<h3>MenuItem</h3>
				{ /* MenuItem needs a MenuGroup parent for its menu styling. */ }
				<div role="menu" style={ { maxWidth: 280 } }>
					<MenuGroup>
						<MenuItem { ...itemProps }>{ text }</MenuItem>
					</MenuGroup>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
