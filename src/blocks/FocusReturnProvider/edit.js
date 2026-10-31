import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	FocusReturnProvider,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { enabled, text } = attributes;

	// FocusReturnProvider is deprecated since 5.7 and now just renders its
	// children (it logs a deprecation notice). Toggling it must not change
	// the output, which is what this block demonstrates.
	const demo = (
		<TextControl
			label={ __(
				'Child of FocusReturnProvider',
				'component-kitchen-sink'
			) }
			value={ text }
			onChange={ ( next ) => setAttributes( { text: next } ) }
		/>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'FocusReturnProvider',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="wrap child in FocusReturnProvider"
						checked={ enabled }
						onChange={ ( next ) =>
							setAttributes( { enabled: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>FocusReturnProvider</h3>
				{ enabled ? (
					<FocusReturnProvider>{ demo }</FocusReturnProvider>
				) : (
					demo
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
