import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
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

/**
 * Icons offered by the icon select. The attribute stores the key, the Button
 * receives the icon element from `@wordpress/icons`.
 */
const ICONS = { plus, cog, check, trash, external, starFilled };

const VARIANT_OPTIONS = [
	{ label: 'primary', value: 'primary' },
	{ label: 'secondary', value: 'secondary' },
	{ label: 'tertiary', value: 'tertiary' },
	{ label: 'link', value: 'link' },
];

const SIZE_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: 'compact', value: 'compact' },
	{ label: 'small', value: 'small' },
];

const ICON_OPTIONS = [
	{ label: __( 'None', 'component-kitchen-sink' ), value: '' },
	...Object.keys( ICONS ).map( ( key ) => ( { label: key, value: key } ) ),
];

const ICON_POSITION_OPTIONS = [
	{ label: 'left', value: 'left' },
	{ label: 'right', value: 'right' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		text,
		variant,
		size,
		isDestructive,
		disabled,
		icon,
		iconPosition,
		clicks,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const buttonProps = {
		variant,
		size,
		isDestructive,
		disabled,
		// Keep a disabled Button focusable so it can still be inspected.
		accessibleWhenDisabled: disabled,
		icon: ICONS[ icon ] ?? undefined,
		iconPosition,
		text,
		// An icon-only Button needs an accessible label.
		label: text ? undefined : __( 'Icon button', 'component-kitchen-sink' ),
		onClick: () => setAttributes( { clicks: clicks + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Button', 'component-kitchen-sink' ) }>
					<BaseControl
						id="ajs-button-preview"
						label={ __( 'Preview', 'component-kitchen-sink' ) }
						help={ __(
							'Click the Button to increment the clicks attribute.',
							'component-kitchen-sink'
						) }
					>
						<div>
							<Button
								id="ajs-button-preview"
								{ ...buttonProps }
							/>
						</div>
					</BaseControl>
					<TextControl
						label="text"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<SelectControl
						label="variant"
						value={ variant }
						options={ VARIANT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { variant: next } )
						}
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
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
				<h3>Button</h3>
				<Button { ...buttonProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
