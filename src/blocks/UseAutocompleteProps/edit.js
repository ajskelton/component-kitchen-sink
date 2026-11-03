import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	__unstableUseAutocompleteProps as useAutocompleteProps,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { useMergeRefs } from '@wordpress/compose';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import './editor.scss';

const SETS = {
	colors: [
		{ name: 'Red', icon: '🟥' },
		{ name: 'Green', icon: '🟩' },
		{ name: 'Blue', icon: '🟦' },
		{ name: 'Yellow', icon: '🟨' },
	],
	animals: [
		{ name: 'Cat', icon: '🐈' },
		{ name: 'Dog', icon: '🐕' },
		{ name: 'Fox', icon: '🦊' },
		{ name: 'Owl', icon: '🦉' },
	],
};

const SET_OPTIONS = Object.keys( SETS ).map( ( key ) => ( {
	label: key,
	value: key,
} ) );

/**
 * Returns the caret offset (in characters) inside a contenteditable element.
 *
 * @param {HTMLElement} element Editable element.
 * @return {number} Caret offset, or the text length when there is no selection.
 */
function getCaretOffset( element ) {
	const selection = element.ownerDocument.defaultView.getSelection();
	if ( ! selection || selection.rangeCount === 0 ) {
		return element.textContent.length;
	}
	const range = selection.getRangeAt( 0 );
	if ( ! element.contains( range.endContainer ) ) {
		return element.textContent.length;
	}
	const before = range.cloneRange();
	before.selectNodeContents( element );
	before.setEnd( range.endContainer, range.endOffset );
	return before.toString().length;
}

/**
 * Moves the caret to a character offset inside a contenteditable element.
 *
 * @param {HTMLElement} element Editable element.
 * @param {number}      offset  Character offset.
 */
function setCaretOffset( element, offset ) {
	const doc = element.ownerDocument;
	const range = doc.createRange();
	const textNode = element.firstChild;
	if ( textNode ) {
		range.setStart( textNode, Math.min( offset, textNode.length ) );
	} else {
		range.setStart( element, 0 );
	}
	range.collapse( true );
	const selection = doc.defaultView.getSelection();
	selection.removeAllRanges();
	selection.addRange( range );
}

/**
 * Builds the minimal RichTextValue-shaped record the hook reads.
 *
 * @param {string} text  Plain text.
 * @param {number} caret Caret offset.
 * @return {Object} Record with text, formats, replacements, start and end.
 */
function toRecord( text, caret ) {
	return {
		text,
		formats: new Array( text.length ),
		replacements: new Array( text.length ),
		start: caret,
		end: caret,
	};
}

export default function Edit( { attributes, setAttributes } ) {
	const { text, triggerPrefix, optionSet } = attributes;
	const [ caret, setCaret ] = useState( text.length );

	const completers = useMemo(
		() => [
			{
				name: 'demo',
				triggerPrefix: triggerPrefix || '#',
				options: SETS[ optionSet ] ?? SETS.colors,
				getOptionKeywords: ( option ) => [ option.name ],
				getOptionLabel: ( option ) => (
					<span>
						{ option.icon } { option.name }
					</span>
				),
				getOptionCompletion: ( option ) => `${ option.name } `,
			},
		],
		[ triggerPrefix, optionSet ]
	);

	// The hook returns a `ref` (it owns the popover anchor), the ARIA props and,
	// once the user has typed, the popover element as `children`. That `ref` is
	// a merged callback ref, not a ref object, so keep our own object ref to the
	// element and merge both onto it.
	const elementRef = useRef( null );
	const {
		ref: hookRef,
		children: popover,
		...ariaProps
	} = useAutocompleteProps( {
		record: toRecord( text, caret ),
		completers,
		onChange: ( next ) => {
			setAttributes( { text: next.text } );
			setCaret( next.start );
			const element = elementRef.current;
			if ( element ) {
				element.textContent = next.text;
				setCaretOffset( element, next.start );
			}
		},
		onReplace: () => {},
	} );

	const mergedRef = useMergeRefs( [ hookRef, elementRef ] );

	// Keep the editable element in sync when the attribute changes elsewhere.
	useEffect( () => {
		const element = elementRef.current;
		if ( element && element.textContent !== text ) {
			element.textContent = text;
		}
	}, [ text ] );

	const syncFromElement = ( event ) => {
		const element = event.currentTarget;
		setCaret( getCaretOffset( element ) );
		if ( element.textContent !== text ) {
			setAttributes( { text: element.textContent } );
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'useAutocompleteProps',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="completers[0].triggerPrefix"
						value={ triggerPrefix }
						maxLength={ 1 }
						onChange={ ( next ) =>
							setAttributes( { triggerPrefix: next || '#' } )
						}
					/>
					<SelectControl
						label="completers[0].options"
						value={ optionSet }
						options={ SET_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { optionSet: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { text: '' } ) }
					>
						{ __( 'Clear text', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useAutocompleteProps</h3>
				<p>
					{ __(
						'Type the trigger prefix',
						'component-kitchen-sink'
					) }{ ' ' }
					<code>{ triggerPrefix }</code>{ ' ' }
					{ __(
						'then a name in the box below.',
						'component-kitchen-sink'
					) }
				</p>
				<div
					ref={ mergedRef }
					{ ...ariaProps }
					role="textbox"
					tabIndex={ 0 }
					aria-multiline="true"
					aria-label={ __(
						'useAutocompleteProps editable text',
						'component-kitchen-sink'
					) }
					contentEditable
					suppressContentEditableWarning
					style={ {
						border: '1px solid #949494',
						borderRadius: 2,
						minHeight: '3em',
						padding: 8,
					} }
					onInput={ syncFromElement }
					onKeyUp={ syncFromElement }
					onClick={ syncFromElement }
				/>
				{ popover }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
