import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	MenuGroup,
	MenuItem,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const ITEMS = [ 'First item', 'Second item', 'Third item' ];

export default function Edit( { attributes, setAttributes } ) {
	const { label, hideSeparator, groupClassName, lastClicked } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const groupProps = {
		label: label || undefined,
		hideSeparator,
		className: groupClassName || undefined,
	};

	const items = ITEMS.map( ( item ) => (
		<MenuItem
			key={ item }
			onClick={ () => setAttributes( { lastClicked: item } ) }
		>
			{ item }
		</MenuItem>
	) );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'MenuGroup', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<ToggleControl
						label="hideSeparator"
						checked={ hideSeparator }
						onChange={ ( next ) =>
							setAttributes( { hideSeparator: next } )
						}
					/>
					<TextControl
						label="className"
						value={ groupClassName }
						onChange={ ( next ) =>
							setAttributes( { groupClassName: next } )
						}
					/>
					<p>
						{ __( 'Last clicked item:', 'component-kitchen-sink' ) }{ ' ' }
						{ lastClicked || '-' }
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>MenuGroup</h3>
				{ /* A separator is drawn above every group but the first, so render two. */ }
				<div role="menu" style={ { maxWidth: 280 } }>
					<MenuGroup
						label={ __(
							'Preceding group',
							'component-kitchen-sink'
						) }
					>
						<MenuItem>
							{ __( 'Sibling item', 'component-kitchen-sink' ) }
						</MenuItem>
					</MenuGroup>
					<MenuGroup { ...groupProps }>{ items }</MenuGroup>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
