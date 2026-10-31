import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const COLORS = [ '#0073aa', '#e8590c', '#2b8a3e', '#862e9c' ];
const WIDTHS = [ 120, 200, 160, 80 ];

const options = ( values ) =>
	values.map( ( value ) => ( { label: value, value } ) );

const ALIGNMENT_OPTIONS = options( [
	'stretch',
	'edge',
	'top',
	'topLeft',
	'topRight',
	'left',
	'center',
	'right',
	'bottom',
	'bottomLeft',
	'bottomRight',
] );
const DIRECTION_OPTIONS = options( [ 'column', 'column-reverse' ] );
const JUSTIFY_OPTIONS = [
	{ label: __( 'Default', 'component-kitchen-sink' ), value: '' },
	...options( [
		'flex-start',
		'center',
		'flex-end',
		'space-between',
		'space-around',
		'space-evenly',
	] ),
];

export default function Edit( { attributes, setAttributes } ) {
	const { alignment, direction, spacing, justify, wrap, expanded } =
		attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	const stackProps = {
		alignment,
		direction,
		spacing,
		justify: justify || undefined,
		wrap,
		expanded,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'VStack', 'component-kitchen-sink' ) }>
					<SelectControl
						label="alignment"
						value={ alignment }
						options={ ALIGNMENT_OPTIONS }
						onChange={ set( 'alignment' ) }
					/>
					<SelectControl
						label="direction"
						value={ direction }
						options={ DIRECTION_OPTIONS }
						onChange={ set( 'direction' ) }
					/>
					<RangeControl
						label="spacing"
						value={ spacing }
						min={ 0 }
						max={ 10 }
						onChange={ ( next ) =>
							setAttributes( { spacing: next ?? 2 } )
						}
					/>
					<SelectControl
						label="justify"
						value={ justify }
						options={ JUSTIFY_OPTIONS }
						onChange={ set( 'justify' ) }
					/>
					<ToggleControl
						label="wrap"
						checked={ wrap }
						onChange={ set( 'wrap' ) }
					/>
					<ToggleControl
						label="expanded"
						checked={ expanded }
						onChange={ set( 'expanded' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>VStack</h3>
				<div
					style={ {
						border: '1px dashed #999',
						height: 260,
						padding: 8,
					} }
				>
					<VStack { ...stackProps }>
						{ COLORS.map( ( color, index ) => (
							<div
								key={ color }
								style={ {
									background: color,
									color: '#fff',
									padding: '4px 12px',
									height: 40,
									width: WIDTHS[ index ],
									boxSizing: 'border-box',
								} }
							>
								{ index + 1 }
							</div>
						) ) }
					</VStack>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
