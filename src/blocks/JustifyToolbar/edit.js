import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	JustifyToolbar,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const VALUE_OPTIONS = [
	{ label: __( 'Unset', 'component-kitchen-sink' ), value: '' },
	{ label: 'left', value: 'left' },
	{ label: 'center', value: 'center' },
	{ label: 'right', value: 'right' },
	{ label: 'space-between', value: 'space-between' },
	{ label: 'stretch', value: 'stretch' },
];

const ALLOWED_OPTIONS = [
	{ label: 'default (left, center, right, space-between)', value: 'default' },
	{ label: 'all five', value: 'all' },
	{ label: 'left and right', value: 'left-right' },
];

const ALLOWED_CONTROLS = {
	default: undefined,
	all: [ 'left', 'center', 'right', 'space-between', 'stretch' ],
	'left-right': [ 'left', 'right' ],
};

const JUSTIFY = {
	left: 'flex-start',
	center: 'center',
	right: 'flex-end',
	'space-between': 'space-between',
	stretch: 'stretch',
};

export default function Edit( { attributes, setAttributes } ) {
	const { value, allowedControlsSet, bottomPopover, isCollapsed } =
		attributes;

	// Every prop exercised by this block, shared by toolbar and inspector.
	const controlProps = {
		value: value || undefined,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		allowedControls: ALLOWED_CONTROLS[ allowedControlsSet ],
		popoverProps: bottomPopover ? { placement: 'bottom-start' } : undefined,
		isCollapsed,
	};

	return (
		<>
			<BlockControls>
				<JustifyToolbar { ...controlProps } />
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'JustifyToolbar', 'component-kitchen-sink' ) }
				>
					<BaseControl
						id="ajs-justify-toolbar-mirror"
						label={ __(
							'Mirror of the toolbar control',
							'component-kitchen-sink'
						) }
					>
						<div>
							<JustifyToolbar { ...controlProps } />
						</div>
					</BaseControl>
					<SelectControl
						label="value"
						value={ value }
						options={ VALUE_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { value: next } )
						}
					/>
					<SelectControl
						label="allowedControls"
						value={ allowedControlsSet }
						options={ ALLOWED_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { allowedControlsSet: next } )
						}
					/>
					<ToggleControl
						label="isCollapsed"
						checked={ isCollapsed }
						onChange={ ( next ) =>
							setAttributes( { isCollapsed: next } )
						}
					/>
					<ToggleControl
						label="popoverProps (placement: bottom-start)"
						checked={ bottomPopover }
						onChange={ ( next ) =>
							setAttributes( { bottomPopover: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>JustifyToolbar</h3>
				{ /* The control lives in the block toolbar; the row shows the justification. */ }
				<div
					style={ {
						display: 'flex',
						gap: 8,
						border: '1px dashed currentColor',
						justifyContent: JUSTIFY[ value ],
					} }
				>
					<span>A</span>
					<span>B</span>
					<span>C</span>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
