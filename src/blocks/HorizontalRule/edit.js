import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	ColorPicker,
	HorizontalRule,
	PanelBody,
	RangeControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { color, thickness, widthPercent } = attributes;

	// HorizontalRule renders a plain <hr> and passes extra props through, so
	// appearance is controlled with `style`.
	const ruleProps = {
		style: {
			width: `${ widthPercent }%`,
			borderColor: color,
			borderTopWidth: thickness,
			margin: '16px 0',
		},
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'HorizontalRule', 'component-kitchen-sink' ) }
				>
					<HorizontalRule { ...ruleProps } />
					<ColorPicker
						color={ color }
						onChange={ ( next ) =>
							setAttributes( { color: next } )
						}
					/>
					<RangeControl
						label="style.borderTopWidth"
						value={ thickness }
						min={ 1 }
						max={ 20 }
						onChange={ ( next ) =>
							setAttributes( { thickness: next ?? 2 } )
						}
					/>
					<RangeControl
						label="style.width (%)"
						value={ widthPercent }
						min={ 10 }
						max={ 100 }
						onChange={ ( next ) =>
							setAttributes( { widthPercent: next ?? 100 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>HorizontalRule</h3>
				<HorizontalRule { ...ruleProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
