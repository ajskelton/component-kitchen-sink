import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	SandBox,
	SelectControl,
	TextareaControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const TYPE_OPTIONS = [
	{ label: '(none)', value: '' },
	{ label: 'wp-embed', value: 'wp-embed' },
	{ label: 'video', value: 'video' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		html,
		title,
		type,
		styles,
		allowSameOrigin,
		allowPopups,
		allowForms,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	// Only static markup and inline CSS: no `scripts` and no remote URLs.
	const sandBoxProps = {
		html,
		title,
		type: type || undefined,
		styles: styles ? [ styles ] : undefined,
		allowSameOrigin,
		allowPopups,
		allowForms,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'SandBox', 'component-kitchen-sink' ) }>
					<TextareaControl
						label="html"
						help={ __(
							'Static markup only. Never load third-party URLs here.',
							'component-kitchen-sink'
						) }
						value={ html }
						onChange={ ( next ) => setAttributes( { html: next } ) }
					/>
					<TextControl
						label="title"
						value={ title }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
						}
					/>
					<SelectControl
						label="type"
						value={ type }
						options={ TYPE_OPTIONS }
						onChange={ ( next ) => setAttributes( { type: next } ) }
					/>
					<TextareaControl
						label="styles (one inline CSS string)"
						value={ styles }
						onChange={ ( next ) =>
							setAttributes( { styles: next } )
						}
					/>
					<ToggleControl
						label="allowSameOrigin"
						checked={ allowSameOrigin }
						onChange={ ( next ) =>
							setAttributes( { allowSameOrigin: next } )
						}
					/>
					<ToggleControl
						label="allowPopups"
						checked={ allowPopups }
						onChange={ ( next ) =>
							setAttributes( { allowPopups: next } )
						}
					/>
					<ToggleControl
						label="allowForms"
						checked={ allowForms }
						onChange={ ( next ) =>
							setAttributes( { allowForms: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>SandBox</h3>
				<SandBox { ...sandBoxProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
