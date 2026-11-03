import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalBlockFullHeightAligmentControl as BlockFullHeightAligmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	BaseControl,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { isActive, label, isDisabled } = attributes;

	// Every prop exercised by this block, shared by toolbar and inspector.
	const controlProps = {
		isActive,
		onToggle: ( next ) => setAttributes( { isActive: next } ),
		label: label || undefined,
		isDisabled,
	};

	return (
		<>
			<BlockControls group="block">
				<BlockFullHeightAligmentControl { ...controlProps } />
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockFullHeightAligmentControl',
						'component-kitchen-sink'
					) }
				>
					<BaseControl
						id="ajs-block-full-height-aligment-control-mirror"
						label={ __(
							'Mirror of the toolbar control',
							'component-kitchen-sink'
						) }
					>
						<div>
							<BlockFullHeightAligmentControl
								{ ...controlProps }
							/>
						</div>
					</BaseControl>
					<ToggleControl
						label="isActive"
						checked={ isActive }
						onChange={ ( next ) =>
							setAttributes( { isActive: next } )
						}
					/>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<ToggleControl
						label="isDisabled"
						checked={ isDisabled }
						onChange={ ( next ) =>
							setAttributes( { isDisabled: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockFullHeightAligmentControl</h3>
				{ /* The control lives in the block toolbar; the box grows when full height is on. */ }
				<div
					style={ {
						minHeight: isActive ? 160 : 40,
						border: '1px dashed currentColor',
					} }
				>
					{ isActive ? 'full height' : 'natural height' }
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
