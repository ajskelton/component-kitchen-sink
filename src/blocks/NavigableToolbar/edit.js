import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	NavigableToolbar,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	ToolbarButton,
} from '@wordpress/components';
import {
	alignCenter,
	alignLeft,
	alignRight,
	check,
	cog,
} from '@wordpress/icons';
import './editor.scss';

const ICONS = [ alignLeft, alignCenter, alignRight, check, cog ];

const ORIENTATION_OPTIONS = [
	{ label: 'horizontal', value: 'horizontal' },
	{ label: 'vertical', value: 'vertical' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		orientation,
		ariaLabel,
		focusEditorOnEscape,
		shouldUseKeyboardFocusShortcut,
		initialIndex,
		buttonCount,
		clicks,
	} = attributes;

	// Props shared by the toolbar in the canvas.
	const toolbarProps = {
		orientation,
		'aria-label': ariaLabel,
		focusEditorOnEscape,
		shouldUseKeyboardFocusShortcut,
		__experimentalInitialIndex: Math.min( initialIndex, buttonCount - 1 ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'NavigableToolbar', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="orientation"
						value={ orientation }
						options={ ORIENTATION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { orientation: next } )
						}
					/>
					<TextControl
						label="aria-label"
						value={ ariaLabel }
						onChange={ ( next ) =>
							setAttributes( { ariaLabel: next } )
						}
					/>
					<ToggleControl
						label="focusEditorOnEscape"
						checked={ focusEditorOnEscape }
						onChange={ ( next ) =>
							setAttributes( { focusEditorOnEscape: next } )
						}
					/>
					<ToggleControl
						label="shouldUseKeyboardFocusShortcut"
						help={ __(
							'Off by default here so this toolbar does not compete with the editor toolbar for the focus shortcut (Alt + F10).',
							'component-kitchen-sink'
						) }
						checked={ shouldUseKeyboardFocusShortcut }
						onChange={ ( next ) =>
							setAttributes( {
								shouldUseKeyboardFocusShortcut: next,
							} )
						}
					/>
					<RangeControl
						label="__experimentalInitialIndex"
						min={ 0 }
						max={ 4 }
						value={ initialIndex }
						onChange={ ( next ) =>
							setAttributes( { initialIndex: next } )
						}
					/>
					<RangeControl
						label="children (button count)"
						min={ 1 }
						max={ 5 }
						value={ buttonCount }
						onChange={ ( next ) =>
							setAttributes( { buttonCount: next } )
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
				<h3>NavigableToolbar</h3>
				<NavigableToolbar key={ initialIndex } { ...toolbarProps }>
					{ ICONS.slice( 0, buttonCount ).map( ( icon, index ) => (
						<ToolbarButton
							key={ index }
							icon={ icon }
							label={ 'Toolbar button ' + ( index + 1 ) }
							onClick={ () =>
								setAttributes( { clicks: clicks + 1 } )
							}
						/>
					) ) }
				</NavigableToolbar>
				<p>
					{ __(
						'Arrow keys move between the buttons (Home and End jump to the ends). Clicks:',
						'component-kitchen-sink'
					) }{ ' ' }
					{ clicks }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
