import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Card,
	CardBody,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const SIZE_OPTIONS = [ 'none', 'xSmall', 'small', 'medium', 'large' ].map(
	( value ) => ( { label: value, value } )
);

export default function Edit( { attributes, setAttributes } ) {
	const { size, isShady, isScrollable, paragraphs } = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	const bodyProps = { size, isShady, isScrollable };

	// CardBody only scrolls when its height is constrained, so the demo caps
	// it with `style` when isScrollable is on.
	const demo = (
		<Card>
			<CardBody
				{ ...bodyProps }
				style={ isScrollable ? { maxHeight: 120 } : undefined }
			>
				{ Array.from( { length: paragraphs }, ( _, index ) => (
					<p key={ index }>
						{ __( 'CardBody paragraph', 'component-kitchen-sink' ) }{ ' ' }
						{ index + 1 }.
					</p>
				) ) }
			</CardBody>
		</Card>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'CardBody', 'component-kitchen-sink' ) }>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ set( 'size' ) }
					/>
					<ToggleControl
						label="isShady"
						checked={ isShady }
						onChange={ set( 'isShady' ) }
					/>
					<ToggleControl
						label="isScrollable"
						help={ __(
							'The demo caps the body at 120px so it can scroll.',
							'component-kitchen-sink'
						) }
						checked={ isScrollable }
						onChange={ set( 'isScrollable' ) }
					/>
					<RangeControl
						label="children (paragraphs)"
						value={ paragraphs }
						min={ 1 }
						max={ 12 }
						onChange={ ( next ) =>
							setAttributes( { paragraphs: next ?? 6 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>CardBody</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
