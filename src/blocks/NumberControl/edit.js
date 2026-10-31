import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalNumberControl as NumberControl,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const SIZE_OPTIONS = [ 'default', 'small', 'compact' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

const SPIN_CONTROLS_OPTIONS = [ 'none', 'native', 'custom' ].map(
	( value ) => ( { label: value, value } )
);

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		label,
		min,
		max,
		step,
		shiftStep,
		isShiftStepEnabled,
		spinControls,
		size,
		isDragEnabled,
		disabled,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const numberProps = {
		label,
		min,
		max,
		step,
		shiftStep,
		isShiftStepEnabled,
		spinControls,
		size,
		isDragEnabled,
		disabled,
		value,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
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
					title={ __( 'NumberControl', 'component-kitchen-sink' ) }
				>
					<NumberControl { ...numberProps } />
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl label="min" { ...numberAttribute( 'min' ) } />
					<TextControl label="max" { ...numberAttribute( 'max' ) } />
					<TextControl
						label="step"
						{ ...numberAttribute( 'step' ) }
					/>
					<TextControl
						label="shiftStep"
						{ ...numberAttribute( 'shiftStep' ) }
					/>
					<ToggleControl
						label="isShiftStepEnabled"
						checked={ isShiftStepEnabled }
						onChange={ ( next ) =>
							setAttributes( { isShiftStepEnabled: next } )
						}
					/>
					<SelectControl
						label="spinControls"
						value={ spinControls }
						options={ SPIN_CONTROLS_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { spinControls: next } )
						}
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<ToggleControl
						label="isDragEnabled"
						checked={ isDragEnabled }
						onChange={ ( next ) =>
							setAttributes( { isDragEnabled: next } )
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
				<h3>NumberControl</h3>
				<NumberControl { ...numberProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
