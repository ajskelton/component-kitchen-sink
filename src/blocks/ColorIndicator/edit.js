import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	ColorIndicator,
	ColorPicker,
	PanelBody,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { colorValue, size } = attributes;

	// Shared by the inspector preview and the canvas. ColorIndicator has no
	// size prop, so the size is applied through `style`. A `style` prop
	// replaces the component's own `style`, which is where `colorValue` ends
	// up as `background`, so the background is repeated here.
	const indicatorProps = {
		colorValue,
		style: { background: colorValue, width: size, height: size },
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ColorIndicator', 'component-kitchen-sink' ) }
				>
					<ColorIndicator { ...indicatorProps } />
					<TextControl
						label="colorValue"
						help={ __(
							'Any CSS background value, e.g. a colour or gradient.',
							'component-kitchen-sink'
						) }
						value={ colorValue }
						onChange={ ( next ) =>
							setAttributes( { colorValue: next } )
						}
					/>
					<ColorPicker
						color={ colorValue }
						onChange={ ( next ) =>
							setAttributes( { colorValue: next } )
						}
					/>
					<RangeControl
						label="style.width / height"
						value={ size }
						min={ 8 }
						max={ 96 }
						onChange={ ( next ) =>
							setAttributes( { size: next ?? 24 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ColorIndicator</h3>
				<ColorIndicator { ...indicatorProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
