import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalGrid as Grid,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const COLORS = [
	'#0073aa',
	'#e8590c',
	'#2b8a3e',
	'#862e9c',
	'#c92a2a',
	'#495057',
	'#1c7ed6',
	'#f08c00',
];
const HEIGHTS = [ 32, 56, 44, 68 ];

const unsetOption = {
	label: __( 'Default', 'component-kitchen-sink' ),
	value: '',
};
const options = ( values ) => [
	unsetOption,
	...values.map( ( value ) => ( { label: value, value } ) ),
];

const ALIGN_OPTIONS = options( [ 'start', 'center', 'end', 'stretch' ] );
const JUSTIFY_OPTIONS = options( [
	'start',
	'center',
	'end',
	'space-between',
	'space-around',
	'space-evenly',
] );
const ALIGNMENT_OPTIONS = options( [
	'bottom',
	'bottomLeft',
	'bottomRight',
	'center',
	'spaced',
	'left',
	'right',
	'stretch',
	'top',
	'topLeft',
	'topRight',
] );

export default function Edit( { attributes, setAttributes } ) {
	const {
		columns,
		rows,
		gap,
		columnGap,
		rowGap,
		align,
		justify,
		alignment,
		isInline,
		templateColumns,
		templateRows,
		itemCount,
	} = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	// Empty strings and 0 mean "prop not passed".
	const gridProps = {
		columns,
		rows: rows || undefined,
		gap,
		columnGap: columnGap || undefined,
		rowGap: rowGap || undefined,
		align: align || undefined,
		justify: justify || undefined,
		alignment: alignment || undefined,
		isInline,
		templateColumns: templateColumns || undefined,
		templateRows: templateRows || undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Grid', 'component-kitchen-sink' ) }>
					<RangeControl
						label="columns"
						value={ columns }
						min={ 1 }
						max={ 6 }
						onChange={ ( next ) =>
							setAttributes( { columns: next ?? 3 } )
						}
					/>
					<RangeControl
						label="rows"
						help={ __(
							'0 leaves the prop unset.',
							'component-kitchen-sink'
						) }
						value={ rows }
						min={ 0 }
						max={ 6 }
						onChange={ ( next ) =>
							setAttributes( { rows: next ?? 0 } )
						}
					/>
					<RangeControl
						label="gap"
						value={ gap }
						min={ 0 }
						max={ 10 }
						onChange={ ( next ) =>
							setAttributes( { gap: next ?? 3 } )
						}
					/>
					<TextControl
						label="columnGap"
						help="e.g. 24px"
						value={ columnGap }
						onChange={ set( 'columnGap' ) }
					/>
					<TextControl
						label="rowGap"
						help="e.g. 4px"
						value={ rowGap }
						onChange={ set( 'rowGap' ) }
					/>
					<SelectControl
						label="align"
						value={ align }
						options={ ALIGN_OPTIONS }
						onChange={ set( 'align' ) }
					/>
					<SelectControl
						label="justify"
						value={ justify }
						options={ JUSTIFY_OPTIONS }
						onChange={ set( 'justify' ) }
					/>
					<SelectControl
						label="alignment"
						value={ alignment }
						options={ ALIGNMENT_OPTIONS }
						onChange={ set( 'alignment' ) }
					/>
					<ToggleControl
						label="isInline"
						checked={ isInline }
						onChange={ set( 'isInline' ) }
					/>
					<TextControl
						label="templateColumns"
						help="e.g. 1fr 2fr 1fr"
						value={ templateColumns }
						onChange={ set( 'templateColumns' ) }
					/>
					<TextControl
						label="templateRows"
						help="e.g. 40px 80px"
						value={ templateRows }
						onChange={ set( 'templateRows' ) }
					/>
					<RangeControl
						label={ __(
							'Number of children',
							'component-kitchen-sink'
						) }
						value={ itemCount }
						min={ 1 }
						max={ 12 }
						onChange={ ( next ) =>
							setAttributes( { itemCount: next ?? 6 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Grid</h3>
				<div style={ { border: '1px dashed #999', padding: 8 } }>
					<Grid { ...gridProps }>
						{ Array.from( { length: itemCount }, ( _, index ) => (
							<div
								key={ index }
								style={ {
									background: COLORS[ index % COLORS.length ],
									color: '#fff',
									padding: '4px 8px',
									height: HEIGHTS[ index % HEIGHTS.length ],
									boxSizing: 'border-box',
								} }
							>
								{ index + 1 }
							</div>
						) ) }
					</Grid>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
