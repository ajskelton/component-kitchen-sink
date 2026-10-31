import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	InspectorControls,
	useBlockProps,
	useSettings,
} from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const PANEL_ID = 'ajs-color-gradient-settings-dropdown';

const FALLBACK_COLORS = [
	{ name: 'Black', slug: 'black', color: '#000000' },
	{ name: 'White', slug: 'white', color: '#ffffff' },
	{ name: 'Red', slug: 'red', color: '#cf2e2e' },
	{ name: 'Blue', slug: 'blue', color: '#0693e3' },
];

const FALLBACK_GRADIENTS = [
	{
		name: 'Sunrise',
		slug: 'sunrise',
		gradient: 'linear-gradient(135deg,#ff9a3c 0%,#ff3c6f 100%)',
	},
	{
		name: 'Ocean',
		slug: 'ocean',
		gradient: 'linear-gradient(135deg,#00c6ff 0%,#0072ff 100%)',
	},
];

// `color.palette` may be a flat array or an object keyed by origin.
const toList = ( setting ) => {
	if ( Array.isArray( setting ) ) {
		return setting;
	}
	if ( setting && typeof setting === 'object' ) {
		return [
			...( setting.custom ?? [] ),
			...( setting.theme ?? [] ),
			...( setting.default ?? [] ),
		];
	}
	return [];
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		textColor,
		backgroundColor,
		backgroundGradient,
		clearable,
		enableAlpha,
		disableCustomColors,
		disableCustomGradients,
	} = attributes;

	const [ rawColors, rawGradients ] = useSettings(
		'color.palette',
		'color.gradients'
	);
	const themeColors = toList( rawColors );
	const themeGradients = toList( rawGradients );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const dropdownProps = {
		panelId: PANEL_ID,
		colors: themeColors.length ? themeColors : FALLBACK_COLORS,
		gradients: themeGradients.length ? themeGradients : FALLBACK_GRADIENTS,
		disableCustomColors,
		disableCustomGradients,
		enableAlpha,
		__experimentalIsRenderedInSidebar: true,
		settings: [
			{
				label: __( 'Text', 'component-kitchen-sink' ),
				colorValue: textColor || undefined,
				onColorChange: ( next ) =>
					setAttributes( { textColor: next ?? '' } ),
				clearable,
			},
			{
				label: __( 'Background', 'component-kitchen-sink' ),
				colorValue: backgroundColor || undefined,
				gradientValue: backgroundGradient || undefined,
				onColorChange: ( next ) =>
					setAttributes( { backgroundColor: next ?? '' } ),
				onGradientChange: ( next ) =>
					setAttributes( { backgroundGradient: next ?? '' } ),
				clearable,
			},
		],
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'ColorGradientSettingsDropdown',
						'component-kitchen-sink'
					) }
				>
					{ /* The dropdown wraps each setting in a ToolsPanelItem, so it needs a ToolsPanel. */ }
					<ToolsPanel
						label={ __( 'Color', 'component-kitchen-sink' ) }
						panelId={ PANEL_ID }
						resetAll={ () =>
							setAttributes( {
								textColor: '',
								backgroundColor: '',
								backgroundGradient: '',
							} )
						}
					>
						<ColorGradientSettingsDropdown { ...dropdownProps } />
					</ToolsPanel>
					<ToggleControl
						label="settings[].clearable"
						checked={ clearable }
						onChange={ ( next ) =>
							setAttributes( { clearable: next } )
						}
					/>
					<ToggleControl
						label="enableAlpha"
						checked={ enableAlpha }
						onChange={ ( next ) =>
							setAttributes( { enableAlpha: next } )
						}
					/>
					<ToggleControl
						label="disableCustomColors"
						checked={ disableCustomColors }
						onChange={ ( next ) =>
							setAttributes( { disableCustomColors: next } )
						}
					/>
					<ToggleControl
						label="disableCustomGradients"
						checked={ disableCustomGradients }
						onChange={ ( next ) =>
							setAttributes( { disableCustomGradients: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ColorGradientSettingsDropdown</h3>
				<div
					style={ {
						padding: 16,
						color: textColor || undefined,
						background:
							backgroundGradient || backgroundColor || undefined,
					} }
				>
					{ __(
						'Sample text styled by the dropdown settings.',
						'component-kitchen-sink'
					) }
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
