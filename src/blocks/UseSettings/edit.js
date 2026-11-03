import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useSettings,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

/**
 * Reads the settings. It lives in its own component, keyed by the path list,
 * because useSettings( ...paths ) puts the paths in a dependency array, whose
 * length must not change between renders of the same component instance.
 *
 * @param {Object}   props       Component props.
 * @param {string[]} props.paths Setting paths to read.
 */
function SettingsReader( { paths } ) {
	const values = useSettings( ...paths );
	const result = Object.fromEntries(
		paths.map( ( path, index ) => [ path, values[ index ] ?? null ] )
	);
	return <pre>{ JSON.stringify( result, null, 2 ) }</pre>;
}

export default function Edit( { attributes, setAttributes } ) {
	const { paths } = attributes;
	const list = paths
		.split( ',' )
		.map( ( path ) => path.trim() )
		.filter( Boolean );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'useSettings', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="...paths"
						help={ __(
							'Comma-separated setting paths, e.g. color.palette.theme, spacing.units',
							'component-kitchen-sink'
						) }
						value={ paths }
						onChange={ ( next ) =>
							setAttributes( { paths: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useSettings</h3>
				<SettingsReader key={ list.join( '|' ) } paths={ list } />
			</div>
		</>
	);
}
