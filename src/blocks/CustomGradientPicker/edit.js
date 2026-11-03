import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	CustomGradientPicker,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { value, enableAlpha, isRenderedInSidebar } = attributes;

	// An empty attribute means "no gradient selected", which the component
	// expects as `null`.
	const pickerProps = {
		value: value || null,
		enableAlpha,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'CustomGradientPicker',
						'component-kitchen-sink'
					) }
				>
					<CustomGradientPicker
						{ ...pickerProps }
						__experimentalIsRenderedInSidebar={
							isRenderedInSidebar
						}
					/>
					<ToggleControl
						label="enableAlpha"
						checked={ enableAlpha }
						onChange={ ( next ) =>
							setAttributes( { enableAlpha: next } )
						}
					/>
					<ToggleControl
						label="__experimentalIsRenderedInSidebar"
						checked={ isRenderedInSidebar }
						onChange={ ( next ) =>
							setAttributes( { isRenderedInSidebar: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { value: '' } ) }
					>
						{ __( 'Set value to null', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>CustomGradientPicker</h3>
				<div
					style={ {
						background: value || undefined,
						height: 48,
						marginBottom: 16,
						border: '1px solid #ccc',
					} }
				/>
				<CustomGradientPicker { ...pickerProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
