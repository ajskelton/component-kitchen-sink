import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
	__experimentalElevation as Elevation,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { value, hover, focus, active, isInteractive, borderRadius, offset } =
		attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	// hover, focus and active only apply when passed; 0 means "not passed".
	const elevationProps = {
		value,
		hover: hover || undefined,
		focus: focus || undefined,
		active: active || undefined,
		isInteractive,
		borderRadius,
		offset,
	};

	const numberRange = ( name, max ) => (
		<RangeControl
			label={ name }
			value={ attributes[ name ] }
			min={ 0 }
			max={ max }
			onChange={ ( next ) => setAttributes( { [ name ]: next ?? 0 } ) }
		/>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Elevation', 'component-kitchen-sink' ) }
				>
					<p>
						{ __(
							'Elevation is deprecated in this version of the package, so it logs a deprecation notice.',
							'component-kitchen-sink'
						) }
					</p>
					{ numberRange( 'value', 24 ) }
					{ numberRange( 'hover', 24 ) }
					{ numberRange( 'focus', 24 ) }
					{ numberRange( 'active', 24 ) }
					{ numberRange( 'offset', 24 ) }
					<TextControl
						label="borderRadius"
						value={ borderRadius }
						onChange={ set( 'borderRadius' ) }
					/>
					<ToggleControl
						label="isInteractive"
						help={ __(
							'Hover the card in the canvas to see the shadow change.',
							'component-kitchen-sink'
						) }
						checked={ isInteractive }
						onChange={ set( 'isInteractive' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Elevation</h3>
				{ /* Elevation is absolutely positioned, so its parent must be
				position: relative and have a size. */ }
				<div
					tabIndex={ 0 }
					style={ {
						position: 'relative',
						width: 220,
						height: 100,
						margin: 24,
						background: '#fff',
						borderRadius,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					} }
				>
					{ __( 'Hover or focus me', 'component-kitchen-sink' ) }
					<Elevation { ...elevationProps } />
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
