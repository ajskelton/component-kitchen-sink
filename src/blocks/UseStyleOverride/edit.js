import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useStyleOverride,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { enabled, overrideId, css } = attributes;

	// Adds (or removes, when css is empty) a stylesheet in the editor canvas.
	// Leave the id empty to let the hook generate one.
	const override = {
		id: overrideId || undefined,
		css: enabled ? css : '',
	};
	useStyleOverride( override );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'useStyleOverride', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="css (apply the override)"
						checked={ enabled }
						onChange={ ( next ) =>
							setAttributes( { enabled: next } )
						}
					/>
					<TextControl
						label="id"
						help={ __(
							'Optional. Leave empty to generate one.',
							'component-kitchen-sink'
						) }
						value={ overrideId }
						onChange={ ( next ) =>
							setAttributes( { overrideId: next } )
						}
					/>
					<TextareaControl
						label="css"
						rows={ 8 }
						value={ css }
						onChange={ ( next ) => setAttributes( { css: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useStyleOverride</h3>
				<div className="ajs-style-override-target">
					{ __(
						'This box is styled only through the stylesheet the hook injects into the editor canvas.',
						'component-kitchen-sink'
					) }
				</div>
				<pre>{ JSON.stringify( override, null, 2 ) }</pre>
			</div>
		</>
	);
}
