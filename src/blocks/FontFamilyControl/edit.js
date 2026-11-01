import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalFontFamilyControl as FontFamilyControl,
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

// FontFamilyControl renders nothing without font families, so keep a fallback.
const FALLBACK_FONT_FAMILIES = [
	{
		name: 'System sans-serif',
		slug: 'system-sans',
		fontFamily: 'system-ui, sans-serif',
	},
	{ name: 'Serif', slug: 'serif', fontFamily: 'Georgia, serif' },
	{
		name: 'Monospace',
		slug: 'mono',
		fontFamily: 'Menlo, Consolas, monospace',
	},
];

const CUSTOM_OPTIONS = [
	{
		key: 'Georgia, serif',
		name: 'Custom option: Georgia',
		style: { fontFamily: 'Georgia, serif' },
		hint: 'serif',
	},
	{
		key: 'Courier New, monospace',
		name: 'Custom option: Courier',
		style: { fontFamily: 'Courier New, monospace' },
		hint: 'mono',
	},
];

const SIZE_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: 'small', value: 'small' },
];

// The setting may be a flat array or an object keyed by origin.
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
		value,
		label,
		size,
		showSelectedHint,
		useCustomOptions,
		hideLabelFromVision,
		disabled,
	} = attributes;

	const [ rawFamilies ] = useSettings( 'typography.fontFamilies' );
	const themeFamilies = toList( rawFamilies );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		value,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		fontFamilies: themeFamilies.length
			? themeFamilies
			: FALLBACK_FONT_FAMILIES,
		label,
		size,
		showSelectedHint,
		hideLabelFromVision,
		disabled,
		// FontFamilyControl spreads unknown props over its computed options
		// list, so an `options: undefined` key would blank the list and crash
		// the underlying CustomSelectControl. Only pass the key when set.
		...( useCustomOptions ? { options: CUSTOM_OPTIONS } : {} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'FontFamilyControl',
						'component-kitchen-sink'
					) }
				>
					<FontFamilyControl { ...controlProps } />
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<ToggleControl
						label="showSelectedHint"
						checked={ showSelectedHint }
						onChange={ ( next ) =>
							setAttributes( { showSelectedHint: next } )
						}
					/>
					<ToggleControl
						label="options (custom options with hints)"
						checked={ useCustomOptions }
						onChange={ ( next ) =>
							setAttributes( { useCustomOptions: next } )
						}
					/>
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
						}
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>FontFamilyControl</h3>
				<p style={ { fontFamily: value || undefined } }>
					{ __(
						'The quick brown fox jumps over the lazy dog.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
