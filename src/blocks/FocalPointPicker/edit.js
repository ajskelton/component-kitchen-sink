import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	FocalPointPicker,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

/**
 * Static placeholder image (an inline SVG data URL, so no network is needed).
 */
const PLACEHOLDER_URL =
	'data:image/svg+xml;utf8,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">' +
			'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
			'<stop offset="0" stop-color="#3858e9"/><stop offset="1" stop-color="#e9b238"/>' +
			'</linearGradient></defs>' +
			'<rect width="600" height="400" fill="url(#g)"/>' +
			'<circle cx="420" cy="140" r="60" fill="#fff" fill-opacity="0.8"/>' +
			'<rect x="60" y="260" width="200" height="80" fill="#1e1e1e" fill-opacity="0.6"/>' +
			'</svg>'
	);

export default function Edit( { attributes, setAttributes } ) {
	const { x, y, label, help, hideLabelFromVision, snapToHalves } = attributes;
	const [ dragState, setDragState ] = useState( 'idle' );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const pickerProps = {
		url: PLACEHOLDER_URL,
		value: { x, y },
		label,
		help: help || undefined,
		hideLabelFromVision,
		resolvePoint: snapToHalves
			? ( point ) => ( {
					x: Math.round( point.x * 2 ) / 2,
					y: Math.round( point.y * 2 ) / 2,
				} )
			: undefined,
		onChange: ( next ) => setAttributes( { x: next.x, y: next.y } ),
		onDragStart: () => setDragState( 'dragging' ),
		onDragEnd: () => setDragState( 'idle' ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'FocalPointPicker', 'component-kitchen-sink' ) }
				>
					<FocalPointPicker { ...pickerProps } />
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
						label="resolvePoint"
						help={ __(
							'Snaps the point to the nearest half.',
							'component-kitchen-sink'
						) }
						checked={ snapToHalves }
						onChange={ ( next ) =>
							setAttributes( { snapToHalves: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { x: 0.5, y: 0.5 } ) }
					>
						{ __( 'Center', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>FocalPointPicker</h3>
				<FocalPointPicker { ...pickerProps } />
				<p>
					{ __( 'Drag state:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ dragState }</code>
				</p>
				<img
					src={ PLACEHOLDER_URL }
					alt=""
					style={ {
						width: 120,
						height: 120,
						objectFit: 'cover',
						objectPosition: `${ x * 100 }% ${ y * 100 }%`,
					} }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
