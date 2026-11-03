import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalLinkControlSearchInput as LinkControlSearchInput,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

const SUGGESTIONS = [
	{ id: 1, type: 'page', title: 'About us', url: '/about' },
	{ id: 2, type: 'post', title: 'Hello world', url: '/hello-world' },
	{ id: 3, type: 'category', title: 'News', url: '/category/news' },
	{ id: 4, type: 'attachment', title: 'Logo', url: '/logo' },
];

// A static search handler so the block works without the editor's link
// suggestion endpoint. It matches the title, or returns everything for the
// initial (empty) request.
const fetchSuggestions = ( search ) =>
	Promise.resolve(
		SUGGESTIONS.filter( ( suggestion ) =>
			suggestion.title.toLowerCase().includes( search.toLowerCase() )
		)
	);

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		placeholder,
		showSuggestions,
		allowDirectEntry,
		showInitialSuggestions,
		withCreateSuggestion,
		hideLabelFromVision,
		isEntity,
		selectedUrl,
		selectedTitle,
	} = attributes;

	// Every prop exercised by this block.
	const searchInputProps = {
		value,
		placeholder,
		showSuggestions,
		allowDirectEntry,
		showInitialSuggestions,
		withCreateSuggestion,
		hideLabelFromVision,
		isEntity,
		fetchSuggestions,
		currentLink: { url: selectedUrl },
		onChange: ( next ) => setAttributes( { value: next } ),
		onSelect: ( link ) =>
			setAttributes( {
				value: link.url ?? '',
				selectedUrl: link.url ?? '',
				selectedTitle: link.title ?? '',
			} ),
		onCreateSuggestion: ( title ) => ( {
			id: Date.now(),
			type: 'page',
			title,
			url: `/${ title.toLowerCase().replace( /\W+/g, '-' ) }`,
		} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__experimentalLinkControlSearchInput',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="placeholder"
						value={ placeholder }
						onChange={ ( next ) =>
							setAttributes( { placeholder: next } )
						}
					/>
					<ToggleControl
						label="showSuggestions"
						checked={ showSuggestions }
						onChange={ ( next ) =>
							setAttributes( { showSuggestions: next } )
						}
					/>
					<ToggleControl
						label="allowDirectEntry"
						checked={ allowDirectEntry }
						onChange={ ( next ) =>
							setAttributes( { allowDirectEntry: next } )
						}
					/>
					<ToggleControl
						label="showInitialSuggestions"
						checked={ showInitialSuggestions }
						onChange={ ( next ) =>
							setAttributes( { showInitialSuggestions: next } )
						}
					/>
					<ToggleControl
						label="withCreateSuggestion"
						checked={ withCreateSuggestion }
						onChange={ ( next ) =>
							setAttributes( { withCreateSuggestion: next } )
						}
					/>
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
						}
					/>
					<ToggleControl
						label="isEntity"
						checked={ isEntity }
						help={ __(
							'Disables the input, as for a link bound to an entity.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { isEntity: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>LinkControlSearchInput</h3>
				<p>
					{ __(
						'Deprecated export: expect a deprecation warning in the console. Suggestions come from a static list (About us, Hello world, News, Logo).',
						'component-kitchen-sink'
					) }
				</p>
				<LinkControlSearchInput { ...searchInputProps } />
				<p>{ selectedTitle && `Selected: ${ selectedTitle }` }</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
