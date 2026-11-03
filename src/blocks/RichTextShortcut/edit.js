import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

const TYPE_OPTIONS = [
	'primary',
	'primaryShift',
	'primaryAlt',
	'secondary',
	'access',
	'ctrl',
	'alt',
	'ctrlShift',
	'shift',
	'shiftAlt',
].map( ( value ) => ( { label: value, value } ) );

export default function Edit( { attributes, setAttributes } ) {
	const { content, character, type, uses } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'RichTextShortcut', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="character"
						value={ character }
						maxLength={ 1 }
						help={ __(
							'The key that triggers the shortcut. Avoid keys core already binds (b, i, k with primary or primaryShift, u, x): both handlers run and the later one overwrites this one.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( {
								character: next.toLowerCase().slice( 0, 1 ),
							} )
						}
					/>
					<SelectControl
						label="type"
						value={ type }
						options={ TYPE_OPTIONS }
						help={ __(
							'The modifier, e.g. primaryShift is Cmd+Shift on macOS and Ctrl+Shift elsewhere.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) => setAttributes( { type: next } ) }
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { uses: 0 } ) }
					>
						{ __( 'Reset uses', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>RichTextShortcut</h3>
				{ /*
				 * RichTextShortcut renders nothing itself. It is mounted by the
				 * format type registered in format.js while this block's RichText
				 * is focused. Using the shortcut toggles a <mark> format on the
				 * selected text and increments the `uses` attribute.
				 */ }
				<p>
					{ __(
						'Focus the text, then press',
						'component-kitchen-sink'
					) }{ ' ' }
					<code>{ `${ type } + ${ character }` }</code>
					{ ` (uses: ${ uses })` }
				</p>
				<RichText
					identifier="content"
					tagName="p"
					value={ content }
					onChange={ ( next ) => setAttributes( { content: next } ) }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
