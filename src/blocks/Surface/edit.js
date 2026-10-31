import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	__experimentalSurface as Surface,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const VARIANT_OPTIONS = [
	'primary',
	'secondary',
	'tertiary',
	'dotted',
	'grid',
].map( ( value ) => ( { label: value, value } ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		variant,
		backgroundSize,
		borderTop,
		borderRight,
		borderBottom,
		borderLeft,
	} = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	const surfaceProps = {
		variant,
		backgroundSize,
		borderTop,
		borderRight,
		borderBottom,
		borderLeft,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Surface', 'component-kitchen-sink' ) }>
					<SelectControl
						label="variant"
						value={ variant }
						options={ VARIANT_OPTIONS }
						onChange={ set( 'variant' ) }
					/>
					<RangeControl
						label="backgroundSize"
						help={ __(
							'Grid size for the dotted and grid variants.',
							'component-kitchen-sink'
						) }
						value={ backgroundSize }
						min={ 4 }
						max={ 48 }
						onChange={ ( next ) =>
							setAttributes( { backgroundSize: next ?? 12 } )
						}
					/>
					<ToggleControl
						label="borderTop"
						checked={ borderTop }
						onChange={ set( 'borderTop' ) }
					/>
					<ToggleControl
						label="borderRight"
						checked={ borderRight }
						onChange={ set( 'borderRight' ) }
					/>
					<ToggleControl
						label="borderBottom"
						checked={ borderBottom }
						onChange={ set( 'borderBottom' ) }
					/>
					<ToggleControl
						label="borderLeft"
						checked={ borderLeft }
						onChange={ set( 'borderLeft' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Surface</h3>
				<Surface
					{ ...surfaceProps }
					style={ { height: 140, padding: 16 } }
				>
					<strong>Surface</strong> ({ variant })
				</Surface>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
