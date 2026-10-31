import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalFontAppearanceControl as FontAppearanceControl,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

const SAMPLE_FACES = [
	{ fontStyle: 'normal', fontWeight: '400' },
	{ fontStyle: 'italic', fontWeight: '400' },
	{ fontStyle: 'normal', fontWeight: '700' },
	{ fontStyle: 'italic', fontWeight: '700' },
];

const SIZE_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: 'compact', value: 'compact' },
	{ label: 'small', value: 'small' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		fontStyle,
		fontWeight,
		hasFontStyles,
		hasFontWeights,
		useSampleFaces,
		size,
		disabled,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		value: {
			fontStyle: fontStyle || undefined,
			fontWeight: fontWeight || undefined,
		},
		onChange: ( next ) =>
			setAttributes( {
				fontStyle: next?.fontStyle ?? '',
				fontWeight: next?.fontWeight ?? '',
			} ),
		hasFontStyles,
		hasFontWeights,
		fontFamilyFaces: useSampleFaces ? SAMPLE_FACES : undefined,
		size,
		disabled,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'FontAppearanceControl',
						'component-kitchen-sink'
					) }
				>
					<FontAppearanceControl { ...controlProps } />
					<ToggleControl
						label="hasFontStyles"
						checked={ hasFontStyles }
						onChange={ ( next ) =>
							setAttributes( { hasFontStyles: next } )
						}
					/>
					<ToggleControl
						label="hasFontWeights"
						checked={ hasFontWeights }
						onChange={ ( next ) =>
							setAttributes( { hasFontWeights: next } )
						}
					/>
					<ToggleControl
						label="fontFamilyFaces (sample faces)"
						checked={ useSampleFaces }
						onChange={ ( next ) =>
							setAttributes( { useSampleFaces: next } )
						}
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>FontAppearanceControl</h3>
				<p
					style={ {
						fontStyle: fontStyle || undefined,
						fontWeight: fontWeight || undefined,
					} }
				>
					{ __(
						'The quick brown fox jumps over the lazy dog.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
