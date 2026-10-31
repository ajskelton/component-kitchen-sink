import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	CustomSelectControl,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const OPTIONS = [
	{
		key: 'small',
		name: 'Small',
		style: { fontSize: '12px' },
		hint: '12px',
	},
	{
		key: 'normal',
		name: 'Normal',
		style: { fontSize: '16px' },
		hint: '16px',
	},
	{
		key: 'large',
		name: 'Large',
		style: { fontSize: '24px' },
		hint: '24px',
	},
];

const SIZE_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: 'small', value: 'small' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		value,
		label,
		describedBy,
		hideLabelFromVision,
		size,
		showSelectedHint,
		unconstrainedWidth,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const selectProps = {
		label,
		describedBy: describedBy || undefined,
		hideLabelFromVision,
		size,
		showSelectedHint,
		__nextUnconstrainedWidth: unconstrainedWidth,
		options: OPTIONS,
		value: OPTIONS.find( ( option ) => option.key === value ),
		onChange: ( { selectedItem } ) =>
			setAttributes( { value: selectedItem.key } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'CustomSelectControl',
						'component-kitchen-sink'
					) }
				>
					<CustomSelectControl { ...selectProps } />
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="describedBy"
						value={ describedBy }
						onChange={ ( next ) =>
							setAttributes( { describedBy: next } )
						}
					/>
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
						}
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<ToggleControl
						label="showSelectedHint"
						checked={ showSelectedHint }
						onChange={ ( next ) =>
							setAttributes( { showSelectedHint: next } )
						}
					/>
					<ToggleControl
						label="__nextUnconstrainedWidth"
						checked={ unconstrainedWidth }
						onChange={ ( next ) =>
							setAttributes( { unconstrainedWidth: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>CustomSelectControl</h3>
				<CustomSelectControl { ...selectProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
