import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalSpacingSizesControl as SpacingSizesControl,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const SIDES_OPTIONS = [
	{ label: 'all sides (default)', value: 'all' },
	{ label: 'horizontal and vertical', value: 'axial' },
	{ label: 'top and bottom', value: 'top-bottom' },
	{ label: 'top only', value: 'top' },
];

const SIDES = {
	all: undefined,
	axial: [ 'horizontal', 'vertical' ],
	'top-bottom': [ 'top', 'bottom' ],
	top: [ 'top' ],
};

// Preset values are stored as `var:preset|spacing|40`; turn them into CSS.
const toCss = ( value ) =>
	typeof value === 'string' && value.startsWith( 'var:preset|' )
		? `var(--wp--preset--${ value.slice( 11 ).replace( '|', '--' ) })`
		: value;

export default function Edit( { attributes, setAttributes } ) {
	const {
		values,
		label,
		sidesPreset,
		showSideInLabel,
		useSelect,
		minimumCustomValue,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		label,
		values,
		onChange: ( next ) => setAttributes( { values: next } ),
		sides: SIDES[ sidesPreset ],
		showSideInLabel,
		useSelect,
		minimumCustomValue,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'SpacingSizesControl',
						'component-kitchen-sink'
					) }
				>
					{ /* The view is initial state, so remount when the sides change. */ }
					<SpacingSizesControl
						key={ sidesPreset }
						{ ...controlProps }
					/>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<SelectControl
						label="sides"
						value={ sidesPreset }
						options={ SIDES_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { sidesPreset: next } )
						}
					/>
					<ToggleControl
						label="showSideInLabel"
						checked={ showSideInLabel }
						onChange={ ( next ) =>
							setAttributes( { showSideInLabel: next } )
						}
					/>
					<ToggleControl
						label="useSelect"
						checked={ useSelect }
						onChange={ ( next ) =>
							setAttributes( { useSelect: next } )
						}
					/>
					<RangeControl
						label="minimumCustomValue"
						value={ minimumCustomValue }
						min={ -50 }
						max={ 50 }
						onChange={ ( next ) =>
							setAttributes( { minimumCustomValue: next ?? 0 } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { values: {} } ) }
					>
						{ __( 'Reset values', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>SpacingSizesControl</h3>
				<div
					style={ {
						border: '1px dashed currentColor',
						paddingTop: toCss( values?.top ),
						paddingRight: toCss( values?.right ),
						paddingBottom: toCss( values?.bottom ),
						paddingLeft: toCss( values?.left ),
					} }
				>
					<div style={ { background: 'rgba(128,128,128,.25)' } }>
						{ __(
							'Content with the chosen padding',
							'component-kitchen-sink'
						) }
					</div>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
