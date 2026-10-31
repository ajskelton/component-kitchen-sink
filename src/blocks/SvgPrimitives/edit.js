import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Circle,
	ColorPalette,
	G,
	Line,
	PanelBody,
	Path,
	Polygon,
	RangeControl,
	Rect,
	SVG,
} from '@wordpress/components';
import './editor.scss';

const COLORS = [
	{ name: 'Black', color: '#1e1e1e' },
	{ name: 'Blue', color: '#0073aa' },
	{ name: 'Orange', color: '#e8590c' },
	{ name: 'Green', color: '#2b8a3e' },
	{ name: 'Purple', color: '#862e9c' },
	{ name: 'Sky', color: '#72aee6' },
	{ name: 'White', color: '#ffffff' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { stroke, fill, strokeWidth, size } = attributes;

	// Drawn in a 100 x 100 viewBox so the size control only scales the image.
	// Every primitive receives the stroke/fill/strokeWidth attributes.
	const shape = { stroke, fill, strokeWidth };
	const canvas = (
		<SVG
			viewBox="0 0 100 100"
			width={ size }
			height={ size }
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label={ __(
				'SVG primitives drawing',
				'component-kitchen-sink'
			) }
			style={ { border: '1px dashed #999', background: '#fff' } }
		>
			{ /* Rect: the frame. */ }
			<Rect x="6" y="6" width="38" height="28" rx="4" { ...shape } />
			{ /* Circle: the sun. */ }
			<Circle cx="74" cy="22" r="14" { ...shape } />
			{ /* G: groups two shapes and moves them together. */ }
			<G transform="translate(8 46)" { ...shape }>
				{ /* Polygon: a triangle. */ }
				<Polygon points="0,40 20,0 40,40" />
				{ /* Path: a wave. */ }
				<Path d="M46 20 q 8 -18 16 0 t 16 0" fill="none" />
			</G>
			{ /* Line: the ground. */ }
			<Line x1="6" y1="94" x2="94" y2="94" { ...shape } />
		</SVG>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'SvgPrimitives', 'component-kitchen-sink' ) }
				>
					<p>stroke</p>
					<ColorPalette
						aria-label="stroke"
						colors={ COLORS }
						value={ stroke }
						clearable={ false }
						onChange={ ( next ) =>
							setAttributes( { stroke: next ?? '#1e1e1e' } )
						}
					/>
					<p>fill</p>
					<ColorPalette
						aria-label="fill"
						colors={ COLORS }
						value={ fill }
						clearable={ false }
						onChange={ ( next ) =>
							setAttributes( { fill: next ?? '#72aee6' } )
						}
					/>
					<RangeControl
						label="strokeWidth"
						value={ strokeWidth }
						min={ 0 }
						max={ 10 }
						step={ 0.5 }
						onChange={ ( next ) =>
							setAttributes( { strokeWidth: next ?? 3 } )
						}
					/>
					<RangeControl
						label={ __(
							'size (width / height)',
							'component-kitchen-sink'
						) }
						value={ size }
						min={ 80 }
						max={ 480 }
						onChange={ ( next ) =>
							setAttributes( { size: next ?? 240 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>SvgPrimitives</h3>
				{ canvas }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
