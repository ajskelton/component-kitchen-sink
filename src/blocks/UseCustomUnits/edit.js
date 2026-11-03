import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const ALL_UNITS = [ 'px', '%', 'em', 'rem', 'vw', 'vh' ];

export default function Edit( { attributes, setAttributes } ) {
	const { availableUnits, defaultPx, defaultEm, defaultRem, value } =
		attributes;

	// The hook filters the full CSS unit list down to `availableUnits` and
	// overrides each unit's default value with `defaultValues`.
	const units = useCustomUnits( {
		availableUnits,
		defaultValues: {
			px: defaultPx,
			em: defaultEm,
			rem: defaultRem,
		},
	} );

	const toggleUnit = ( unit, enabled ) =>
		setAttributes( {
			availableUnits: ALL_UNITS.filter( ( candidate ) =>
				candidate === unit
					? enabled
					: availableUnits.includes( candidate )
			),
		} );

	const defaultControl = ( label, name ) => (
		<TextControl
			label={ label }
			type="number"
			value={ attributes[ name ] }
			onChange={ ( next ) =>
				setAttributes( { [ name ]: Number( next ) } )
			}
		/>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'useCustomUnits', 'component-kitchen-sink' ) }
				>
					{ ALL_UNITS.map( ( unit ) => (
						<ToggleControl
							key={ unit }
							label={ `availableUnits: ${ unit }` }
							checked={ availableUnits.includes( unit ) }
							onChange={ ( enabled ) =>
								toggleUnit( unit, enabled )
							}
						/>
					) ) }
					{ defaultControl( 'defaultValues.px', 'defaultPx' ) }
					{ defaultControl( 'defaultValues.em', 'defaultEm' ) }
					{ defaultControl( 'defaultValues.rem', 'defaultRem' ) }
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useCustomUnits</h3>
				<UnitControl
					label={ __(
						'UnitControl using the units',
						'component-kitchen-sink'
					) }
					units={ units }
					value={ value }
					onChange={ ( next ) =>
						setAttributes( { value: next ?? '' } )
					}
				/>
				<p>{ __( 'Returned units:', 'component-kitchen-sink' ) }</p>
				<pre>{ JSON.stringify( units, null, 2 ) }</pre>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
