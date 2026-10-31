import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	BorderControl,
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const COLORS = [
	{ name: 'Black', color: '#000000' },
	{ name: 'Blue', color: '#3858e9' },
	{ name: 'Red', color: '#cc1818' },
	{ name: 'Green', color: '#00a32a' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		border,
		label,
		hideLabelFromVision,
		enableStyle,
		disableCustomColors,
		enableAlpha,
		disableUnits,
		isCompact,
		withSlider,
		shouldSanitizeBorder,
		placeholder,
		width,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		label,
		hideLabelFromVision,
		colors: COLORS,
		enableStyle,
		disableCustomColors,
		enableAlpha,
		disableUnits,
		isCompact,
		withSlider,
		shouldSanitizeBorder,
		placeholder: placeholder || undefined,
		width: width || undefined,
		value: border,
		onChange: ( next ) => setAttributes( { border: next ?? {} } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BorderControl', 'component-kitchen-sink' ) }
				>
					<BorderControl { ...controlProps } />
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
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
						label="enableStyle"
						checked={ enableStyle }
						onChange={ ( next ) =>
							setAttributes( { enableStyle: next } )
						}
					/>
					<ToggleControl
						label="disableCustomColors"
						checked={ disableCustomColors }
						onChange={ ( next ) =>
							setAttributes( { disableCustomColors: next } )
						}
					/>
					<ToggleControl
						label="enableAlpha"
						checked={ enableAlpha }
						onChange={ ( next ) =>
							setAttributes( { enableAlpha: next } )
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
						label="isCompact"
						checked={ isCompact }
						onChange={ ( next ) =>
							setAttributes( { isCompact: next } )
						}
					/>
					<ToggleControl
						label="withSlider"
						checked={ withSlider }
						onChange={ ( next ) =>
							setAttributes( { withSlider: next } )
						}
					/>
					<ToggleControl
						label="shouldSanitizeBorder"
						checked={ shouldSanitizeBorder }
						onChange={ ( next ) =>
							setAttributes( { shouldSanitizeBorder: next } )
						}
					/>
					<TextControl
						label="placeholder"
						value={ placeholder }
						onChange={ ( next ) =>
							setAttributes( { placeholder: next } )
						}
					/>
					<TextControl
						label="width"
						help={ __(
							'CSS width of the control, e.g. 200px. No effect with isCompact.',
							'component-kitchen-sink'
						) }
						value={ width }
						onChange={ ( next ) =>
							setAttributes( { width: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { border: {} } ) }
					>
						{ __( 'Reset border', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BorderControl</h3>
				<BorderControl { ...controlProps } />
				<div
					style={ {
						marginTop: 16,
						padding: 16,
						borderColor: border?.color,
						borderStyle: border?.style,
						borderWidth: border?.width,
					} }
				>
					{ __(
						'Preview of the selected border',
						'component-kitchen-sink'
					) }
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
