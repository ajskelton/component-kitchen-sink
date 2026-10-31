import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	URLInput,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

const SUGGESTIONS = [
	{ id: 1, type: 'post', subtype: 'page', title: 'About us', url: '/about' },
	{
		id: 2,
		type: 'post',
		subtype: 'post',
		title: 'Hello world',
		url: '/hello-world',
	},
	{ id: 3, type: 'term', subtype: 'category', title: 'News', url: '/news' },
];

// A static search handler so the block works without the editor's link
// suggestion endpoint.
const fetchSuggestions = ( search ) =>
	Promise.resolve(
		SUGGESTIONS.filter( ( suggestion ) =>
			suggestion.title.toLowerCase().includes( search.toLowerCase() )
		)
	);

export default function Edit( { attributes, setAttributes } ) {
	const {
		url,
		label,
		placeholder,
		className,
		disableSuggestions,
		useStaticSuggestions,
		showInitialSuggestions,
		hideLabelFromVision,
		disabled,
		required,
		selectedTitle,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const urlInputProps = {
		value: url,
		label,
		placeholder,
		className: className || undefined,
		disableSuggestions,
		__experimentalFetchLinkSuggestions: useStaticSuggestions
			? fetchSuggestions
			: undefined,
		__experimentalShowInitialSuggestions: showInitialSuggestions,
		hideLabelFromVision,
		disabled,
		required,
		onChange: ( next, post ) =>
			setAttributes( { url: next, selectedTitle: post?.title ?? '' } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'URLInput', 'component-kitchen-sink' ) }>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="placeholder"
						value={ placeholder }
						onChange={ ( next ) =>
							setAttributes( { placeholder: next } )
						}
					/>
					<TextControl
						label="className"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
					<ToggleControl
						label="disableSuggestions"
						checked={ disableSuggestions }
						onChange={ ( next ) =>
							setAttributes( { disableSuggestions: next } )
						}
					/>
					<ToggleControl
						label="__experimentalFetchLinkSuggestions (static list)"
						checked={ useStaticSuggestions }
						help={ __(
							'Off uses the editor setting, which searches the site.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { useStaticSuggestions: next } )
						}
					/>
					<ToggleControl
						label="__experimentalShowInitialSuggestions"
						checked={ showInitialSuggestions }
						onChange={ ( next ) =>
							setAttributes( { showInitialSuggestions: next } )
						}
					/>
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
						}
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
					<ToggleControl
						label="required"
						checked={ required }
						onChange={ ( next ) =>
							setAttributes( { required: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>URLInput</h3>
				<URLInput { ...urlInputProps } />
				<p>{ selectedTitle && `Selected: ${ selectedTitle }` }</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
