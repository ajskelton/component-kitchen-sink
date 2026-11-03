import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalInputControl as InputControl,
	__experimentalInputControlPrefixWrapper as InputControlPrefixWrapper,
	__experimentalInputControlSuffixWrapper as InputControlSuffixWrapper,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const LABEL_POSITION_OPTIONS = [ 'top', 'bottom', 'side', 'edge' ].map(
	( value ) => ( { label: value, value } )
);

const SIZE_OPTIONS = [ 'default', 'small', 'compact' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

const TYPE_OPTIONS = [ 'text', 'email', 'password', 'search', 'url' ].map(
	( value ) => ( { label: value, value } )
);

const DRAG_DIRECTION_OPTIONS = [ 'n', 's', 'e', 'w' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		label,
		help,
		placeholder,
		type,
		size,
		labelPosition,
		hideLabelFromVision,
		disabled,
		isPressEnterToChange,
		isDragEnabled,
		dragDirection,
		dragThreshold,
		prefix,
		suffix,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const inputProps = {
		label,
		help: help || undefined,
		placeholder: placeholder || undefined,
		type,
		size,
		labelPosition,
		hideLabelFromVision,
		disabled,
		isPressEnterToChange,
		isDragEnabled,
		dragDirection,
		dragThreshold,
		prefix: prefix ? (
			<InputControlPrefixWrapper>{ prefix }</InputControlPrefixWrapper>
		) : undefined,
		suffix: suffix ? (
			<InputControlSuffixWrapper>{ suffix }</InputControlSuffixWrapper>
		) : undefined,
		value,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'InputControl', 'component-kitchen-sink' ) }
				>
					<InputControl { ...inputProps } />
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
					<SelectControl
						label="type"
						value={ type }
						options={ TYPE_OPTIONS }
						onChange={ ( next ) => setAttributes( { type: next } ) }
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<SelectControl
						label="labelPosition"
						value={ labelPosition }
						options={ LABEL_POSITION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { labelPosition: next } )
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
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
					<ToggleControl
						label="isPressEnterToChange"
						checked={ isPressEnterToChange }
						onChange={ ( next ) =>
							setAttributes( { isPressEnterToChange: next } )
						}
					/>
					<ToggleControl
						label="isDragEnabled"
						checked={ isDragEnabled }
						onChange={ ( next ) =>
							setAttributes( { isDragEnabled: next } )
						}
					/>
					<SelectControl
						label="dragDirection"
						value={ dragDirection }
						options={ DRAG_DIRECTION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { dragDirection: next } )
						}
					/>
					<TextControl
						label="dragThreshold"
						type="number"
						value={ dragThreshold }
						onChange={ ( next ) =>
							setAttributes( {
								dragThreshold: Number( next ) || 0,
							} )
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
				<h3>InputControl</h3>
				<InputControl { ...inputProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
