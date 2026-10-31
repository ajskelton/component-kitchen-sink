import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useSetting,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import './editor.scss';

const COMMON_PATHS = [
	'typography.dropCap',
	'typography.fontSizes',
	'color.custom',
	'color.palette.default',
	'spacing.units',
	'layout.contentSize',
	'border.radius',
	'shadow.presets',
];

export default function Edit( { attributes, setAttributes } ) {
	const { path } = attributes;

	// Deprecated since WordPress 6.5 (use useSettings). Calling it logs a
	// deprecation warning in the browser console.
	const value = useSetting( path );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'useSetting', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="path"
						value={ path }
						onChange={ ( next ) => setAttributes( { path: next } ) }
					/>
					<SelectControl
						label={ __( 'Common paths', 'component-kitchen-sink' ) }
						value=""
						options={ [
							{ label: '—', value: '' },
							...COMMON_PATHS.map( ( p ) => ( {
								label: p,
								value: p,
							} ) ),
						] }
						onChange={ ( next ) =>
							next && setAttributes( { path: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useSetting</h3>
				<p>
					{ __(
						'Deprecated hook: check the console for the deprecation notice.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>
					{ JSON.stringify(
						{ path, value: value ?? null },
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
