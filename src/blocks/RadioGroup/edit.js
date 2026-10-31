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

const VALUES = [ 'one', 'two', 'three' ];

export default function Edit( { attributes, setAttributes } ) {
	const { checked, label, disabled } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const groupProps = {
		label,
		disabled,
		checked: checked || undefined,
		onChange: ( next ) =>
			setAttributes( { checked: String( next ?? '' ) } ),
	};

	const renderGroup = () => (
		<RadioGroup { ...groupProps }>
			{ VALUES.map( ( value ) => (
				<Radio key={ value } value={ value }>
					{ value }
				</Radio>
			) ) }
		</RadioGroup>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'RadioGroup', 'component-kitchen-sink' ) }
				>
					{ renderGroup() }
					<TextControl
						label="label"
						help={ __(
							'Used as the aria-label of the group.',
							'component-kitchen-sink'
						) }
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="checked"
						help={ __(
							'One of: one, two, three.',
							'component-kitchen-sink'
						) }
						value={ checked }
						onChange={ ( next ) =>
							setAttributes( { checked: next } )
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
				<h3>RadioGroup</h3>
				{ renderGroup() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
