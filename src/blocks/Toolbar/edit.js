import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	Toolbar,
	ToolbarButton,
} from '@wordpress/components';
import { formatBold, formatItalic, link } from '@wordpress/icons';
import './editor.scss';

const ITEMS = [
	{ key: 'bold', icon: formatBold, label: 'Bold' },
	{ key: 'italic', icon: formatItalic, label: 'Italic' },
	{ key: 'link', icon: link, label: 'Link' },
];

const VARIANT_OPTIONS = [
	{ label: 'undefined', value: '' },
	{ label: 'unstyled', value: 'unstyled' },
];

const ORIENTATION_OPTIONS = [
	{ label: 'horizontal', value: 'horizontal' },
	{ label: 'vertical', value: 'vertical' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { label, variant, orientation, pressed } = attributes;

	// Props shared by the inspector copy and the canvas copy.
	const toolbarProps = {
		label: label || 'Toolbar',
		variant: variant || undefined,
		orientation,
	};

	const renderToolbar = () => (
		<Toolbar { ...toolbarProps }>
			{ ITEMS.map( ( item ) => (
				<ToolbarButton
					key={ item.key }
					icon={ item.icon }
					label={ item.label }
					isActive={ pressed === item.key }
					onClick={ () =>
						setAttributes( {
							pressed: pressed === item.key ? '' : item.key,
						} )
					}
				/>
			) ) }
		</Toolbar>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Toolbar', 'component-kitchen-sink' ) }>
					{ renderToolbar() }
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<SelectControl
						label="variant"
						value={ variant }
						options={ VARIANT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { variant: next } )
						}
					/>
					<SelectControl
						label="orientation"
						value={ orientation }
						options={ ORIENTATION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { orientation: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Toolbar</h3>
				{ renderToolbar() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
