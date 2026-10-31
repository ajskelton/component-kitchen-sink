import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	ComboboxControl,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

const OPTIONS = [
	{ value: 'small', label: 'Small' },
	{ value: 'normal', label: 'Normal' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'large', label: 'Large' },
	{ value: 'huge', label: 'Huge', disabled: true },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		label,
		help,
		hideLabelFromVision,
		placeholder,
		allowReset,
		expandOnFocus,
		isLoading,
	} = attributes;
	const [ filterValue, setFilterValue ] = useState( '' );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const comboboxProps = {
		label,
		help: help || undefined,
		hideLabelFromVision,
		placeholder: placeholder || undefined,
		allowReset,
		expandOnFocus,
		isLoading,
		options: OPTIONS,
		value: value || null,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		onFilterValueChange: setFilterValue,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ComboboxControl', 'component-kitchen-sink' ) }
				>
					<ComboboxControl { ...comboboxProps } />
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
					<TextControl
						label="placeholder"
						value={ placeholder }
						onChange={ ( next ) =>
							setAttributes( { placeholder: next } )
						}
					/>
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
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
						label="expandOnFocus"
						checked={ expandOnFocus }
						onChange={ ( next ) =>
							setAttributes( { expandOnFocus: next } )
						}
					/>
					<ToggleControl
						label="isLoading"
						checked={ isLoading }
						onChange={ ( next ) =>
							setAttributes( { isLoading: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ComboboxControl</h3>
				<ComboboxControl { ...comboboxProps } />
				<p>
					{ __( 'onFilterValueChange:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ filterValue }</code>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
