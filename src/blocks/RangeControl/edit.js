import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { check, cog, plus, starFilled } from '@wordpress/icons';
import './editor.scss';

/**
 * Icons offered by the icon selects. The attributes store the key, the
 * component receives the icon element from `@wordpress/icons`.
 */
const ICONS = { plus, cog, check, starFilled };

const ICON_OPTIONS = [
	{ label: __( 'None', 'component-kitchen-sink' ), value: '' },
	...Object.keys( ICONS ).map( ( key ) => ( { label: key, value: key } ) ),
];

const SIZE_OPTIONS = [ 'default', 'compact' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

const SEPARATOR_OPTIONS = [ 'none', 'fullWidth', 'topFullWidth' ].map(
	( value ) => ( { label: value, value } )
);

const MARKS = [
	{ value: 0, label: '0' },
	{ value: 25 },
	{ value: 50, label: '50' },
	{ value: 75 },
	{ value: 100, label: '100' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		label,
		help,
		hideLabelFromVision,
		min,
		max,
		step,
		allowReset,
		initialPosition,
		resetFallbackValue,
		marks,
		withInputField,
		showTooltip,
		isShiftStepEnabled,
		shiftStep,
		size,
		separatorType,
		stepperType,
		disabled,
		color,
		railColor,
		trackColor,
		beforeIcon,
		afterIcon,
		percentTooltip,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const rangeProps = {
		label,
		help: help || undefined,
		hideLabelFromVision,
		min,
		max,
		step,
		allowReset,
		initialPosition,
		resetFallbackValue,
		marks: marks ? MARKS : false,
		withInputField,
		showTooltip,
		isShiftStepEnabled,
		shiftStep,
		size,
		separatorType,
		type: stepperType ? 'stepper' : undefined,
		disabled,
		color: color || undefined,
		railColor: railColor || undefined,
		trackColor: trackColor || undefined,
		beforeIcon: ICONS[ beforeIcon ] ?? undefined,
		afterIcon: ICONS[ afterIcon ] ?? undefined,
		renderTooltipContent: percentTooltip
			? ( current ) => `${ current }%`
			: undefined,
		value,
		onChange: ( next ) => setAttributes( { value: next } ),
	};

	const numberAttribute = ( name ) => ( {
		type: 'number',
		value: attributes[ name ],
		onChange: ( next ) => setAttributes( { [ name ]: Number( next ) } ),
	} );

	const toggle = ( name ) => (
		<ToggleControl
			label={ name }
			checked={ attributes[ name ] }
			onChange={ ( next ) => setAttributes( { [ name ]: next } ) }
		/>
	);

	const text = ( name ) => (
		<TextControl
			label={ name }
			value={ attributes[ name ] }
			onChange={ ( next ) => setAttributes( { [ name ]: next } ) }
		/>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'RangeControl', 'component-kitchen-sink' ) }
				>
					<RangeControl { ...rangeProps } />
					{ text( 'label' ) }
					{ text( 'help' ) }
					{ toggle( 'hideLabelFromVision' ) }
					<TextControl label="min" { ...numberAttribute( 'min' ) } />
					<TextControl label="max" { ...numberAttribute( 'max' ) } />
					<TextControl
						label="step"
						{ ...numberAttribute( 'step' ) }
					/>
					{ toggle( 'allowReset' ) }
					<TextControl
						label="initialPosition"
						{ ...numberAttribute( 'initialPosition' ) }
					/>
					<TextControl
						label="resetFallbackValue"
						{ ...numberAttribute( 'resetFallbackValue' ) }
					/>
					{ toggle( 'marks' ) }
					{ toggle( 'withInputField' ) }
					{ toggle( 'showTooltip' ) }
					{ toggle( 'percentTooltip' ) }
					{ toggle( 'isShiftStepEnabled' ) }
					<TextControl
						label="shiftStep"
						{ ...numberAttribute( 'shiftStep' ) }
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<SelectControl
						label="separatorType"
						value={ separatorType }
						options={ SEPARATOR_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { separatorType: next } )
						}
					/>
					{ toggle( 'stepperType' ) }
					{ toggle( 'disabled' ) }
					{ text( 'color' ) }
					{ text( 'railColor' ) }
					{ text( 'trackColor' ) }
					<SelectControl
						label="beforeIcon"
						value={ beforeIcon }
						options={ ICON_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { beforeIcon: next } )
						}
					/>
					<SelectControl
						label="afterIcon"
						value={ afterIcon }
						options={ ICON_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { afterIcon: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>RangeControl</h3>
				<RangeControl { ...rangeProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
