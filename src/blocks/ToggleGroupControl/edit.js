import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const SIZE_OPTIONS = [ 'default', '__unstable-large' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

const OPTIONS = [
	{ value: 'left', label: 'Left' },
	{ value: 'center', label: 'Center' },
	{ value: 'right', label: 'Right' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		label,
		help,
		hideLabelFromVision,
		isAdaptiveWidth,
		isBlock,
		isDeselectable,
		disabled,
		size,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const groupProps = {
		label,
		help: help || undefined,
		hideLabelFromVision,
		isAdaptiveWidth,
		isBlock,
		isDeselectable,
		disabled,
		size,
		value: value || undefined,
		onChange: ( next ) => setAttributes( { value: String( next ?? '' ) } ),
	};

	const renderGroup = () => (
		<ToggleGroupControl { ...groupProps }>
			{ OPTIONS.map( ( option ) => (
				<ToggleGroupControlOption
					key={ option.value }
					value={ option.value }
					label={ option.label }
				/>
			) ) }
		</ToggleGroupControl>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'ToggleGroupControl',
						'component-kitchen-sink'
					) }
				>
					{ renderGroup() }
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
					<ToggleControl
						label="isAdaptiveWidth"
						checked={ isAdaptiveWidth }
						onChange={ ( next ) =>
							setAttributes( { isAdaptiveWidth: next } )
						}
					/>
					<ToggleControl
						label="isBlock"
						checked={ isBlock }
						onChange={ ( next ) =>
							setAttributes( { isBlock: next } )
						}
					/>
					<ToggleControl
						label="isDeselectable"
						checked={ isDeselectable }
						onChange={ ( next ) =>
							setAttributes( { isDeselectable: next } )
						}
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ToggleGroupControl</h3>
				{ renderGroup() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
