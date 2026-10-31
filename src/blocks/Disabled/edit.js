import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Disabled,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { isDisabled, disabledClassName, sample } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const disabledProps = {
		isDisabled,
		className: disabledClassName || undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Disabled', 'component-kitchen-sink' ) }>
					<ToggleControl
						label="isDisabled"
						checked={ isDisabled }
						onChange={ ( next ) =>
							setAttributes( { isDisabled: next } )
						}
					/>
					<TextControl
						label="className"
						value={ disabledClassName }
						onChange={ ( next ) =>
							setAttributes( { disabledClassName: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Disabled</h3>
				<Disabled { ...disabledProps }>
					<TextControl
						label={ __(
							'Text inside Disabled',
							'component-kitchen-sink'
						) }
						value={ sample }
						onChange={ ( next ) =>
							setAttributes( { sample: next } )
						}
					/>
					<Button variant="primary">
						{ __(
							'Button inside Disabled',
							'component-kitchen-sink'
						) }
					</Button>
				</Disabled>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
