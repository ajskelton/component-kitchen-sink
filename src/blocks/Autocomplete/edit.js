import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Autocomplete,
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import './editor.scss';

const FRUITS = [
	{ name: 'Apple', icon: '🍎' },
	{ name: 'Banana', icon: '🍌' },
	{ name: 'Cherry', icon: '🍒' },
	{ name: 'Grape', icon: '🍇' },
	{ name: 'Lemon', icon: '🍋' },
];

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
 * Builds the minimal RichTextValue-shaped record that Autocomplete reads.
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
	const { text, triggerPrefix, isDebounced } = attributes;
	const contentRef = useRef( null );
	const [ caret, setCaret ] = useState( text.length );
	const [ isSelected, setIsSelected ] = useState( false );

	// Keep the editable element in sync when the attribute changes elsewhere
	// (undo, reset button).
	useEffect( () => {
		const element = contentRef.current;
		if ( element && element.textContent !== text ) {
			element.textContent = text;
		}
	}, [ text ] );

	const completers = useMemo(
		() => [
			{
				name: 'fruits',
				triggerPrefix: triggerPrefix || '~',
				isDebounced,
				options: FRUITS,
				getOptionKeywords: ( fruit ) => [ fruit.name ],
				getOptionLabel: ( fruit ) => (
					<span>
						{ fruit.icon } { fruit.name }
					</span>
				),
				getOptionCompletion: ( fruit ) => `${ fruit.name } `,
			},
		],
		[ triggerPrefix, isDebounced ]
	);

	const syncFromElement = () => {
		const element = contentRef.current;
		if ( ! element ) {
			return;
		}
		setCaret( getCaretOffset( element ) );
		if ( element.textContent !== text ) {
			setAttributes( { text: element.textContent } );
		}
	};

	// Every prop exercised by this block.
	const autocompleteProps = {
		record: toRecord( text, caret ),
		completers,
		contentRef,
		isSelected,
		onChange: ( next ) => {
			setAttributes( { text: next.text } );
			setCaret( next.start );
			const element = contentRef.current;
			if ( element ) {
				element.textContent = next.text;
				setCaretOffset( element, next.start );
			}
		},
		onReplace: () => {},
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Autocomplete', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="completers[0].triggerPrefix"
						value={ triggerPrefix }
						maxLength={ 1 }
						onChange={ ( next ) =>
							setAttributes( { triggerPrefix: next || '~' } )
						}
					/>
					<ToggleControl
						label="completers[0].isDebounced"
						checked={ isDebounced }
						onChange={ ( next ) =>
							setAttributes( { isDebounced: next } )
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
				<h3>Autocomplete</h3>
				<p>
					{ __(
						'Type the trigger prefix',
						'component-kitchen-sink'
					) }{ ' ' }
					<code>{ triggerPrefix }</code>{ ' ' }
					{ __(
						'then a fruit name in the box below.',
						'component-kitchen-sink'
					) }
				</p>
				<Autocomplete { ...autocompleteProps }>
					{ ( { listBoxId, activeId, onKeyDown } ) => (
						<div
							ref={ contentRef }
							role="textbox"
							tabIndex={ 0 }
							aria-multiline="true"
							aria-label={ __(
								'Autocomplete editable text',
								'component-kitchen-sink'
							) }
							aria-autocomplete={ listBoxId ? 'list' : undefined }
							aria-controls={ listBoxId }
							aria-activedescendant={ activeId ?? undefined }
							contentEditable
							suppressContentEditableWarning
							style={ {
								border: '1px solid #949494',
								borderRadius: 2,
								minHeight: '3em',
								padding: 8,
							} }
							onKeyDown={ ( event ) =>
								onKeyDown( event.nativeEvent )
							}
							onInput={ syncFromElement }
							onKeyUp={ syncFromElement }
							onClick={ syncFromElement }
							onFocus={ () => setIsSelected( true ) }
							onBlur={ () => setIsSelected( false ) }
						/>
					) }
				</Autocomplete>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
