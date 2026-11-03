import { __ } from '@wordpress/i18n';
import {
	AlignmentToolbar,
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
import { alignCenter, alignLeft, alignRight } from '@wordpress/icons';
import './editor.scss';

const ALIGN_OPTIONS = [
	{ label: __( 'None', 'component-kitchen-sink' ), value: '' },
	{ label: 'left', value: 'left' },
	{ label: 'center', value: 'center' },
	{ label: 'right', value: 'right' },
];

const CONTROL_SET_OPTIONS = [
	{ label: 'default (left, center, right)', value: 'default' },
	{ label: 'left and right only', value: 'left-right' },
	{ label: 'center only', value: 'center-only' },
];

const LEFT_RIGHT_ONLY = [
	{ icon: alignLeft, title: 'Align text left', align: 'left' },
	{ icon: alignRight, title: 'Align text right', align: 'right' },
];

const CENTER_ONLY = [
	{ icon: alignCenter, title: 'Align text center', align: 'center' },
];

const CONTROL_SETS = {
	default: undefined,
	'left-right': LEFT_RIGHT_ONLY,
	'center-only': CENTER_ONLY,
};

export default function Edit( { attributes, setAttributes } ) {
	const { value, label, description, controlSet, isCollapsed } = attributes;

	// Every prop exercised by this block, shared by toolbar, inspector and canvas.
	const controlProps = {
		value: value || undefined,
		onChange: ( next ) => setAttributes( { value: next ?? '' } ),
		label: label || undefined,
		description: description || undefined,
		alignmentControls: CONTROL_SETS[ controlSet ],
		isCollapsed,
	};

	return (
		<>
			<BlockControls>
				<AlignmentToolbar { ...controlProps } />
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'AlignmentToolbar', 'component-kitchen-sink' ) }
				>
					<BaseControl
						id="ajs-alignment-toolbar-mirror"
						label={ __(
							'Mirror of the toolbar control',
							'component-kitchen-sink'
						) }
					>
						<div>
							<AlignmentToolbar { ...controlProps } />
						</div>
					</BaseControl>
					<SelectControl
						label="value"
						value={ value }
						options={ ALIGN_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { value: next } )
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
					<ToggleControl
						label="isCollapsed"
						checked={ isCollapsed }
						onChange={ ( next ) =>
							setAttributes( { isCollapsed: next } )
						}
					/>
					<SelectControl
						label="alignmentControls"
						value={ controlSet }
						options={ CONTROL_SET_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { controlSet: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>AlignmentToolbar</h3>
				{ /* The control lives in the block toolbar; the text shows its effect. */ }
				<p style={ { textAlign: value || undefined } }>
					{ __(
						'Text aligned by the AlignmentToolbar in the block toolbar.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
