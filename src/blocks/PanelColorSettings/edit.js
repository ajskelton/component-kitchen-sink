import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	PanelColorSettings,
	useBlockProps,
	useSettings,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
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

export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		showTitle,
		textColor,
		backgroundColor,
		clearable,
		enableAlpha,
		disableCustomColors,
	} = attributes;

	const [ rawColors ] = useSettings( 'color.palette' );
	const themeColors = toList( rawColors );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const panelProps = {
		title,
		showTitle,
		colors: themeColors.length ? themeColors : FALLBACK_COLORS,
		disableCustomColors,
		enableAlpha,
		__experimentalIsRenderedInSidebar: true,
		colorSettings: [
			{
				label: __( 'Text', 'component-kitchen-sink' ),
				value: textColor || undefined,
				onChange: ( next ) =>
					setAttributes( { textColor: next ?? '' } ),
				clearable,
			},
			{
				label: __( 'Background', 'component-kitchen-sink' ),
				value: backgroundColor || undefined,
				onChange: ( next ) =>
					setAttributes( { backgroundColor: next ?? '' } ),
				clearable,
			},
		],
	};

	return (
		<>
			{ /* PanelColorSettings renders its own ToolsPanel, so it sits in the sidebar as is. */ }
			<InspectorControls>
				<PanelColorSettings { ...panelProps } />
			</InspectorControls>
			<InspectorControls>
				<PanelBody
					title={ __(
						'PanelColorSettings (props)',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="title"
						value={ title }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
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
						label="colorSettings[].clearable"
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
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>PanelColorSettings</h3>
				<div
					style={ {
						padding: 16,
						color: textColor || undefined,
						background: backgroundColor || undefined,
					} }
				>
					{ __(
						'Sample text styled by the panel settings.',
						'component-kitchen-sink'
					) }
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
