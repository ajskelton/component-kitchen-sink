import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalUseCustomSides as useCustomSides,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { Button, PanelBody } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { callCount } = attributes;

	// Deprecated since WordPress 6.3 and removed in 6.4: the hook is now a
	// no-op that only logs a deprecation notice and returns undefined.
	const result = useCustomSides();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__experimentalUseCustomSides',
						'component-kitchen-sink'
					) }
				>
					<p>
						{ __(
							'The hook takes no arguments, so there is nothing to configure. The counter only proves that attributes round-trip.',
							'component-kitchen-sink'
						) }
					</p>
					<Button
						variant="secondary"
						onClick={ () =>
							setAttributes( { callCount: callCount + 1 } )
						}
					>
						{ __( 'Count a render', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useCustomSides</h3>
				<p>
					{ __(
						'Deprecated no-op hook. Check the console for the deprecation notice.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>
					{ JSON.stringify(
						{
							returned:
								result === undefined ? 'undefined' : result,
							callCount,
						},
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
