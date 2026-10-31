import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Card,
	CardBody,
	CardMedia,
	PanelBody,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import './editor.scss';

// A self-contained gradient image, so the block needs no network request.
const IMAGE_SRC =
	'data:image/svg+xml;utf8,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="280" viewBox="0 0 640 280">' +
			'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
			'<stop offset="0" stop-color="#0073aa"/><stop offset="1" stop-color="#e8590c"/>' +
			'</linearGradient></defs>' +
			'<rect width="640" height="280" fill="url(#g)"/>' +
			'<circle cx="480" cy="90" r="50" fill="#fff" fill-opacity=".6"/>' +
			'</svg>'
	);

const MEDIA_KIND_OPTIONS = [
	{ label: 'image (<img>)', value: 'image' },
	{ label: 'color (background only)', value: 'color' },
];
const PLACEMENT_OPTIONS = [
	{ label: 'top (before CardBody)', value: 'top' },
	{ label: 'bottom (after CardBody)', value: 'bottom' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { mediaKind, height, placement } = attributes;

	// CardMedia has no props of its own: it is a full-bleed container for its
	// children, so the block varies what goes inside it and where it sits.
	const media = (
		<CardMedia>
			{ mediaKind === 'image' ? (
				<img
					src={ IMAGE_SRC }
					alt=""
					style={ {
						display: 'block',
						width: '100%',
						height,
						objectFit: 'cover',
					} }
				/>
			) : (
				<div style={ { height, background: '#862e9c' } } />
			) }
		</CardMedia>
	);

	const body = (
		<CardBody>
			{ __(
				'CardMedia is full-bleed inside a Card.',
				'component-kitchen-sink'
			) }
		</CardBody>
	);

	const demo = (
		<Card>
			{ placement === 'top' ? media : body }
			{ placement === 'top' ? body : media }
		</Card>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'CardMedia', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="children"
						value={ mediaKind }
						options={ MEDIA_KIND_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { mediaKind: next } )
						}
					/>
					<RangeControl
						label="children height"
						value={ height }
						min={ 40 }
						max={ 300 }
						onChange={ ( next ) =>
							setAttributes( { height: next ?? 140 } )
						}
					/>
					<SelectControl
						label={ __(
							'position in Card',
							'component-kitchen-sink'
						) }
						value={ placement }
						options={ PLACEMENT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { placement: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>CardMedia</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
