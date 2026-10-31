import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const {
		label,
		help,
		hideLabelFromVision,
		className,
		useVisualLabel,
		inputValue,
	} = attributes;
	const instanceId = useInstanceId( Edit, 'ajs-base-control' );

	const renderControl = ( id ) => (
		<BaseControl
			id={ id }
			label={ useVisualLabel ? undefined : label }
			help={ help }
			hideLabelFromVision={ hideLabelFromVision }
			className={ className }
		>
			{ useVisualLabel && (
				<BaseControl.VisualLabel>{ label }</BaseControl.VisualLabel>
			) }
			{ /* BaseControl wraps any control; a bare input is enough. */ }
			<input
				id={ id }
				type="text"
				value={ inputValue }
				aria-describedby={ help ? `${ id }__help` : undefined }
				onChange={ ( event ) =>
					setAttributes( { inputValue: event.target.value } )
				}
			/>
		</BaseControl>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BaseControl', 'component-kitchen-sink' ) }
				>
					{ renderControl( `${ instanceId }-preview` ) }
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="help"
						value={ help }
						onChange={ ( next ) => setAttributes( { help: next } ) }
					/>
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
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
						label="BaseControl.VisualLabel"
						help={ __(
							'Render the label with BaseControl.VisualLabel instead of the label prop.',
							'component-kitchen-sink'
						) }
						checked={ useVisualLabel }
						onChange={ ( next ) =>
							setAttributes( { useVisualLabel: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { inputValue: '' } ) }
					>
						{ __( 'Clear input', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BaseControl</h3>
				{ renderControl( `${ instanceId }-canvas` ) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
