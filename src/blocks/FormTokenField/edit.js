import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	FormTokenField,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const SUGGESTIONS = [
	'Apple',
	'Apricot',
	'Banana',
	'Blueberry',
	'Cherry',
	'Grape',
	'Lemon',
	'Mango',
	'Orange',
	'Peach',
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		tokens,
		label,
		help,
		placeholder,
		maxSuggestions,
		maxLength,
		disabled,
		isBorderless,
		tokenizeOnSpace,
		tokenizeOnBlur,
		expandOnFocus,
		showHowTo,
		autoSelectFirstMatch,
		onlySuggestions,
		uppercaseDisplay,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const fieldProps = {
		label,
		// `__experimentalShowHowTo` is deprecated since 7.1: an empty `help`
		// hides the default how-to text instead.
		help: help || ( showHowTo ? undefined : '' ),
		placeholder: placeholder || undefined,
		suggestions: SUGGESTIONS,
		maxSuggestions,
		maxLength: maxLength > 0 ? maxLength : undefined,
		disabled,
		isBorderless,
		tokenizeOnSpace,
		tokenizeOnBlur,
		__experimentalExpandOnFocus: expandOnFocus,
		__experimentalAutoSelectFirstMatch: autoSelectFirstMatch,
		__experimentalValidateInput: onlySuggestions
			? ( token ) =>
					SUGGESTIONS.some(
						( suggestion ) =>
							suggestion.toLowerCase() === token.toLowerCase()
					)
			: undefined,
		displayTransform: uppercaseDisplay
			? ( token ) => token.toUpperCase()
			: undefined,
		value: tokens,
		onChange: ( next ) =>
			setAttributes( {
				tokens: next.map( ( token ) =>
					typeof token === 'string' ? token : token.value
				),
			} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'FormTokenField', 'component-kitchen-sink' ) }
				>
					<FormTokenField { ...fieldProps } />
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
					<TextControl
						label="maxSuggestions"
						type="number"
						value={ maxSuggestions }
						onChange={ ( next ) =>
							setAttributes( {
								maxSuggestions: Number( next ) || 1,
							} )
						}
					/>
					<TextControl
						label="maxLength"
						help={ __(
							'Maximum number of tokens. 0 means no limit.',
							'component-kitchen-sink'
						) }
						type="number"
						value={ maxLength }
						onChange={ ( next ) =>
							setAttributes( { maxLength: Number( next ) || 0 } )
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
						label="isBorderless"
						checked={ isBorderless }
						onChange={ ( next ) =>
							setAttributes( { isBorderless: next } )
						}
					/>
					<ToggleControl
						label="tokenizeOnSpace"
						checked={ tokenizeOnSpace }
						onChange={ ( next ) =>
							setAttributes( { tokenizeOnSpace: next } )
						}
					/>
					<ToggleControl
						label="tokenizeOnBlur"
						checked={ tokenizeOnBlur }
						onChange={ ( next ) =>
							setAttributes( { tokenizeOnBlur: next } )
						}
					/>
					<ToggleControl
						label="__experimentalExpandOnFocus"
						checked={ expandOnFocus }
						onChange={ ( next ) =>
							setAttributes( { expandOnFocus: next } )
						}
					/>
					<ToggleControl
						label="show default help (was __experimentalShowHowTo)"
						checked={ showHowTo }
						onChange={ ( next ) =>
							setAttributes( { showHowTo: next } )
						}
					/>
					<ToggleControl
						label="__experimentalAutoSelectFirstMatch"
						checked={ autoSelectFirstMatch }
						onChange={ ( next ) =>
							setAttributes( { autoSelectFirstMatch: next } )
						}
					/>
					<ToggleControl
						label="__experimentalValidateInput"
						help={ __(
							'Only accept tokens that are in the suggestions.',
							'component-kitchen-sink'
						) }
						checked={ onlySuggestions }
						onChange={ ( next ) =>
							setAttributes( { onlySuggestions: next } )
						}
					/>
					<ToggleControl
						label="displayTransform"
						help={ __(
							'Displays tokens in upper case.',
							'component-kitchen-sink'
						) }
						checked={ uppercaseDisplay }
						onChange={ ( next ) =>
							setAttributes( { uppercaseDisplay: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>FormTokenField</h3>
				<FormTokenField { ...fieldProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
