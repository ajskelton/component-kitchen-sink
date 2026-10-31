import { __ } from '@wordpress/i18n';
import {
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const VALUE_OPTIONS = [
	{ label: __( 'Unset', 'component-kitchen-sink' ), value: '' },
	{ label: 'left', value: 'left' },
	{ label: 'center', value: 'center' },
	{ label: 'right', value: 'right' },
	{ label: 'wide', value: 'wide' },
	{ label: 'full', value: 'full' },
];

const CONTROLS_OPTIONS = [
	{ label: 'default (all alignments)', value: 'default' },
	{ label: 'left, center, right', value: 'inline' },
	{ label: 'wide, full', value: 'wide-full' },
];

const CONTROLS = {
	default: undefined,
	inline: [ 'left', 'center', 'right' ],
	'wide-full': [ 'wide', 'full' ],
};

export default function Edit( { attributes, setAttributes } ) {
	const { value, label, description, controlsSet, isCollapsed } = attributes;

	// Every prop exercised by this block, shared by toolbar and inspector.
	const controlProps = {
		value: value || undefined,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		controls: CONTROLS[ controlsSet ],
		label: label || undefined,
		description: description || undefined,
		isCollapsed,
	};

	return (
		<>
			<BlockControls>
				<BlockAlignmentToolbar { ...controlProps } />
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockAlignmentToolbar',
						'component-kitchen-sink'
					) }
				>
					<BaseControl
						id="ajs-block-alignment-toolbar-mirror"
						label={ __(
							'Mirror of the toolbar control',
							'component-kitchen-sink'
						) }
						help={ __(
							'Renders nothing when the current layout offers no alignments.',
							'component-kitchen-sink'
						) }
					>
						<div>
							<BlockAlignmentToolbar { ...controlProps } />
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
					<ToggleControl
						label="isCollapsed"
						checked={ isCollapsed }
						onChange={ ( next ) =>
							setAttributes( { isCollapsed: next } )
						}
					/>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="description"
						value={ description }
						onChange={ ( next ) =>
							setAttributes( { description: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockAlignmentToolbar</h3>
				{ /* The control lives in the block toolbar; the text shows the stored value. */ }
				<p>
					{ __( 'Block alignment:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ value || 'none' }</code>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
