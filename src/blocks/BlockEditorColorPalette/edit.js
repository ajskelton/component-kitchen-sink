import { __ } from '@wordpress/i18n';
import {
	ColorPalette,
	InspectorControls,
	useBlockProps,
	useSettings,
} from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const FALLBACK_COLORS = [
	{ name: 'Black', slug: 'black', color: '#000000' },
	{ name: 'White', slug: 'white', color: '#ffffff' },
	{ name: 'Red', slug: 'red', color: '#cf2e2e' },
	{ name: 'Blue', slug: 'blue', color: '#0693e3' },
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
		value,
		clearable,
		enableAlpha,
		disableCustomColors,
		asButtons,
		headingLevel,
	} = attributes;

	const [ rawColors ] = useSettings( 'color.palette' );
	const themeColors = toList( rawColors );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const paletteProps = {
		colors: themeColors.length ? themeColors : FALLBACK_COLORS,
		value: value || undefined,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		clearable,
		enableAlpha,
		disableCustomColors,
		asButtons,
		headingLevel: Number( headingLevel ),
		__experimentalIsRenderedInSidebar: true,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ColorPalette', 'component-kitchen-sink' ) }
				>
					<BaseControl
						id="ajs-block-editor-color-palette"
						label={ __( 'Preview', 'component-kitchen-sink' ) }
					>
						<ColorPalette { ...paletteProps } />
					</BaseControl>
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
						label="asButtons"
						checked={ asButtons }
						onChange={ ( next ) =>
							setAttributes( { asButtons: next } )
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
				<h3>ColorPalette (block-editor)</h3>
				<ColorPalette { ...paletteProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
