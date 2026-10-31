import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
	withConstrainedTabbing,
} from '@wordpress/components';
import './editor.scss';

// Created once at module level, never inside render.
const ConstrainedTabbing = withConstrainedTabbing(
	( { children } ) => children
);

export default function Edit( { attributes, setAttributes } ) {
	const { constrained, first, second } = attributes;

	const form = (
		<div>
			<TextControl
				label="Input 1"
				value={ first }
				onChange={ ( next ) => setAttributes( { first: next } ) }
			/>
			<TextControl
				label="Input 2"
				value={ second }
				onChange={ ( next ) => setAttributes( { second: next } ) }
			/>
			<Button variant="secondary">
				{ __( 'Last tabbable button', 'component-kitchen-sink' ) }
			</Button>
		</div>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'withConstrainedTabbing',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="wrap form in withConstrainedTabbing"
						checked={ constrained }
						help={ __(
							'When on, Tab cycles inside the form and cannot leave it. Click outside to get out.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { constrained: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>withConstrainedTabbing</h3>
				{ constrained ? (
					<ConstrainedTabbing>{ form }</ConstrainedTabbing>
				) : (
					form
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
