import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	TextControl,
	ToggleControl,
	useBaseControlProps,
} from '@wordpress/components';
import './editor.scss';

/**
 * A custom textarea control built the documented way: the hook returns the
 * props for BaseControl and for the inner control, including a unique id and
 * the aria-describedby link to the help text.
 *
 * @param {Object}                  props          Component props.
 * @param {string}                  props.value    Textarea value.
 * @param {(value: string) => void} props.onChange Called with the next textarea value.
 */
function CustomTextarea( { value, onChange, ...baseProps } ) {
	const { baseControlProps, controlProps } = useBaseControlProps( baseProps );

	return (
		<>
			<BaseControl { ...baseControlProps }>
				<textarea
					{ ...controlProps }
					value={ value }
					rows={ 3 }
					onChange={ ( event ) => onChange( event.target.value ) }
				/>
			</BaseControl>
			<pre>
				{ JSON.stringify(
					{ baseControlProps, controlProps },
					null,
					2
				) }
			</pre>
		</>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { label, help, preferredId, hideLabelFromVision, value } = attributes;

	// Props handed to useBaseControlProps (everything but children).
	const baseProps = {
		label,
		help: help || undefined,
		id: preferredId || undefined,
		hideLabelFromVision,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'useBaseControlProps',
						'component-kitchen-sink'
					) }
				>
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
						label="id"
						help={ __(
							'A preferred id; the hook still makes it unique per instance.',
							'component-kitchen-sink'
						) }
						value={ preferredId }
						onChange={ ( next ) =>
							setAttributes( { preferredId: next } )
						}
					/>
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useBaseControlProps</h3>
				<CustomTextarea
					{ ...baseProps }
					value={ value }
					onChange={ ( next ) => setAttributes( { value: next } ) }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
