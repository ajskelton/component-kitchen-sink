import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalLinkControlSearchResults as LinkControlSearchResults,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

// "__CREATE__" is the type LinkControl uses for its "Create" result.
const SUGGESTIONS = [
	{ id: 1, type: 'page', title: 'About us', url: '/about' },
	{ id: 2, type: 'post', title: 'Hello world', url: '/hello-world' },
	{ id: 3, type: 'category', title: 'News', url: '/category/news' },
	{ id: 4, type: '__CREATE__', title: 'a' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		searchTerm,
		selectedSuggestion,
		isLoading,
		isInitialSuggestions,
		withCreateSuggestion,
		createSuggestionButtonText,
		suggestionsQueryType,
		clicks,
	} = attributes;

	const suggestions = SUGGESTIONS.map( ( suggestion ) =>
		suggestion.type === '__CREATE__'
			? { ...suggestion, title: searchTerm }
			: suggestion
	);

	// Every prop exercised by this block. URLInput normally supplies the item
	// props and the list props; here they are minimal stand-ins.
	const searchResultsProps = {
		suggestions,
		selectedSuggestion,
		isLoading,
		isInitialSuggestions,
		withCreateSuggestion,
		createSuggestionButtonText: createSuggestionButtonText || undefined,
		suggestionsQuery: suggestionsQueryType
			? { type: suggestionsQueryType }
			: undefined,
		currentInputValue: searchTerm,
		suggestionsListProps: { id: 'ajs-search-results', role: 'listbox' },
		buildSuggestionItemProps: ( suggestion, index ) => ( {
			id: `ajs-search-result-${ index }`,
			role: 'option',
			tabIndex: -1,
			ref: () => {},
			'aria-selected': index === selectedSuggestion,
		} ),
		handleSuggestionClick: () => setAttributes( { clicks: clicks + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__experimentalLinkControlSearchResults',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="currentInputValue"
						value={ searchTerm }
						onChange={ ( next ) =>
							setAttributes( { searchTerm: next } )
						}
					/>
					<RangeControl
						label="selectedSuggestion"
						value={ selectedSuggestion }
						min={ 0 }
						max={ SUGGESTIONS.length - 1 }
						onChange={ ( next ) =>
							setAttributes( { selectedSuggestion: next ?? 0 } )
						}
					/>
					<ToggleControl
						label="isLoading"
						checked={ isLoading }
						onChange={ ( next ) =>
							setAttributes( { isLoading: next } )
						}
					/>
					<ToggleControl
						label="isInitialSuggestions"
						checked={ isInitialSuggestions }
						onChange={ ( next ) =>
							setAttributes( { isInitialSuggestions: next } )
						}
					/>
					<ToggleControl
						label="withCreateSuggestion"
						checked={ withCreateSuggestion }
						onChange={ ( next ) =>
							setAttributes( { withCreateSuggestion: next } )
						}
					/>
					<TextControl
						label="createSuggestionButtonText"
						value={ createSuggestionButtonText }
						onChange={ ( next ) =>
							setAttributes( {
								createSuggestionButtonText: next,
							} )
						}
					/>
					<SelectControl
						label="suggestionsQuery.type"
						value={ suggestionsQueryType }
						options={ [
							{ label: '(none): shows types', value: '' },
							{ label: 'post: hides types', value: 'post' },
						] }
						onChange={ ( next ) =>
							setAttributes( { suggestionsQueryType: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { clicks: 0 } ) }
					>
						{ __( 'Reset clicks', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>LinkControlSearchResults</h3>
				<p>
					{ __(
						'Deprecated export: expect a deprecation warning in the console. Fed with fixed sample suggestions.',
						'component-kitchen-sink'
					) }
				</p>
				<LinkControlSearchResults { ...searchResultsProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
