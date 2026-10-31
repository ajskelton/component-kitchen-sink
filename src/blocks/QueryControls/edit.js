import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	QueryControls,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

// Static data: the real block editor feeds these from the REST API.
const AUTHORS = [
	{ id: 1, name: 'Ada Lovelace' },
	{ id: 2, name: 'Grace Hopper' },
	{ id: 3, name: 'Alan Turing' },
];

const CATEGORIES = [
	{ id: 10, name: 'News', parent: 0 },
	{ id: 11, name: 'Events', parent: 0 },
	{ id: 12, name: 'Conferences', parent: 11 },
	{ id: 13, name: 'Meetups', parent: 11 },
	{ id: 14, name: 'Tutorials', parent: 0 },
];

const CATEGORY_SUGGESTIONS = Object.fromEntries(
	CATEGORIES.map( ( category ) => [ category.name, category ] )
);

const CUSTOM_ORDER_BY_OPTIONS = [
	{ label: 'Newest to oldest', value: 'date/desc' },
	{ label: 'Oldest to newest', value: 'date/asc' },
	{ label: 'Menu order', value: 'menu_order/asc' },
];

const CATEGORY_MODE_OPTIONS = [
	{ label: 'single (categoriesList)', value: 'single' },
	{ label: 'multiple (categorySuggestions)', value: 'multiple' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		order,
		orderBy,
		numberOfItems,
		minItems,
		maxItems,
		selectedAuthorId,
		selectedCategoryId,
		selectedCategoryNames,
		categoryMode,
		showOrder,
		showAuthor,
		showNumberOfItems,
		customOrderByOptions,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const queryProps = {
		minItems,
		maxItems,
		numberOfItems,
		order,
		orderBy,
		selectedAuthorId: selectedAuthorId
			? Number( selectedAuthorId )
			: undefined,
		authorList: AUTHORS,
		...( customOrderByOptions
			? { orderByOptions: CUSTOM_ORDER_BY_OPTIONS }
			: {} ),
		...( showOrder
			? {
					onOrderChange: ( next ) => setAttributes( { order: next } ),
					onOrderByChange: ( next ) =>
						setAttributes( { orderBy: next } ),
				}
			: {} ),
		...( showAuthor
			? {
					onAuthorChange: ( next ) =>
						setAttributes( { selectedAuthorId: next } ),
				}
			: {} ),
		...( showNumberOfItems
			? {
					onNumberOfItemsChange: ( next ) =>
						setAttributes( { numberOfItems: next ?? minItems } ),
				}
			: {} ),
		...( categoryMode === 'single'
			? {
					categoriesList: CATEGORIES,
					selectedCategoryId: selectedCategoryId
						? Number( selectedCategoryId )
						: undefined,
					onCategoryChange: ( next ) =>
						setAttributes( { selectedCategoryId: next } ),
				}
			: {
					categorySuggestions: CATEGORY_SUGGESTIONS,
					selectedCategories: selectedCategoryNames
						.map( ( name ) => CATEGORY_SUGGESTIONS[ name ] )
						.filter( Boolean ),
					onCategoryChange: ( tokens ) =>
						setAttributes( {
							selectedCategoryNames: tokens
								.map( ( token ) =>
									typeof token === 'string'
										? token
										: token.value
								)
								.filter(
									( name ) => CATEGORY_SUGGESTIONS[ name ]
								),
						} ),
				} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'QueryControls', 'component-kitchen-sink' ) }
				>
					<QueryControls key={ categoryMode } { ...queryProps } />
					<SelectControl
						label="categoriesList / categorySuggestions"
						value={ categoryMode }
						options={ CATEGORY_MODE_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { categoryMode: next } )
						}
					/>
					<ToggleControl
						label="onOrderChange / onOrderByChange"
						checked={ showOrder }
						onChange={ ( next ) =>
							setAttributes( { showOrder: next } )
						}
					/>
					<ToggleControl
						label="orderByOptions"
						help={ __(
							'Use a custom list of order options.',
							'component-kitchen-sink'
						) }
						checked={ customOrderByOptions }
						onChange={ ( next ) =>
							setAttributes( { customOrderByOptions: next } )
						}
					/>
					<ToggleControl
						label="onAuthorChange"
						checked={ showAuthor }
						onChange={ ( next ) =>
							setAttributes( { showAuthor: next } )
						}
					/>
					<ToggleControl
						label="onNumberOfItemsChange"
						checked={ showNumberOfItems }
						onChange={ ( next ) =>
							setAttributes( { showNumberOfItems: next } )
						}
					/>
					<TextControl
						label="minItems"
						type="number"
						value={ minItems }
						onChange={ ( next ) =>
							setAttributes( { minItems: Number( next ) || 0 } )
						}
					/>
					<TextControl
						label="maxItems"
						type="number"
						value={ maxItems }
						onChange={ ( next ) =>
							setAttributes( { maxItems: Number( next ) || 1 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>QueryControls</h3>
				<QueryControls
					key={ `${ categoryMode }-canvas` }
					{ ...queryProps }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
