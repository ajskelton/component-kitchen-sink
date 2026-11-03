import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	BoxControl,
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

/** Which sides the control offers, keyed by the `sides` attribute value. */
const SIDES = {
	all: undefined,
	horizontal: [ 'horizontal' ],
	vertical: [ 'vertical' ],
	'top-bottom': [ 'top', 'bottom' ],
	'left-right': [ 'left', 'right' ],
	top: [ 'top' ],
};

const SIDES_OPTIONS = Object.keys( SIDES ).map( ( key ) => ( {
	label: key,
	value: key,
} ) );

const PRESETS = [
	{ name: 'Small', slug: 'small', value: '8px' },
	{ name: 'Medium', slug: 'medium', value: '16px' },
	{ name: 'Large', slug: 'large', value: '32px' },
];

const UNITS = [
	{ value: 'px', label: 'px', default: 0 },
	{ value: 'em', label: 'em', default: 0 },
	{ value: '%', label: '%', default: 0 },
];

const UNIT_SETS = {
	default: undefined,
	'px, em, %': UNITS,
	'px only': [ UNITS[ 0 ] ],
};

/**
 * Resolves a preset token such as `var:preset|spacing|small` to a CSS value so
 * the canvas preview matches what BoxControl shows.
 *
 * @param {string|undefined} value Stored side value.
 * @return {string|undefined} CSS value.
 */
function resolvePreset( value ) {
	const match = /^var:preset\|spacing\|(.+)$/.exec( value ?? '' );
	if ( ! match ) {
		return value;
	}
	return PRESETS.find( ( preset ) => preset.slug === match[ 1 ] )?.value;
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		values,
		label,
		allowReset,
		splitOnAxis,
		sides,
		units,
		usePresets,
		inputPropsMin,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		label,
		allowReset,
		splitOnAxis,
		sides: SIDES[ sides ],
		units: UNIT_SETS[ units ],
		inputProps: { min: inputPropsMin },
		values,
		onChange: ( next ) => setAttributes( { values: next } ),
		...( usePresets ? { presets: PRESETS, presetKey: 'spacing' } : {} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BoxControl', 'component-kitchen-sink' ) }
				>
					<BoxControl
						key={ `${ sides }-${ units }-${ usePresets }` }
						{ ...controlProps }
					/>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<ToggleControl
						label="allowReset"
						checked={ allowReset }
						onChange={ ( next ) =>
							setAttributes( { allowReset: next } )
						}
					/>
					<ToggleControl
						label="splitOnAxis"
						checked={ splitOnAxis }
						onChange={ ( next ) =>
							setAttributes( { splitOnAxis: next } )
						}
					/>
					<SelectControl
						label="sides"
						value={ sides }
						options={ SIDES_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { sides: next } )
						}
					/>
					<SelectControl
						label="units"
						value={ units }
						options={ Object.keys( UNIT_SETS ).map( ( key ) => ( {
							label: key,
							value: key,
						} ) ) }
						onChange={ ( next ) =>
							setAttributes( { units: next } )
						}
					/>
					<ToggleControl
						label="presets / presetKey"
						checked={ usePresets }
						onChange={ ( next ) =>
							setAttributes( { usePresets: next } )
						}
					/>
					<TextControl
						label="inputProps.min"
						type="number"
						value={ inputPropsMin }
						onChange={ ( next ) =>
							setAttributes( {
								inputPropsMin: Number( next ) || 0,
							} )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { values: {} } ) }
					>
						{ __( 'Clear values', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BoxControl</h3>
				<BoxControl
					key={ `${ sides }-${ units }-${ usePresets }-canvas` }
					{ ...controlProps }
				/>
				<div
					style={ {
						marginTop: 16,
						background: '#f0f0f0',
						paddingTop: resolvePreset( values.top ),
						paddingRight: resolvePreset( values.right ),
						paddingBottom: resolvePreset( values.bottom ),
						paddingLeft: resolvePreset( values.left ),
					} }
				>
					<div style={ { background: '#fff', padding: 4 } }>
						{ __( 'Padding preview', 'component-kitchen-sink' ) }
					</div>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
