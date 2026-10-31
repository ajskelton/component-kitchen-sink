import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Notice,
	PanelBody,
	Placeholder,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { cog, check, image, starFilled, wordpress } from '@wordpress/icons';
import './editor.scss';

const ICONS = { cog, check, image, starFilled, wordpress };

const ICON_OPTIONS = [
	{ label: __( 'None', 'component-kitchen-sink' ), value: '' },
	...Object.keys( ICONS ).map( ( key ) => ( { label: key, value: key } ) ),
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		label,
		instructions,
		icon,
		isColumnLayout,
		withIllustration,
		showNotices,
		showPreview,
		showChildren,
	} = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	const placeholderProps = {
		label,
		instructions,
		icon: ICONS[ icon ],
		isColumnLayout,
		withIllustration,
		notices: showNotices ? (
			<Notice status="warning" isDismissible={ false }>
				{ __(
					'A notice passed through the notices prop.',
					'component-kitchen-sink'
				) }
			</Notice>
		) : undefined,
		preview: showPreview ? (
			<div style={ { padding: 12, background: '#f0f0f0' } }>
				{ __(
					'A preview passed through the preview prop.',
					'component-kitchen-sink'
				) }
			</div>
		) : undefined,
	};

	const children = showChildren ? (
		<>
			<TextControl
				label={ __( 'Child field', 'component-kitchen-sink' ) }
				value=""
				onChange={ () => {} }
			/>
			<Button variant="primary">
				{ __( 'Child button', 'component-kitchen-sink' ) }
			</Button>
		</>
	) : undefined;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Placeholder', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="label"
						value={ label }
						onChange={ set( 'label' ) }
					/>
					<TextControl
						label="instructions"
						value={ instructions }
						onChange={ set( 'instructions' ) }
					/>
					<SelectControl
						label="icon"
						value={ icon }
						options={ ICON_OPTIONS }
						onChange={ set( 'icon' ) }
					/>
					<ToggleControl
						label="isColumnLayout"
						checked={ isColumnLayout }
						onChange={ set( 'isColumnLayout' ) }
					/>
					<ToggleControl
						label="withIllustration"
						checked={ withIllustration }
						onChange={ set( 'withIllustration' ) }
					/>
					<ToggleControl
						label="notices"
						checked={ showNotices }
						onChange={ set( 'showNotices' ) }
					/>
					<ToggleControl
						label="preview"
						checked={ showPreview }
						onChange={ set( 'showPreview' ) }
					/>
					<ToggleControl
						label="children"
						checked={ showChildren }
						onChange={ set( 'showChildren' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Placeholder</h3>
				<Placeholder { ...placeholderProps }>{ children }</Placeholder>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
