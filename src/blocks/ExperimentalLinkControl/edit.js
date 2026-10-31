import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalLinkControl as LinkControl,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import './editor.scss';

const SETTINGS = {
	default: undefined,
	none: [],
	custom: [
		{ id: 'opensInNewTab', title: 'Open in new tab' },
		{
			id: 'noFollow',
			title: 'No follow',
			help: 'Adds rel="nofollow".',
		},
	],
};

const toOptions = ( values ) =>
	values.map( ( value ) => ( { label: value || '(any)', value } ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		url,
		title,
		opensInNewTab,
		noFollow,
		settings,
		showSuggestions,
		showInitialSuggestions,
		noDirectEntry,
		noURLSuggestion,
		hasTextControl,
		hasRichPreviews,
		handleEntities,
		withCreateSuggestion,
		hasRemove,
		forceIsEditingLink,
		searchInputPlaceholder,
		suggestionsQuerySubtype,
	} = attributes;

	// Stabilise the value: LinkControl keeps internal edits until it changes.
	const value = useMemo(
		() => ( { url, title, opensInNewTab, noFollow } ),
		[ url, title, opensInNewTab, noFollow ]
	);

	// Every prop exercised by this block.
	const linkControlProps = {
		value,
		settings: SETTINGS[ settings ],
		onChange: ( next ) =>
			setAttributes( {
				url: next.url ?? '',
				title: next.title ?? '',
				opensInNewTab: !! next.opensInNewTab,
				noFollow: !! next.noFollow,
			} ),
		onRemove: hasRemove
			? () => setAttributes( { url: '', title: '' } )
			: undefined,
		showSuggestions,
		showInitialSuggestions,
		noDirectEntry,
		noURLSuggestion,
		hasTextControl,
		hasRichPreviews,
		handleEntities,
		searchInputPlaceholder,
		forceIsEditingLink:
			forceIsEditingLink === 'auto'
				? undefined
				: forceIsEditingLink === 'true',
		suggestionsQuery: suggestionsQuerySubtype
			? { type: 'post', subtype: suggestionsQuerySubtype }
			: undefined,
		createSuggestion: withCreateSuggestion
			? ( text ) => ( {
					id: Date.now(),
					type: 'page',
					title: text,
					url: `/${ text.toLowerCase().replace( /\W+/g, '-' ) }`,
				} )
			: undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__experimentalLinkControl',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="settings"
						value={ settings }
						options={ [
							{
								label: 'default (opensInNewTab)',
								value: 'default',
							},
							{ label: '[] (none)', value: 'none' },
							{
								label: 'custom (opensInNewTab + noFollow)',
								value: 'custom',
							},
						] }
						onChange={ ( next ) =>
							setAttributes( { settings: next } )
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
						label="showInitialSuggestions"
						checked={ showInitialSuggestions }
						onChange={ ( next ) =>
							setAttributes( { showInitialSuggestions: next } )
						}
					/>
					<ToggleControl
						label="noDirectEntry"
						checked={ noDirectEntry }
						onChange={ ( next ) =>
							setAttributes( { noDirectEntry: next } )
						}
					/>
					<ToggleControl
						label="noURLSuggestion"
						checked={ noURLSuggestion }
						onChange={ ( next ) =>
							setAttributes( { noURLSuggestion: next } )
						}
					/>
					<ToggleControl
						label="hasTextControl"
						checked={ hasTextControl }
						onChange={ ( next ) =>
							setAttributes( { hasTextControl: next } )
						}
					/>
					<ToggleControl
						label="hasRichPreviews"
						checked={ hasRichPreviews }
						onChange={ ( next ) =>
							setAttributes( { hasRichPreviews: next } )
						}
					/>
					<ToggleControl
						label="handleEntities"
						checked={ handleEntities }
						onChange={ ( next ) =>
							setAttributes( { handleEntities: next } )
						}
					/>
					<ToggleControl
						label="createSuggestion"
						checked={ withCreateSuggestion }
						help={ __(
							'Adds a "Create" result that returns a fake page suggestion.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { withCreateSuggestion: next } )
						}
					/>
					<ToggleControl
						label="onRemove"
						checked={ hasRemove }
						onChange={ ( next ) =>
							setAttributes( { hasRemove: next } )
						}
					/>
					<SelectControl
						label="forceIsEditingLink"
						value={ forceIsEditingLink }
						options={ toOptions( [ 'auto', 'true', 'false' ] ) }
						onChange={ ( next ) =>
							setAttributes( { forceIsEditingLink: next } )
						}
					/>
					<TextControl
						label="searchInputPlaceholder"
						value={ searchInputPlaceholder }
						onChange={ ( next ) =>
							setAttributes( { searchInputPlaceholder: next } )
						}
					/>
					<SelectControl
						label="suggestionsQuery.subtype"
						value={ suggestionsQuerySubtype }
						options={ toOptions( [ '', 'page', 'post' ] ) }
						onChange={ ( next ) =>
							setAttributes( { suggestionsQuerySubtype: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>__experimentalLinkControl</h3>
				<p>
					{ __(
						'Deprecated alias of LinkControl; expect a deprecation warning in the console.',
						'component-kitchen-sink'
					) }
				</p>
				<LinkControl { ...linkControlProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
