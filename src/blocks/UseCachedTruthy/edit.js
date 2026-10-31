import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useCachedTruthy,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { enabled, input } = attributes;

	// The value handed to the hook: the text, or null while "enabled" is off.
	// An empty text is falsy too.
	const value = enabled ? input : null;

	// Returns the latest truthy value it has seen; falsy values do not replace
	// it.
	const cached = useCachedTruthy( value );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'useCachedTruthy', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="value (null when off)"
						checked={ enabled }
						onChange={ ( next ) =>
							setAttributes( { enabled: next } )
						}
					/>
					<TextControl
						label="value (text)"
						help={ __(
							'Clear the text or turn the toggle off: the returned value stays at the last truthy text.',
							'component-kitchen-sink'
						) }
						value={ input }
						onChange={ ( next ) =>
							setAttributes( { input: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useCachedTruthy</h3>
				<pre>
					{ JSON.stringify(
						{ 'value passed in': value, 'value returned': cached },
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
