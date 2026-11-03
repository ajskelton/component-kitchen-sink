import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalRadio as Radio,
	__experimentalRadioGroup as RadioGroup,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { checked, value, text, disabled } = attributes;

	// Radio only works inside a RadioGroup, which provides its store through
	// context. The group here is a minimal parent; the controls below drive the
	// middle Radio, which is the one under test.
	const renderGroup = () => (
		<RadioGroup
			label={ __( 'Radio demo group', 'component-kitchen-sink' ) }
			checked={ checked || undefined }
			onChange={ ( next ) =>
				setAttributes( { checked: String( next ?? '' ) } )
			}
		>
			<Radio value="first">first</Radio>
			<Radio value={ value || 'second' } disabled={ disabled }>
				{ text || undefined }
			</Radio>
			<Radio value="third">third</Radio>
		</RadioGroup>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Radio', 'component-kitchen-sink' ) }>
					{ renderGroup() }
					<TextControl
						label="value"
						value={ value }
						onChange={ ( next ) =>
							setAttributes( { value: next } )
						}
					/>
					<TextControl
						label="children"
						help={ __(
							'Falls back to value when empty.',
							'component-kitchen-sink'
						) }
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<ToggleControl
						label="disabled"
						help={ __(
							'Passed through to the underlying Button.',
							'component-kitchen-sink'
						) }
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Radio</h3>
				{ renderGroup() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
