import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	__experimentalScrollable as Scrollable,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const DIRECTION_OPTIONS = [ 'x', 'y', 'auto' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const { scrollDirection, smoothScroll, maxHeight, maxWidth } = attributes;

	// Scrollable only scrolls when its own size is constrained, so the demo
	// sets a max size through `style` and fills it with oversized content.
	const scrollableProps = {
		scrollDirection,
		smoothScroll,
		style: { maxHeight, maxWidth, border: '1px solid #999' },
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Scrollable', 'component-kitchen-sink' ) }
				>
					<p>
						{ __(
							'Scrollable is deprecated in this version of the package, so it logs a deprecation notice.',
							'component-kitchen-sink'
						) }
					</p>
					<SelectControl
						label="scrollDirection"
						value={ scrollDirection }
						options={ DIRECTION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { scrollDirection: next } )
						}
					/>
					<ToggleControl
						label="smoothScroll"
						checked={ smoothScroll }
						onChange={ ( next ) =>
							setAttributes( { smoothScroll: next } )
						}
					/>
					<RangeControl
						label="style.maxHeight"
						value={ maxHeight }
						min={ 60 }
						max={ 400 }
						onChange={ ( next ) =>
							setAttributes( { maxHeight: next ?? 140 } )
						}
					/>
					<RangeControl
						label="style.maxWidth"
						value={ maxWidth }
						min={ 120 }
						max={ 600 }
						onChange={ ( next ) =>
							setAttributes( { maxWidth: next ?? 320 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Scrollable</h3>
				<Scrollable { ...scrollableProps }>
					<div
						style={ {
							width: 640,
							height: 420,
							background:
								'linear-gradient(135deg, #0073aa, #e8590c 50%, #862e9c)',
							color: '#fff',
							padding: 8,
							boxSizing: 'border-box',
						} }
					>
						{ __(
							'640 x 420 content inside a smaller Scrollable',
							'component-kitchen-sink'
						) }
					</div>
				</Scrollable>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
