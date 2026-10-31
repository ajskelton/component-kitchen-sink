import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	__experimentalHStack as HStack,
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const COLORS = [ '#0073aa', '#e8590c', '#2b8a3e', '#862e9c' ];
const HEIGHTS = [ 32, 64, 48, 80 ];

const options = ( values ) =>
	values.map( ( value ) => ( { label: value, value } ) );

const ALIGNMENT_OPTIONS = options( [
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
	'stretch',
] );
const DIRECTION_OPTIONS = options( [ 'row', 'row-reverse' ] );
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
	const {
		alignment,
		direction,
		spacing,
		justify,
		wrap,
		expanded,
		includeSpacer,
	} = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	const stackProps = {
		alignment,
		direction,
		spacing,
		justify: justify || undefined,
		wrap,
		expanded,
	};

	const boxes = COLORS.map( ( color, index ) => (
		<div
			key={ color }
			style={ {
				background: color,
				color: '#fff',
				padding: '4px 12px',
				height: HEIGHTS[ index ],
				// Wide enough that `wrap` has something to wrap.
				width: wrap ? 160 : undefined,
				boxSizing: 'border-box',
			} }
		>
			{ index + 1 }
		</div>
	) );

	// HStack turns a Spacer child into a flexible FlexItem that pushes the
	// children on either side apart.
	if ( includeSpacer ) {
		boxes.splice( 2, 0, <Spacer key="spacer" /> );
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'HStack', 'component-kitchen-sink' ) }>
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
						help={ __(
							'Overrides the justify derived from alignment.',
							'component-kitchen-sink'
						) }
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
					<ToggleControl
						label={ __(
							'Spacer child between boxes',
							'component-kitchen-sink'
						) }
						checked={ includeSpacer }
						onChange={ set( 'includeSpacer' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>HStack</h3>
				<div
					style={ {
						border: '1px dashed #999',
						minHeight: 120,
						padding: 8,
					} }
				>
					<HStack { ...stackProps }>{ boxes }</HStack>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
