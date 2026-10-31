import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalBlockVariationTransforms as BlockVariationTransforms,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, SelectControl } from '@wordpress/components';
import './editor.scss';

const ACCENTS = {
	red: '#d63638',
	green: '#00a32a',
	blue: '#2271b1',
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { accent } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockVariationTransforms',
						'component-kitchen-sink'
					) }
				>
					{ /*
					 * Reads the block's own "transform" variations (declared in
					 * block.json) and updates its attributes on selection. It
					 * renders nothing when the block has no transform variations.
					 */ }
					<BlockVariationTransforms blockClientId={ clientId } />
					<SelectControl
						label="accent (attribute set by the variations)"
						value={ accent }
						options={ Object.keys( ACCENTS ).map( ( value ) => ( {
							label: value,
							value,
						} ) ) }
						onChange={ ( next ) =>
							setAttributes( { accent: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockVariationTransforms</h3>
				<p>
					{ __(
						'The transform buttons are in the block inspector and the canvas:',
						'component-kitchen-sink'
					) }
				</p>
				<BlockVariationTransforms blockClientId={ clientId } />
				<div
					className="ajs-variation-swatch"
					style={ { background: ACCENTS[ accent ] } }
				>
					{ `accent: ${ accent }` }
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
