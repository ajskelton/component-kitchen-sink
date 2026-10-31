import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalBlockAlignmentMatrixControl as BlockAlignmentMatrixControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	BaseControl,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const POSITIONS = [
	'top left',
	'top center',
	'top right',
	'center left',
	'center center',
	'center right',
	'bottom left',
	'bottom center',
	'bottom right',
];

const VALUE_OPTIONS = POSITIONS.map( ( position ) => ( {
	label: position,
	value: position,
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const { value, label, isDisabled } = attributes;

	// Every prop exercised by this block, shared by toolbar and inspector.
	const controlProps = {
		value,
		onChange: ( next ) => setAttributes( { value: next } ),
		label: label || undefined,
		isDisabled,
	};

	const [ vertical, horizontal ] = value.split( ' ' );
	const justify = { left: 'flex-start', center: 'center', right: 'flex-end' };
	const align = { top: 'flex-start', center: 'center', bottom: 'flex-end' };

	return (
		<>
			<BlockControls group="block">
				<BlockAlignmentMatrixControl { ...controlProps } />
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockAlignmentMatrixControl',
						'component-kitchen-sink'
					) }
				>
					<BaseControl
						id="ajs-block-alignment-matrix-control-mirror"
						label={ __(
							'Mirror of the toolbar control',
							'component-kitchen-sink'
						) }
					>
						<div>
							<BlockAlignmentMatrixControl { ...controlProps } />
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
				<h3>BlockAlignmentMatrixControl</h3>
				{ /* The control lives in the block toolbar; the box shows where content lands. */ }
				<div
					style={ {
						display: 'flex',
						height: 80,
						border: '1px dashed currentColor',
						justifyContent: justify[ horizontal ],
						alignItems: align[ vertical ],
					} }
				>
					<span>{ value }</span>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
