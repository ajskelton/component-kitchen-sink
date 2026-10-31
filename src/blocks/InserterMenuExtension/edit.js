/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__unstableInserterMenuExtension as InserterMenuExtension,
	Inserter,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import './editor.scss';

// Content of the fill. The slot passes its fillProps (onSelect, onHover,
// filterValue, hasItems, rootClientId) to the Fill's render function; this
// component also reports the last search term back to the block.
function ExtensionContent( {
	filterValue,
	hasItems,
	message,
	showFilter,
	lastSearch,
	onSearch,
} ) {
	useEffect( () => {
		if ( filterValue && filterValue !== lastSearch ) {
			onSearch( filterValue );
		}
	}, [ filterValue, lastSearch, onSearch ] );

	return (
		<p className="ajs-inserter-menu-extension">
			<strong>{ message }</strong>
			{ showFilter && filterValue ? ` (search: "${ filterValue }")` : '' }
			{ hasItems
				? ''
				: ` ${ __( '(no block results)', 'component-kitchen-sink' ) }` }
		</p>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { enabled, message, showFilterValue, lastSearch } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__unstableInserterMenuExtension',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="enabled (mount the Fill)"
						checked={ enabled }
						onChange={ ( next ) =>
							setAttributes( { enabled: next } )
						}
					/>
					<TextControl
						label="message"
						value={ message }
						onChange={ ( next ) =>
							setAttributes( { message: next } )
						}
					/>
					<ToggleControl
						label="fillProps.filterValue"
						checked={ showFilterValue }
						help={ __(
							'Echo the inserter search term inside the fill.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { showFilterValue: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>InserterMenuExtension</h3>
				<p>
					{ __(
						'Open the inserter, type a search term, and the fill appears below the search results.',
						'component-kitchen-sink'
					) }
				</p>
				<Inserter />
				{ /*
				 * A Fill renders nothing here. Its content is portaled to the
				 * matching Slot in the inserter search results.
				 */ }
				{ enabled && (
					<InserterMenuExtension>
						{ ( fillProps ) => (
							<ExtensionContent
								{ ...fillProps }
								message={ message }
								showFilter={ showFilterValue }
								lastSearch={ lastSearch }
								onSearch={ ( term ) =>
									setAttributes( { lastSearch: term } )
								}
							/>
						) }
					</InserterMenuExtension>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
				<p>{ lastSearch && `Last search: ${ lastSearch }` }</p>
			</div>
		</>
	);
}
