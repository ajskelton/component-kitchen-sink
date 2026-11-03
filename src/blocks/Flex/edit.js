import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Flex,
	FlexBlock,
	FlexItem,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const COLORS = [ '#0073aa', '#e8590c', '#2b8a3e', '#862e9c', '#c92a2a' ];
const HEIGHTS = [ 32, 64, 48, 80, 40 ];

const options = ( values ) =>
	values.map( ( value ) => ( { label: value, value } ) );

const DIRECTION_OPTIONS = options( [
	'row',
	'row-reverse',
	'column',
	'column-reverse',
] );
const ALIGN_OPTIONS = options( [
	'normal',
	'flex-start',
	'center',
	'flex-end',
	'stretch',
	'baseline',
] );
const JUSTIFY_OPTIONS = options( [
	'flex-start',
	'center',
	'flex-end',
	'space-between',
	'space-around',
	'space-evenly',
] );

// A coloured box so spacing and alignment are visible. Heights differ so that
// `align` has an effect.
function Box( { index, wide, children } ) {
	return (
		<div
			style={ {
				background: COLORS[ index % COLORS.length ],
				color: '#fff',
				padding: '4px 12px',
				height: HEIGHTS[ index % HEIGHTS.length ],
				width: wide ? 140 : undefined,
				boxSizing: 'border-box',
			} }
		>
			{ children }
		</div>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { direction, align, justify, gap, wrap, expanded, itemCount } =
		attributes;

	const flexProps = { direction, align, justify, gap, wrap, expanded };

	const items = Array.from( { length: itemCount }, ( _, index ) => {
		// The second item is a FlexBlock so both child components appear.
		const Child = index === 1 ? FlexBlock : FlexItem;
		return (
			<Child key={ index }>
				<Box index={ index } wide={ wrap }>
					{ index === 1 ? 'FlexBlock' : 'FlexItem' } { index + 1 }
				</Box>
			</Child>
		);
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Flex', 'component-kitchen-sink' ) }>
					<SelectControl
						label="direction"
						value={ direction }
						options={ DIRECTION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { direction: next } )
						}
					/>
					<SelectControl
						label="align"
						value={ align }
						options={ ALIGN_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { align: next } )
						}
					/>
					<SelectControl
						label="justify"
						value={ justify }
						options={ JUSTIFY_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { justify: next } )
						}
					/>
					<RangeControl
						label="gap"
						value={ gap }
						min={ 0 }
						max={ 10 }
						onChange={ ( next ) =>
							setAttributes( { gap: next ?? 2 } )
						}
					/>
					<ToggleControl
						label="wrap"
						help={ __(
							'Items become 140px wide so they can wrap.',
							'component-kitchen-sink'
						) }
						checked={ wrap }
						onChange={ ( next ) => setAttributes( { wrap: next } ) }
					/>
					<ToggleControl
						label="expanded"
						checked={ expanded }
						onChange={ ( next ) =>
							setAttributes( { expanded: next } )
						}
					/>
					<RangeControl
						label={ __(
							'Number of children',
							'component-kitchen-sink'
						) }
						value={ itemCount }
						min={ 2 }
						max={ 8 }
						onChange={ ( next ) =>
							setAttributes( { itemCount: next ?? 4 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Flex</h3>
				<div
					style={ {
						border: '1px dashed #999',
						minHeight: 120,
						padding: 8,
					} }
				>
					<Flex { ...flexProps }>{ items }</Flex>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
