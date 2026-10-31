import { __ } from '@wordpress/i18n';
import {
	ColorPaletteControl,
	ContrastChecker,
	InspectorControls,
	useBlockProps,
	useSettings,
} from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const FALLBACK_COLORS = [
	{ name: 'Black', slug: 'black', color: '#000000' },
	{ name: 'White', slug: 'white', color: '#ffffff' },
	{ name: 'Light gray', slug: 'light-gray', color: '#eeeeee' },
	{ name: 'Yellow', slug: 'yellow', color: '#fcb900' },
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
		fontSize,
		isLargeText,
		enableAlphaChecker,
		messageOverride,
	} = attributes;

	const [ rawColors ] = useSettings( 'color.palette' );
	const themeColors = toList( rawColors );
	const colors = themeColors.length ? themeColors : FALLBACK_COLORS;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const checkerProps = {
		textColor,
		backgroundColor,
		fontSize,
		isLargeText,
		enableAlphaChecker,
		messageOverride: messageOverride || undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ContrastChecker', 'component-kitchen-sink' ) }
				>
					<BaseControl
						id="ajs-contrast-checker-preview"
						label={ __( 'Preview', 'component-kitchen-sink' ) }
						help={ __(
							'Shows a notice only when the contrast is too low.',
							'component-kitchen-sink'
						) }
					>
						<div>
							<ContrastChecker { ...checkerProps } />
						</div>
					</BaseControl>
					<ColorPaletteControl
						label="textColor"
						colors={ colors }
						value={ textColor }
						onChange={ ( next ) =>
							setAttributes( { textColor: next ?? '' } )
						}
						__experimentalIsRenderedInSidebar
					/>
					<ColorPaletteControl
						label="backgroundColor"
						colors={ colors }
						value={ backgroundColor }
						onChange={ ( next ) =>
							setAttributes( { backgroundColor: next ?? '' } )
						}
						__experimentalIsRenderedInSidebar
					/>
					<RangeControl
						label="fontSize"
						value={ fontSize }
						min={ 8 }
						max={ 64 }
						onChange={ ( next ) =>
							setAttributes( { fontSize: next ?? 16 } )
						}
					/>
					<ToggleControl
						label="isLargeText"
						checked={ isLargeText }
						onChange={ ( next ) =>
							setAttributes( { isLargeText: next } )
						}
					/>
					<ToggleControl
						label="enableAlphaChecker"
						checked={ enableAlphaChecker }
						onChange={ ( next ) =>
							setAttributes( { enableAlphaChecker: next } )
						}
					/>
					<TextControl
						label="messageOverride"
						value={ messageOverride }
						onChange={ ( next ) =>
							setAttributes( { messageOverride: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ContrastChecker</h3>
				<div
					style={ {
						padding: 16,
						color: textColor,
						background: backgroundColor,
						fontSize,
					} }
				>
					{ __(
						'Sample text on a sample background.',
						'component-kitchen-sink'
					) }
				</div>
				<ContrastChecker { ...checkerProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
