import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
// @wordpress/hooks is provided by WordPress (wp-hooks) and externalised by wp-scripts.
// eslint-disable-next-line import/no-extraneous-dependencies
import { addFilter, removeFilter } from '@wordpress/hooks';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	withFilters,
} from '@wordpress/components';
import './editor.scss';

const HOOK_NAME = 'ajs.componentKitchenSink.withFiltersDemo';
const NAMESPACE = 'component-kitchen-sink/with-filters-demo';

const MODE_OPTIONS = [
	{ label: 'append a component', value: 'append' },
	{ label: 'override a prop', value: 'override-prop' },
];

function Original( { title } ) {
	return (
		<div style={ { padding: 8, border: '1px solid' } }>
			<strong>{ title }</strong>
			<p>
				{ __( 'Original component output.', 'component-kitchen-sink' ) }
			</p>
		</div>
	);
}

// Created once at module level, never inside render. The component is
// filtered through `applyFilters( HOOK_NAME, Original )`.
const FilteredOriginal = withFilters( HOOK_NAME )( Original );

/**
 * Builds the filter callback: a function that takes the component being
 * filtered and returns a replacement.
 *
 * @param {'append'|'override-prop'} mode Which kind of filter to register.
 * @return {()=>void} Filter callback for addFilter.
 */
function createFilter( mode ) {
	if ( mode === 'override-prop' ) {
		return ( FilteredComponent ) =>
			function WithTitleOverridden( props ) {
				return (
					<FilteredComponent
						{ ...props }
						title="Title overridden by the filter"
					/>
				);
			};
	}
	return ( FilteredComponent ) =>
		function WithComponentAppended( props ) {
			return (
				<>
					<FilteredComponent { ...props } />
					<p>
						<em>
							{ __(
								'Appended by the filter.',
								'component-kitchen-sink'
							) }
						</em>
					</p>
				</>
			);
		};
}

export default function Edit( { attributes, setAttributes } ) {
	const { filterEnabled, mode, filteredTitle } = attributes;

	// Register (or re-register) the filter while enabled. withFilters listens
	// for hookAdded/hookRemoved and re-renders after a short debounce.
	useEffect( () => {
		if ( ! filterEnabled ) {
			return undefined;
		}
		addFilter( HOOK_NAME, NAMESPACE, createFilter( mode ) );
		return () => removeFilter( HOOK_NAME, NAMESPACE );
	}, [ filterEnabled, mode ] );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'withFilters', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="addFilter( hookName, ... )"
						checked={ filterEnabled }
						help={ HOOK_NAME }
						onChange={ ( next ) =>
							setAttributes( { filterEnabled: next } )
						}
					/>
					<SelectControl
						label="filter kind"
						value={ mode }
						options={ MODE_OPTIONS }
						onChange={ ( next ) => setAttributes( { mode: next } ) }
					/>
					<TextControl
						label="title prop"
						value={ filteredTitle }
						onChange={ ( next ) =>
							setAttributes( { filteredTitle: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>withFilters</h3>
				<FilteredOriginal title={ filteredTitle } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
