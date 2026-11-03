import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	MenuGroup,
	MenuItem,
	PanelBody,
	SelectControl,
	TextControl,
	Toolbar,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import {
	arrowDown,
	arrowLeft,
	arrowRight,
	arrowUp,
	chevronDown,
	moreVertical,
} from '@wordpress/icons';
import './editor.scss';

const ICONS = { moreVertical, arrowUp, chevronDown };

const DIRECTIONS = [
	{ key: 'up', icon: arrowUp, title: 'Up' },
	{ key: 'down', icon: arrowDown, title: 'Down' },
	{ key: 'left', icon: arrowLeft, title: 'Left' },
	{ key: 'right', icon: arrowRight, title: 'Right' },
];

const ICON_OPTIONS = Object.keys( ICONS ).map( ( key ) => ( {
	label: key,
	value: key,
} ) );

const MODE_OPTIONS = [
	{ label: 'controls', value: 'controls' },
	{ label: 'children (render prop)', value: 'children' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { label, icon, mode, selected } = attributes;

	const menuProps = {
		label: label || __( 'Select a direction', 'component-kitchen-sink' ),
		icon: ICONS[ icon ] ?? moreVertical,
	};

	if ( mode === 'controls' ) {
		menuProps.controls = DIRECTIONS.map( ( item ) => ( {
			title: item.title,
			icon: item.icon,
			isActive: selected === item.key,
			onClick: () => setAttributes( { selected: item.key } ),
		} ) );
	} else {
		menuProps.children = ( { onClose } ) => (
			<MenuGroup>
				{ DIRECTIONS.map( ( item ) => (
					<MenuItem
						key={ item.key }
						icon={ item.icon }
						isSelected={ selected === item.key }
						role="menuitemradio"
						onClick={ () => {
							setAttributes( { selected: item.key } );
							onClose();
						} }
					>
						{ item.title }
					</MenuItem>
				) ) }
			</MenuGroup>
		);
	}

	const renderToolbar = () => (
		<Toolbar
			label={ __( 'ToolbarDropdownMenu demo', 'component-kitchen-sink' ) }
		>
			<ToolbarDropdownMenu { ...menuProps } />
		</Toolbar>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'ToolbarDropdownMenu',
						'component-kitchen-sink'
					) }
				>
					{ renderToolbar() }
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
					<SelectControl
						label="controls / children"
						value={ mode }
						options={ MODE_OPTIONS }
						onChange={ ( next ) => setAttributes( { mode: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ToolbarDropdownMenu</h3>
				{ renderToolbar() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
