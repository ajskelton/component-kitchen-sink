import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	DropdownMenu,
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
	more,
	plus,
	starFilled,
	trash,
} from '@wordpress/icons';
import './editor.scss';

const ICONS = { more, plus, cog, check, trash, external, starFilled };

const ICON_OPTIONS = Object.keys( ICONS ).map( ( key ) => ( {
	label: key,
	value: key,
} ) );

const PLACEMENT_OPTIONS = [
	'bottom-start',
	'bottom',
	'bottom-end',
	'top-start',
	'top',
	'top-end',
	'right-start',
	'left-start',
].map( ( value ) => ( { label: value, value } ) );

const CONTROL_ICONS = { 'Option A': plus, 'Option B': cog, 'Option C': check };

export default function Edit( { attributes, setAttributes } ) {
	const {
		label,
		text,
		icon,
		noIcons,
		disableOpenOnArrowDown,
		placement,
		useChildren,
		activeControl,
		selections,
	} = attributes;

	const select = ( title ) =>
		setAttributes( { activeControl: title, selections: selections + 1 } );

	// `controls` is an array of options; `children` is a render prop.
	const controls = Object.keys( CONTROL_ICONS ).map( ( title ) => ( {
		title,
		icon: CONTROL_ICONS[ title ],
		isActive: activeControl === title,
		onClick: () => select( title ),
	} ) );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const menuProps = {
		label,
		text: text || undefined,
		icon: ICONS[ icon ],
		noIcons,
		disableOpenOnArrowDown,
		popoverProps: { placement },
		...( useChildren
			? {
					children: ( { onClose } ) => (
						<MenuGroup
							label={ __(
								'Via children',
								'component-kitchen-sink'
							) }
						>
							{ Object.keys( CONTROL_ICONS ).map( ( title ) => (
								<MenuItem
									key={ title }
									icon={ CONTROL_ICONS[ title ] }
									isSelected={ activeControl === title }
									role="menuitemradio"
									onClick={ () => {
										select( title );
										onClose();
									} }
								>
									{ title }
								</MenuItem>
							) ) }
						</MenuGroup>
					),
				}
			: { controls } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'DropdownMenu', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="text"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<SelectControl
						label="icon"
						value={ icon }
						options={ ICON_OPTIONS }
						onChange={ ( next ) => setAttributes( { icon: next } ) }
					/>
					<ToggleControl
						label="noIcons"
						checked={ noIcons }
						onChange={ ( next ) =>
							setAttributes( { noIcons: next } )
						}
					/>
					<ToggleControl
						label="disableOpenOnArrowDown"
						checked={ disableOpenOnArrowDown }
						onChange={ ( next ) =>
							setAttributes( { disableOpenOnArrowDown: next } )
						}
					/>
					<SelectControl
						label="popoverProps.placement"
						value={ placement }
						options={ PLACEMENT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { placement: next } )
						}
					/>
					<ToggleControl
						label="children (render prop) instead of controls"
						checked={ useChildren }
						onChange={ ( next ) =>
							setAttributes( { useChildren: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( {
								activeControl: '',
								selections: 0,
							} )
						}
					>
						{ __( 'Reset selection', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>DropdownMenu</h3>
				<DropdownMenu { ...menuProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
