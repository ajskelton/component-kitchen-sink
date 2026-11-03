import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody, SelectControl } from '@wordpress/components';
import './editor.scss';

const INPUT_TYPE_OPTIONS = [
	'deleteContentBackward',
	'formatBold',
	'formatItalic',
	'formatUnderline',
	'insertFromPaste',
	'deleteByCut',
].map( ( value ) => ( { label: value, value } ) );

export default function Edit( { attributes, setAttributes } ) {
	const { content, inputType, handled } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__unstableRichTextInputEvent',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="inputType"
						value={ inputType }
						options={ INPUT_TYPE_OPTIONS }
						help={ __(
							'The InputEvent.inputType the component listens for (beforeinput). deleteContentBackward (Backspace) fires reliably; the format* types rarely reach it because the editor handles those shortcuts itself.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { inputType: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { handled: 0 } ) }
					>
						{ __( 'Reset handled', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>RichTextInputEvent</h3>
				{ /*
				 * The component renders nothing. A format type (format.js)
				 * mounts it while this RichText is focused; each matching input
				 * event increments the `handled` attribute.
				 */ }
				<p>
					{ `${ __(
						'Trigger the input type in the text below',
						'component-kitchen-sink'
					) } (${ inputType }, handled: ${ handled })` }
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
