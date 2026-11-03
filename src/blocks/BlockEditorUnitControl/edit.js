import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalUnitControl as UnitControl,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const SIZE_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: 'small', value: 'small' },
	{ label: 'compact', value: 'compact' },
];

const SPIN_OPTIONS = [
	{ label: 'none', value: 'none' },
	{ label: 'custom', value: 'custom' },
	{ label: 'native', value: 'native' },
];

const UNITS_OPTIONS = [
	{ label: 'settings default (spacing.units)', value: 'default' },
	{ label: 'px and em', value: 'px-em' },
	{ label: '% only', value: 'percent' },
];

const UNITS = {
	default: undefined,
	'px-em': [
		{ value: 'px', label: 'px', default: 0 },
		{ value: 'em', label: 'em', default: 0 },
	],
	percent: [ { value: '%', label: '%', default: 0 } ],
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		label,
		unitsPreset,
		size,
		min,
		max,
		step,
		spinControls,
		disableUnits,
		isResetValueOnUnitChange,
		disabled,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		label,
		value,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		units: UNITS[ unitsPreset ],
		size,
		min,
		max,
		step,
		spinControls,
		disableUnits,
		isResetValueOnUnitChange,
		disabled,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'UnitControl', 'component-kitchen-sink' ) }
				>
					<UnitControl { ...controlProps } />
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<SelectControl
						label="units"
						value={ unitsPreset }
						options={ UNITS_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { unitsPreset: next } )
						}
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<SelectControl
						label="spinControls"
						value={ spinControls }
						options={ SPIN_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { spinControls: next } )
						}
					/>
					<RangeControl
						label="min"
						value={ min }
						min={ -100 }
						max={ 100 }
						onChange={ ( next ) =>
							setAttributes( { min: next ?? 0 } )
						}
					/>
					<RangeControl
						label="max"
						value={ max }
						min={ 0 }
						max={ 1000 }
						onChange={ ( next ) =>
							setAttributes( { max: next ?? 100 } )
						}
					/>
					<RangeControl
						label="step"
						value={ step }
						min={ 1 }
						max={ 20 }
						onChange={ ( next ) =>
							setAttributes( { step: next ?? 1 } )
						}
					/>
					<ToggleControl
						label="disableUnits"
						checked={ disableUnits }
						onChange={ ( next ) =>
							setAttributes( { disableUnits: next } )
						}
					/>
					<ToggleControl
						label="isResetValueOnUnitChange"
						checked={ isResetValueOnUnitChange }
						onChange={ ( next ) =>
							setAttributes( { isResetValueOnUnitChange: next } )
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
				<h3>UnitControl (block-editor)</h3>
				<UnitControl { ...controlProps } />
				<div
					style={ {
						width: value || undefined,
						maxWidth: '100%',
						height: 24,
						marginTop: 8,
						background: 'rgba(128,128,128,.4)',
					} }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
