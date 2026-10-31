import { __ } from '@wordpress/i18n';
import {
	Autocomplete,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
// Not direct dependencies: both ship with @wordpress/block-editor and are provided by WordPress at runtime.
/* eslint-disable import/no-extraneous-dependencies */
import { addFilter } from '@wordpress/hooks';
import { create } from '@wordpress/rich-text';
/* eslint-enable import/no-extraneous-dependencies */
import metadata from './block.json';
import './editor.scss';

const FRUITS = [
	{ visual: '🍎', name: 'Apple' },
	{ visual: '🍊', name: 'Orange' },
	{ visual: '🍇', name: 'Grapes' },
	{ visual: '🥭', name: 'Mango' },
	{ visual: '🍓', name: 'Strawberry' },
];

const COLORS = [ 'Red', 'Green', 'Blue', 'Yellow' ];

/*
 * The block-editor Autocomplete passes its completers through the
 * `editor.Autocomplete.completers` filter. Add a second, "#" triggered
 * completer, but only for this block, to exercise that extension point.
 */
addFilter(
	'editor.Autocomplete.completers',
	'ajs/block-editor-autocomplete/colors',
	( completers, blockName ) =>
		blockName === metadata.name
			? [
					...completers,
					{
						name: 'ajs-color',
						triggerPrefix: '#',
						options: COLORS,
						getOptionLabel: ( color ) => `# ${ color }`,
						getOptionKeywords: ( color ) => [ color ],
						getOptionCompletion: ( color ) => `#${ color }`,
					},
				]
			: completers
);

/**
 * Builds the rich text record Autocomplete expects, with the caret position
 * read from the DOM selection.
 *
 * @param {HTMLElement} element The contenteditable element.
 * @return {Object} A rich text value with `start` and `end` set.
 */
function getRecord( element ) {
	const text = element.textContent;
	const selection = element.ownerDocument.defaultView.getSelection();
	let offset = text.length;
	if ( selection.rangeCount && element.contains( selection.anchorNode ) ) {
		const range = selection.getRangeAt( 0 ).cloneRange();
		range.selectNodeContents( element );
		range.setEnd( selection.anchorNode, selection.anchorOffset );
		offset = range.toString().length;
	}
	return { ...create( { text } ), start: offset, end: offset };
}

/**
 * Moves the DOM caret to a text offset inside the element.
 *
 * @param {HTMLElement} element The contenteditable element.
 * @param {number}      offset  Text offset.
 */
function setCaret( element, offset ) {
	const { ownerDocument } = element;
	const range = ownerDocument.createRange();
	const node = element.firstChild;
	if ( node ) {
		range.setStart( node, Math.min( offset, node.textContent.length ) );
	} else {
		range.setStart( element, 0 );
	}
	range.collapse( true );
	const selection = ownerDocument.defaultView.getSelection();
	selection.removeAllRanges();
	selection.addRange( range );
}

export default function Edit( { attributes, setAttributes } ) {
	const { text, triggerPrefix, disableGrapes, isDebounced, insertAsEmoji } =
		attributes;
	const contentRef = useRef();
	const [ record, setRecord ] = useState( () => ( {
		...create( { text } ),
		start: text.length,
		end: text.length,
	} ) );
	const [ isSelected, setIsSelected ] = useState( false );

	// Seed the editable with the saved text once. The DOM owns it afterwards.
	useEffect( () => {
		contentRef.current.textContent = text;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	const completers = useMemo(
		() => [
			{
				name: 'ajs-fruit',
				triggerPrefix: triggerPrefix || '~',
				options: FRUITS,
				getOptionLabel: ( fruit ) =>
					`${ fruit.visual } ${ fruit.name }`,
				getOptionKeywords: ( fruit ) => [ fruit.name ],
				isOptionDisabled: ( fruit ) =>
					disableGrapes && fruit.name === 'Grapes',
				getOptionCompletion: ( fruit ) =>
					insertAsEmoji ? fruit.visual : fruit.name,
				isDebounced,
			},
		],
		[ triggerPrefix, disableGrapes, isDebounced, insertAsEmoji ]
	);

	const syncRecord = () => {
		if ( contentRef.current ) {
			setRecord( getRecord( contentRef.current ) );
		}
	};

	const onChange = ( next ) => {
		// Autocomplete inserted a completion: write it back to the DOM.
		contentRef.current.textContent = next.text;
		setCaret( contentRef.current, next.start );
		setRecord( next );
		setAttributes( { text: next.text } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Autocomplete', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="completer.triggerPrefix"
						value={ triggerPrefix }
						maxLength={ 2 }
						onChange={ ( next ) =>
							setAttributes( { triggerPrefix: next } )
						}
					/>
					<ToggleControl
						label="completer.isOptionDisabled (Grapes)"
						checked={ disableGrapes }
						onChange={ ( next ) =>
							setAttributes( { disableGrapes: next } )
						}
					/>
					<ToggleControl
						label="completer.isDebounced"
						checked={ isDebounced }
						onChange={ ( next ) =>
							setAttributes( { isDebounced: next } )
						}
					/>
					<ToggleControl
						label="completer.getOptionCompletion (emoji)"
						checked={ insertAsEmoji }
						help={ __(
							'Off inserts the fruit name instead of the emoji.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { insertAsEmoji: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Autocomplete (block-editor)</h3>
				<p>
					{ __( 'Type', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ triggerPrefix || '~' }</code>{ ' ' }
					{ __(
						'for fruits, or # for colors (added through the editor.Autocomplete.completers filter).',
						'component-kitchen-sink'
					) }
				</p>
				<Autocomplete
					record={ record }
					onChange={ onChange }
					onReplace={ () => {} }
					completers={ completers }
					contentRef={ contentRef }
					isSelected={ isSelected }
				>
					{ ( { listBoxId, activeId, onKeyDown } ) => (
						<div
							ref={ contentRef }
							className="ajs-autocomplete-editable"
							role="textbox"
							aria-multiline="false"
							aria-label={ __(
								'Autocomplete input',
								'component-kitchen-sink'
							) }
							aria-autocomplete={ listBoxId ? 'list' : undefined }
							aria-controls={ listBoxId }
							aria-activedescendant={ activeId ?? undefined }
							contentEditable
							suppressContentEditableWarning
							tabIndex={ 0 }
							onKeyDown={ onKeyDown }
							onFocus={ () => setIsSelected( true ) }
							onBlur={ () => setIsSelected( false ) }
							onKeyUp={ syncRecord }
							onMouseUp={ syncRecord }
							onInput={ () => {
								syncRecord();
								setAttributes( {
									text: contentRef.current.textContent,
								} );
							} }
						/>
					) }
				</Autocomplete>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
