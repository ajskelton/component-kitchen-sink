import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	BaseControl,
	ColorPalette,
	DuotoneSwatch,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const COLORS = [
	{ name: 'Black', color: '#000000' },
	{ name: 'White', color: '#ffffff' },
	{ name: 'Navy', color: '#000097' },
	{ name: 'Coral', color: '#ff4747' },
	{ name: 'Gold', color: '#fcb900' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { shadow, highlight, showPlaceholder } = attributes;

	// `values: null` makes the swatch render its placeholder icon.
	const swatchProps = {
		values: showPlaceholder ? null : [ shadow, highlight ],
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'DuotoneSwatch', 'component-kitchen-sink' ) }
				>
					<DuotoneSwatch { ...swatchProps } />
					<ToggleControl
						label="values (null placeholder)"
						checked={ showPlaceholder }
						onChange={ ( next ) =>
							setAttributes( { showPlaceholder: next } )
						}
					/>
					<BaseControl.VisualLabel>
						values[0] (shadow)
					</BaseControl.VisualLabel>
					<ColorPalette
						aria-label="values[0]"
						colors={ COLORS }
						value={ shadow }
						clearable={ false }
						onChange={ ( next ) =>
							setAttributes( { shadow: next ?? '#000000' } )
						}
					/>
					<BaseControl.VisualLabel>
						values[1] (highlight)
					</BaseControl.VisualLabel>
					<ColorPalette
						aria-label="values[1]"
						colors={ COLORS }
						value={ highlight }
						clearable={ false }
						onChange={ ( next ) =>
							setAttributes( { highlight: next ?? '#ffffff' } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>DuotoneSwatch</h3>
				<DuotoneSwatch { ...swatchProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
