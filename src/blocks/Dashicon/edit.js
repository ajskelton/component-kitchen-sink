import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Dashicon,
	PanelBody,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import './editor.scss';

const ICON_OPTIONS = [
	'admin-home',
	'admin-users',
	'format-image',
	'heart',
	'star-filled',
	'trash',
	'yes',
	'warning',
].map( ( value ) => ( { label: value, value } ) );

export default function Edit( { attributes, setAttributes } ) {
	const { icon, size } = attributes;

	const dashiconProps = { icon, size };

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Dashicon', 'component-kitchen-sink' ) }>
					<Dashicon { ...dashiconProps } />
					<SelectControl
						label="icon"
						value={ icon }
						options={ ICON_OPTIONS }
						onChange={ ( next ) => setAttributes( { icon: next } ) }
					/>
					<RangeControl
						label="size"
						value={ size }
						min={ 12 }
						max={ 96 }
						onChange={ ( next ) =>
							setAttributes( { size: next ?? 20 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Dashicon</h3>
				<Dashicon { ...dashiconProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
