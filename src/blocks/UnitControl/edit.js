import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { useState } from '@wordpress/element';
import './editor.scss';

const SIZE_OPTIONS = [ 'default', 'small', 'compact' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

const UNIT_SETS = {
	'px, em, rem, %': [ 'px', 'em', 'rem', '%' ],
	'px only': [ 'px' ],
	'vw, vh': [ 'vw', 'vh' ],
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		label,
		unitSet,
		disableUnits,
		isUnitSelectTabbable,
		isResetValueOnUnitChange,
		min,
		max,
		step,
		size,
		disabled,
	} = attributes;
	const [ lastUnit, setLastUnit ] = useState( '' );
	const units = useCustomUnits( {
		availableUnits: UNIT_SETS[ unitSet ],
	} );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const unitProps = {
		label,
		units,
		disableUnits,
		isUnitSelectTabbable,
		isResetValueOnUnitChange,
		min,
		max,
		step,
		size,
		disabled,
		value,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		onUnitChange: ( next ) => setLastUnit( next ),
	};

	const numberAttribute = ( name ) => ( {
		type: 'number',
		value: attributes[ name ],
		onChange: ( next ) => setAttributes( { [ name ]: Number( next ) } ),
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'UnitControl', 'component-kitchen-sink' ) }
				>
					<UnitControl { ...unitProps } />
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<SelectControl
						label="units"
						value={ unitSet }
						options={ Object.keys( UNIT_SETS ).map( ( key ) => ( {
							label: key,
							value: key,
						} ) ) }
						onChange={ ( next ) =>
							setAttributes( { unitSet: next } )
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
						label="isUnitSelectTabbable"
						checked={ isUnitSelectTabbable }
						onChange={ ( next ) =>
							setAttributes( { isUnitSelectTabbable: next } )
						}
					/>
					<ToggleControl
						label="isResetValueOnUnitChange"
						checked={ isResetValueOnUnitChange }
						onChange={ ( next ) =>
							setAttributes( { isResetValueOnUnitChange: next } )
						}
					/>
					<TextControl label="min" { ...numberAttribute( 'min' ) } />
					<TextControl label="max" { ...numberAttribute( 'max' ) } />
					<TextControl
						label="step"
						{ ...numberAttribute( 'step' ) }
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
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
				<h3>UnitControl</h3>
				<UnitControl { ...unitProps } />
				<p>
					{ __( 'onUnitChange:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ lastUnit }</code>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
