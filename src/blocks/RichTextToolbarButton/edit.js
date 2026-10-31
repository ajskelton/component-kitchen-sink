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
import { ICONS } from './format';
import './editor.scss';

const toOptions = ( values ) =>
	values.map( ( value ) => ( { label: value || '(none)', value } ) );

const ICON_OPTIONS = toOptions( Object.keys( ICONS ) );
const NAME_OPTIONS = toOptions( [ '', 'non-breaking-space' ] );
const SHORTCUT_TYPE_OPTIONS = toOptions( [
	'',
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
] );

export default function Edit( { attributes, setAttributes } ) {
	const {
		content,
		title,
		icon,
		name,
		shortcutType,
		shortcutCharacter,
		clicks,
	} = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'RichTextToolbarButton',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="title"
						value={ title }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
						}
					/>
					<SelectControl
						label="icon"
						value={ icon }
						options={ ICON_OPTIONS }
						onChange={ ( next ) => setAttributes( { icon: next } ) }
					/>
					<SelectControl
						label="name"
						value={ name }
						options={ NAME_OPTIONS }
						help={ __(
							'Empty puts the button in the "More" menu. non-breaking-space targets a named slot in the toolbar itself.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) => setAttributes( { name: next } ) }
					/>
					<SelectControl
						label="shortcutType"
						value={ shortcutType }
						options={ SHORTCUT_TYPE_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { shortcutType: next } )
						}
					/>
					<TextControl
						label="shortcutCharacter"
						value={ shortcutCharacter }
						maxLength={ 1 }
						help={ __(
							'Only shown as a hint on the button; the shortcut itself is RichTextShortcut.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( {
								shortcutCharacter: next
									.toLowerCase()
									.slice( 0, 1 ),
							} )
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
				<h3>RichTextToolbarButton</h3>
				{ /*
				 * RichTextToolbarButton is a Fill, so it shows up in the block
				 * toolbar (format controls) while this RichText is focused. The
				 * format type in format.js renders it.
				 */ }
				<p>
					{ __(
						'Select text below and use the format toolbar (More menu).',
						'component-kitchen-sink'
					) }{ ' ' }
					{ `(clicks: ${ clicks })` }
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
