import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	BlockQuotation,
	PanelBody,
	TextControl,
	TextareaControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { quote, cite, showCite } = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	// BlockQuotation renders a <blockquote>; a <cite> child is the usual
	// attribution.
	const demo = (
		<BlockQuotation>
			{ quote }
			{ showCite && <cite>{ cite }</cite> }
		</BlockQuotation>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockQuotation', 'component-kitchen-sink' ) }
				>
					<TextareaControl
						label="children"
						value={ quote }
						onChange={ set( 'quote' ) }
					/>
					<ToggleControl
						label={ __(
							'children: <cite>',
							'component-kitchen-sink'
						) }
						checked={ showCite }
						onChange={ set( 'showCite' ) }
					/>
					<TextControl
						label={ __( '<cite> text', 'component-kitchen-sink' ) }
						value={ cite }
						disabled={ ! showCite }
						onChange={ set( 'cite' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockQuotation</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
