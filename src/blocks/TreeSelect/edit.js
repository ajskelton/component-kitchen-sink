import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	TreeSelect,
} from '@wordpress/components';
import './editor.scss';

const TREE = [
	{
		name: 'Page 1',
		id: 'p1',
		children: [
			{ name: 'Descend 1 of page 1', id: 'p11' },
			{ name: 'Descend 2 of page 1', id: 'p12' },
		],
	},
	{
		name: 'Page 2',
		id: 'p2',
		children: [
			{
				name: 'Descend 1 of page 2',
				id: 'p21',
				children: [
					{ name: 'Descend 1 of Descend 1 of page 2', id: 'p211' },
				],
			},
		],
	},
];

const SIZE_OPTIONS = [ 'default', 'small', 'compact' ].map( ( value ) => ( {
	label: value,
	value,
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		selectedId,
		label,
		help,
		noOptionLabel,
		hideLabelFromVision,
		disabled,
		size,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const treeProps = {
		label,
		help: help || undefined,
		noOptionLabel,
		hideLabelFromVision,
		disabled,
		size,
		tree: TREE,
		selectedId,
		onChange: ( next ) => setAttributes( { selectedId: next } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'TreeSelect', 'component-kitchen-sink' ) }
				>
					<TreeSelect { ...treeProps } />
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
					<TextControl
						label="noOptionLabel"
						value={ noOptionLabel }
						onChange={ ( next ) =>
							setAttributes( { noOptionLabel: next } )
						}
					/>
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
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
				<h3>TreeSelect</h3>
				<TreeSelect { ...treeProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
