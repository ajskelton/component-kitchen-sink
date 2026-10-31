import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalTreeGrid as TreeGrid,
	__experimentalTreeGridCell as TreeGridCell,
	__experimentalTreeGridRow as TreeGridRow,
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { withoutGridItem, clicks, text } = attributes;

	const onClick = () => setAttributes( { clicks: clicks + 1 } );

	// With `withoutGridItem` the cell does not wrap its children in a
	// TreeGridItem, so the render prop receives plain td props and no roving
	// tabindex props: focus management is then up to the child.
	const renderTreeGrid = () => (
		<TreeGrid>
			<TreeGridRow level={ 1 } positionInSet={ 1 } setSize={ 1 }>
				{ withoutGridItem ? (
					<TreeGridCell withoutGridItem>
						<Button variant="secondary" onClick={ onClick }>
							{ text }
						</Button>
					</TreeGridCell>
				) : (
					<TreeGridCell>
						{ ( props ) => (
							<Button
								{ ...props }
								variant="secondary"
								onClick={ onClick }
							>
								{ text }
							</Button>
						) }
					</TreeGridCell>
				) }
				<TreeGridCell>
					{ ( props ) => (
						<Button { ...props } variant="tertiary">
							{ __( 'Sibling cell', 'component-kitchen-sink' ) }
						</Button>
					) }
				</TreeGridCell>
			</TreeGridRow>
		</TreeGrid>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'TreeGridCell', 'component-kitchen-sink' ) }
				>
					{ renderTreeGrid() }
					<ToggleControl
						label="withoutGridItem"
						checked={ withoutGridItem }
						onChange={ ( next ) =>
							setAttributes( { withoutGridItem: next } )
						}
					/>
					<TextControl
						label="children (button text)"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { clicks: 0 } ) }
					>
						{ __( 'Reset clicks', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>TreeGridCell</h3>
				{ renderTreeGrid() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
