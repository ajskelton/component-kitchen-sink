import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalDuotoneControl as DuotoneControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
	useSettings,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	BaseControl,
	Button,
	PanelBody,
	ToggleControl,
	ToolbarGroup,
} from '@wordpress/components';
import './editor.scss';

const FALLBACK_COLORS = [
	{ name: 'Black', slug: 'black', color: '#000000' },
	{ name: 'White', slug: 'white', color: '#ffffff' },
	{ name: 'Red', slug: 'red', color: '#cf2e2e' },
	{ name: 'Blue', slug: 'blue', color: '#0693e3' },
];

const FALLBACK_DUOTONE = [
	{
		name: 'Dark grayscale',
		slug: 'dark-grayscale',
		colors: [ '#000000', '#7f7f7f' ],
	},
	{
		name: 'Purple and yellow',
		slug: 'purple-yellow',
		colors: [ '#8c00b7', '#fcff41' ],
	},
	{
		name: 'Blue and red',
		slug: 'blue-red',
		colors: [ '#000097', '#ff4747' ],
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
	const { value, disableCustomColors, disableCustomDuotone } = attributes;

	const [ rawColors, rawDuotone ] = useSettings(
		'color.palette',
		'color.duotone'
	);
	const themeColors = toList( rawColors );
	const themeDuotone = toList( rawDuotone );

	// Every prop exercised by this block, shared by toolbar and inspector.
	const controlProps = {
		colorPalette: themeColors.length ? themeColors : FALLBACK_COLORS,
		duotonePalette: themeDuotone.length ? themeDuotone : FALLBACK_DUOTONE,
		disableCustomColors,
		disableCustomDuotone,
		value: value || undefined,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
	};

	const swatch = Array.isArray( value ) ? value : [];

	return (
		<>
			<BlockControls group="block">
				<ToolbarGroup>
					<DuotoneControl { ...controlProps } />
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'DuotoneControl', 'component-kitchen-sink' ) }
				>
					<BaseControl
						id="ajs-duotone-control-mirror"
						label={ __(
							'Mirror of the toolbar control',
							'component-kitchen-sink'
						) }
					>
						<div>
							<DuotoneControl { ...controlProps } />
						</div>
					</BaseControl>
					<ToggleControl
						label="disableCustomColors"
						checked={ disableCustomColors }
						onChange={ ( next ) =>
							setAttributes( { disableCustomColors: next } )
						}
					/>
					<ToggleControl
						label="disableCustomDuotone"
						checked={ disableCustomDuotone }
						onChange={ ( next ) =>
							setAttributes( { disableCustomDuotone: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { value: '' } ) }
					>
						{ __( 'Clear value', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>DuotoneControl</h3>
				{ /* The control lives in the block toolbar; the strip shows the chosen colors. */ }
				<div
					style={ {
						height: 40,
						border: '1px solid currentColor',
						background:
							swatch.length > 1
								? `linear-gradient(90deg, ${ swatch.join(
										', '
									) })`
								: undefined,
					} }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
