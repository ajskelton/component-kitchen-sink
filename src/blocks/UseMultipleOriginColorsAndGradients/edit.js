import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

const ORIGIN_OPTIONS = [
	{ label: 'all', value: 'all' },
	{ label: 'theme', value: 'theme' },
	{ label: 'default', value: 'default' },
	{ label: 'custom', value: 'custom' },
];

const SWATCH_STYLE = {
	display: 'inline-block',
	width: 24,
	height: 24,
	borderRadius: '50%',
	border: '1px solid rgba(0, 0, 0, 0.3)',
	marginRight: 4,
};

export default function Edit( { attributes, setAttributes } ) {
	const { origin, showSwatches } = attributes;

	// Returns { colors, gradients, disableCustomColors, disableCustomGradients,
	// hasColorsOrGradients }; colors and gradients are grouped by origin.
	const settings = useMultipleOriginColorsAndGradients();

	const matches = ( entry ) => origin === 'all' || entry.slug === origin;
	const colors = settings.colors.filter( matches );
	const gradients = settings.gradients.filter( matches );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__experimentalUseMultipleOriginColorsAndGradients',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label={ __(
							'Origin to display',
							'component-kitchen-sink'
						) }
						value={ origin }
						options={ ORIGIN_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { origin: next } )
						}
					/>
					<ToggleControl
						label={ __(
							'Show swatches',
							'component-kitchen-sink'
						) }
						checked={ showSwatches }
						onChange={ ( next ) =>
							setAttributes( { showSwatches: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useMultipleOriginColorsAndGradients</h3>
				{ showSwatches && (
					<>
						{ colors.map( ( group ) => (
							<div key={ `c-${ group.slug }` }>
								<strong>{ group.name }</strong>
								<div>
									{ group.colors.map( ( color ) => (
										<span
											key={ color.slug }
											title={ `${ color.name } ${ color.color }` }
											style={ {
												...SWATCH_STYLE,
												background: color.color,
											} }
										/>
									) ) }
								</div>
							</div>
						) ) }
						{ gradients.map( ( group ) => (
							<div key={ `g-${ group.slug }` }>
								<strong>{ group.name }</strong>
								<div>
									{ group.gradients.map( ( gradient ) => (
										<span
											key={ gradient.slug }
											title={ gradient.name }
											style={ {
												...SWATCH_STYLE,
												background: gradient.gradient,
											} }
										/>
									) ) }
								</div>
							</div>
						) ) }
					</>
				) }
				<pre>
					{ JSON.stringify(
						{
							...settings,
							colors,
							gradients,
						},
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
