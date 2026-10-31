import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalColorGradientControl as ColorGradientControl,
	InspectorControls,
	useBlockProps,
	useSettings,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

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

const HEADING_LEVEL_OPTIONS = [ '1', '2', '3', '4', '5', '6' ].map(
	( level ) => ( { label: level, value: level } )
);

export default function Edit( { attributes, setAttributes } ) {
	const {
		label,
		colorValue,
		gradientValue,
		showTitle,
		clearable,
		enableAlpha,
		disableCustomColors,
		disableCustomGradients,
		headingLevel,
	} = attributes;

	const [ rawColors, rawGradients ] = useSettings(
		'color.palette',
		'color.gradients'
	);
	const themeColors = toList( rawColors );
	const themeGradients = toList( rawGradients );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		label,
		colors: themeColors.length ? themeColors : FALLBACK_COLORS,
		gradients: themeGradients.length ? themeGradients : FALLBACK_GRADIENTS,
		colorValue: colorValue || undefined,
		gradientValue: gradientValue || undefined,
		onColorChange: ( next ) => setAttributes( { colorValue: next ?? '' } ),
		onGradientChange: ( next ) =>
			setAttributes( { gradientValue: next ?? '' } ),
		showTitle,
		clearable,
		enableAlpha,
		disableCustomColors,
		disableCustomGradients,
		headingLevel: Number( headingLevel ),
		__experimentalIsRenderedInSidebar: true,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'ColorGradientControl',
						'component-kitchen-sink'
					) }
				>
					<ColorGradientControl { ...controlProps } />
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<ToggleControl
						label="showTitle"
						checked={ showTitle }
						onChange={ ( next ) =>
							setAttributes( { showTitle: next } )
						}
					/>
					<ToggleControl
						label="clearable"
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
					<SelectControl
						label="headingLevel"
						value={ headingLevel }
						options={ HEADING_LEVEL_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { headingLevel: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ColorGradientControl</h3>
				<div
					style={ {
						height: 60,
						border: '1px solid currentColor',
						background: gradientValue || colorValue || undefined,
					} }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
