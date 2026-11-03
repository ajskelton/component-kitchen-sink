import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	withColorContext,
} from '@wordpress/block-editor';
import {
	ColorPalette,
	PanelBody,
	SelectControl,
	BaseControl,
} from '@wordpress/components';
import './editor.scss';

const OVERRIDE_COLORS = [
	{ name: 'Override red', slug: 'override-red', color: '#d63638' },
	{ name: 'Override green', slug: 'override-green', color: '#00a32a' },
	{ name: 'Override blue', slug: 'override-blue', color: '#2271b1' },
];

const COLORS_MODE_OPTIONS = [
	{ label: 'inherit (editor palette)', value: 'inherit' },
	{ label: 'override (colors prop)', value: 'override' },
];

const DISABLE_CUSTOM_OPTIONS = [
	{ label: 'inherit (from settings)', value: 'inherit' },
	{ label: 'true', value: 'true' },
	{ label: 'false', value: 'false' },
];

/**
 * A palette picker whose `colors`, `disableCustomColors` and
 * `hasColorsToChoose` props are filled in by withColorContext. The props the
 * caller does pass (colors, disableCustomColors) win over the editor's.
 */
const ContextColorPalette = withColorContext(
	( { colors, disableCustomColors, hasColorsToChoose, value, onChange } ) => (
		<>
			<ColorPalette
				colors={ colors }
				disableCustomColors={ disableCustomColors }
				value={ value }
				onChange={ onChange }
			/>
			<pre>
				{ JSON.stringify(
					{
						'injected props': {
							'colors.length': colors.length,
							'colors[ 0 ]': colors[ 0 ] ?? null,
							disableCustomColors,
							hasColorsToChoose,
						},
					},
					null,
					2
				) }
			</pre>
		</>
	)
);

function Edit( { attributes, setAttributes } ) {
	const { colorsMode, disableCustomColors, color } = attributes;

	// Only pass the props that override the context-derived defaults.
	const overrides = {};
	if ( colorsMode === 'override' ) {
		overrides.colors = OVERRIDE_COLORS;
	}
	if ( disableCustomColors !== 'inherit' ) {
		overrides.disableCustomColors = disableCustomColors === 'true';
	}

	const palette = (
		<ContextColorPalette
			{ ...overrides }
			value={ color }
			onChange={ ( next ) => setAttributes( { color: next ?? '' } ) }
		/>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'withColorContext', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="colors"
						value={ colorsMode }
						options={ COLORS_MODE_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { colorsMode: next } )
						}
					/>
					<SelectControl
						label="disableCustomColors"
						value={ disableCustomColors }
						options={ DISABLE_CUSTOM_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { disableCustomColors: next } )
						}
					/>
					<BaseControl
						id="ajs-with-color-context-palette"
						label="onChange / value"
					>
						{ palette }
					</BaseControl>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>withColorContext</h3>
				<div
					style={ {
						padding: '1em',
						background: color || undefined,
						border: '1px dashed currentColor',
					} }
				>
					{ __( 'Selected color:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ color || '(none)' }</code>
				</div>
				{ palette }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}

export default Edit;
