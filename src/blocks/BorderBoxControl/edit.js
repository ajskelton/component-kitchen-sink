import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	BorderBoxControl,
	Button,
	PanelBody,
	SelectControl,
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

const PLACEMENT_OPTIONS = [
	'left-start',
	'left',
	'left-end',
	'right-start',
	'right',
	'right-end',
	'bottom-start',
	'bottom',
	'top-start',
].map( ( value ) => ( { label: value, value } ) );

const SIDES = [ 'top', 'right', 'bottom', 'left' ];

/**
 * Converts a flat or split border value to inline CSS for the preview box.
 *
 * @param {Object} border Flat `{ color, style, width }` or split `{ top, … }` value.
 * @return {Object} Inline style object.
 */
function borderToStyle( border ) {
	const style = {};
	if ( ! border ) {
		return style;
	}
	if ( SIDES.some( ( side ) => side in border ) ) {
		for ( const side of SIDES ) {
			const part = border[ side ];
			const name = side.charAt( 0 ).toUpperCase() + side.slice( 1 );
			style[ `border${ name }Color` ] = part?.color;
			style[ `border${ name }Style` ] = part?.style;
			style[ `border${ name }Width` ] = part?.width;
		}
		return style;
	}
	style.borderColor = border.color;
	style.borderStyle = border.style;
	style.borderWidth = border.width;
	return style;
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		border,
		label,
		hideLabelFromVision,
		enableStyle,
		disableCustomColors,
		enableAlpha,
		popoverPlacement,
		popoverOffset,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		label,
		hideLabelFromVision,
		colors: COLORS,
		enableStyle,
		disableCustomColors,
		enableAlpha,
		popoverPlacement,
		popoverOffset,
		value: border,
		onChange: ( next ) => setAttributes( { border: next ?? {} } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BorderBoxControl', 'component-kitchen-sink' ) }
				>
					<BorderBoxControl { ...controlProps } />
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
					<SelectControl
						label="popoverPlacement"
						value={ popoverPlacement }
						options={ PLACEMENT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { popoverPlacement: next } )
						}
					/>
					<TextControl
						label="popoverOffset"
						type="number"
						value={ popoverOffset }
						onChange={ ( next ) =>
							setAttributes( {
								popoverOffset: Number( next ) || 0,
							} )
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
				<h3>BorderBoxControl</h3>
				<BorderBoxControl { ...controlProps } />
				<div
					style={ {
						marginTop: 16,
						padding: 16,
						...borderToStyle( border ),
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
