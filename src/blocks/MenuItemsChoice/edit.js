import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	MenuGroup,
	MenuItemsChoice,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const VALUE_OPTIONS = [
	{ label: 'one', value: 'one' },
	{ label: 'two', value: 'two' },
	{ label: 'three', value: 'three' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { value, showInfo, showShortcut, disableThird } = attributes;
	const [ hovered, setHovered ] = useState( null );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const choicesProps = {
		value,
		choices: [
			{
				label: 'Choice one',
				value: 'one',
				info: showInfo ? 'Info for one' : undefined,
				shortcut: showShortcut ? 'mod+1' : undefined,
			},
			{
				label: 'Choice two',
				value: 'two',
				info: showInfo ? 'Info for two' : undefined,
				shortcut: showShortcut ? 'mod+2' : undefined,
			},
			{
				label: 'Choice three',
				value: 'three',
				disabled: disableThird,
				info: showInfo ? 'Info for three' : undefined,
				shortcut: showShortcut ? 'mod+3' : undefined,
			},
		],
		onSelect: ( next ) => setAttributes( { value: next } ),
		onHover: setHovered,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'MenuItemsChoice', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="value"
						value={ value }
						options={ VALUE_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { value: next } )
						}
					/>
					<ToggleControl
						label="choices[].info"
						checked={ showInfo }
						onChange={ ( next ) =>
							setAttributes( { showInfo: next } )
						}
					/>
					<ToggleControl
						label="choices[].shortcut"
						checked={ showShortcut }
						onChange={ ( next ) =>
							setAttributes( { showShortcut: next } )
						}
					/>
					<ToggleControl
						label="choices[].disabled (third)"
						checked={ disableThird }
						onChange={ ( next ) =>
							setAttributes( { disableThird: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>MenuItemsChoice</h3>
				<div role="menu" style={ { maxWidth: 280 } }>
					<MenuGroup
						label={ __( 'Choose one', 'component-kitchen-sink' ) }
					>
						<MenuItemsChoice { ...choicesProps } />
					</MenuGroup>
				</div>
				<p>{ `onHover value: ${ hovered ?? 'null' }` }</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
