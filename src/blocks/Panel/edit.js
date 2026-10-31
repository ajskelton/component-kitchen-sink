import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Panel,
	PanelBody,
	PanelRow,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { header, bodyCount } = attributes;

	const demo = (
		<Panel header={ header }>
			{ Array.from( { length: bodyCount }, ( _, index ) => (
				<PanelBody
					key={ index }
					title={ `${ __( 'PanelBody', 'component-kitchen-sink' ) } ${
						index + 1
					}` }
					initialOpen={ index === 0 }
				>
					<PanelRow>
						{ __(
							'A PanelRow inside the Panel.',
							'component-kitchen-sink'
						) }
					</PanelRow>
				</PanelBody>
			) ) }
		</Panel>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Panel', 'component-kitchen-sink' ) }>
					<TextControl
						label="header"
						value={ header }
						onChange={ ( next ) =>
							setAttributes( { header: next } )
						}
					/>
					<RangeControl
						label="children (number of PanelBody)"
						value={ bodyCount }
						min={ 0 }
						max={ 5 }
						onChange={ ( next ) =>
							setAttributes( { bodyCount: next ?? 2 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Panel</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
