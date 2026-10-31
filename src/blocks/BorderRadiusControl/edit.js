import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalBorderRadiusControl as BorderRadiusControl,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { Button, PanelBody, ToggleControl } from '@wordpress/components';
import './editor.scss';

const SAMPLE_PRESETS = {
	theme: [
		{ name: 'Small', slug: 'small', size: '4px' },
		{ name: 'Medium', slug: 'medium', size: '12px' },
		{ name: 'Large', slug: 'large', size: '32px' },
	],
};

// Numbers (such as 0) are stored as is; give them a unit for CSS.
const toCss = ( value ) =>
	typeof value === 'number' ? `${ value }px` : value || undefined;

export default function Edit( { attributes, setAttributes } ) {
	const { values, usePresets } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		values,
		onChange: ( next ) => setAttributes( { values: next } ),
		presets: usePresets ? SAMPLE_PRESETS : undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BorderRadiusControl',
						'component-kitchen-sink'
					) }
				>
					<BorderRadiusControl { ...controlProps } />
					<ToggleControl
						label="presets (sample theme presets)"
						checked={ usePresets }
						onChange={ ( next ) =>
							setAttributes( { usePresets: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { values: {} } ) }
					>
						{ __( 'Reset values', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BorderRadiusControl</h3>
				<div
					style={ {
						height: 80,
						border: '2px solid currentColor',
						borderTopLeftRadius: toCss( values?.topLeft ),
						borderTopRightRadius: toCss( values?.topRight ),
						borderBottomLeftRadius: toCss( values?.bottomLeft ),
						borderBottomRightRadius: toCss( values?.bottomRight ),
					} }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
