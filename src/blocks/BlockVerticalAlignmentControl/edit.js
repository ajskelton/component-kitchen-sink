import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	BlockVerticalAlignmentControl,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

const VALUE_OPTIONS = [
	{ label: __( 'Unset', 'component-kitchen-sink' ), value: '' },
	{ label: 'top', value: 'top' },
	{ label: 'center', value: 'center' },
	{ label: 'bottom', value: 'bottom' },
	{ label: 'stretch', value: 'stretch' },
	{ label: 'space-between', value: 'space-between' },
];

const CONTROLS_OPTIONS = [
	{ label: 'default (top, center, bottom)', value: 'default' },
	{ label: 'all five', value: 'all' },
	{ label: 'stretch and space-between', value: 'distribute' },
];

const CONTROLS = {
	default: undefined,
	all: [ 'top', 'center', 'bottom', 'stretch', 'space-between' ],
	distribute: [ 'stretch', 'space-between' ],
};

const ALIGN_ITEMS = {
	top: 'flex-start',
	center: 'center',
	bottom: 'flex-end',
	stretch: 'stretch',
};

export default function Edit( { attributes, setAttributes } ) {
	const { value, label, controlsSet } = attributes;

	// Every prop exercised by this block, shared by toolbar and inspector.
	const controlProps = {
		value: value || undefined,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		controls: CONTROLS[ controlsSet ],
		label: label || undefined,
	};

	return (
		<>
			<BlockControls group="block">
				<BlockVerticalAlignmentControl { ...controlProps } />
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockVerticalAlignmentControl',
						'component-kitchen-sink'
					) }
				>
					<BaseControl
						id="ajs-block-vertical-alignment-control-mirror"
						label={ __(
							'Mirror of the toolbar control',
							'component-kitchen-sink'
						) }
					>
						<div>
							<BlockVerticalAlignmentControl
								{ ...controlProps }
							/>
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
						label="controls"
						value={ controlsSet }
						options={ CONTROLS_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { controlsSet: next } )
						}
					/>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockVerticalAlignmentControl</h3>
				{ /* The control lives in the block toolbar; the box shows the vertical placement. */ }
				<div
					style={ {
						display: 'flex',
						height: 80,
						border: '1px dashed currentColor',
						alignItems: ALIGN_ITEMS[ value ],
						justifyContent:
							value === 'space-between'
								? 'space-between'
								: undefined,
						flexDirection:
							value === 'space-between' ? 'column' : undefined,
					} }
				>
					<span>{ value || 'unset' }</span>
					{ value === 'space-between' && <span>end</span> }
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
