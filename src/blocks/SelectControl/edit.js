import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const OPTIONS = [
	{ label: 'Select one…', value: '', disabled: true },
	{ label: 'Small', value: 'small' },
	{ label: 'Medium', value: 'medium' },
	{ label: 'Large', value: 'large' },
	{ label: 'Huge (disabled)', value: 'huge', disabled: true },
];

const SIZE_OPTIONS = [ 'default', 'small', 'compact' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

const VARIANT_OPTIONS = [ 'default', 'minimal' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

const LABEL_POSITION_OPTIONS = [ 'top', 'bottom', 'side', 'edge' ].map(
	( value ) => ( { label: value, value } )
);

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		values,
		label,
		help,
		hideLabelFromVision,
		disabled,
		multiple,
		size,
		variant,
		labelPosition,
		prefix,
		suffix,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const selectProps = {
		label,
		help: help || undefined,
		hideLabelFromVision,
		disabled,
		size,
		variant,
		labelPosition,
		prefix: prefix || undefined,
		suffix: suffix || undefined,
		options: OPTIONS,
		...( multiple
			? {
					multiple: true,
					value: values,
					onChange: ( next ) => setAttributes( { values: next } ),
				}
			: {
					value,
					onChange: ( next ) => setAttributes( { value: next } ),
				} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'SelectControl', 'component-kitchen-sink' ) }
				>
					<SelectControl { ...selectProps } />
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="help"
						value={ help }
						onChange={ ( next ) => setAttributes( { help: next } ) }
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
					<ToggleControl
						label="multiple"
						checked={ multiple }
						onChange={ ( next ) =>
							setAttributes( { multiple: next } )
						}
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<SelectControl
						label="variant"
						value={ variant }
						options={ VARIANT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { variant: next } )
						}
					/>
					<SelectControl
						label="labelPosition"
						value={ labelPosition }
						options={ LABEL_POSITION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { labelPosition: next } )
						}
					/>
					<TextControl
						label="prefix"
						value={ prefix }
						onChange={ ( next ) =>
							setAttributes( { prefix: next } )
						}
					/>
					<TextControl
						label="suffix"
						value={ suffix }
						onChange={ ( next ) =>
							setAttributes( { suffix: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>SelectControl</h3>
				<SelectControl { ...selectProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
