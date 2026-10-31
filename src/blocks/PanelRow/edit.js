import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Panel,
	PanelBody,
	PanelRow,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { className, childCount, label } = attributes;

	// PanelRow is a flex row: each child sits side by side.
	const demo = (
		<Panel>
			<PanelBody title={ __( 'PanelBody', 'component-kitchen-sink' ) }>
				<PanelRow className={ className || undefined }>
					{ Array.from( { length: childCount }, ( _, index ) => (
						<TextControl
							key={ index }
							label={ `${ label } ${ index + 1 }` }
							value=""
							onChange={ () => {} }
						/>
					) ) }
				</PanelRow>
			</PanelBody>
		</Panel>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'PanelRow', 'component-kitchen-sink' ) }>
					<TextControl
						label="className"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
					<RangeControl
						label="children (fields in the row)"
						value={ childCount }
						min={ 1 }
						max={ 4 }
						onChange={ ( next ) =>
							setAttributes( { childCount: next ?? 2 } )
						}
					/>
					<TextControl
						label={ __( 'Child label', 'component-kitchen-sink' ) }
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>PanelRow</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
