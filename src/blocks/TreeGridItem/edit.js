import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { forwardRef } from '@wordpress/element';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalTreeGrid as TreeGrid,
	__experimentalTreeGridCell as TreeGridCell,
	__experimentalTreeGridItem as TreeGridItem,
	__experimentalTreeGridRow as TreeGridRow,
	Button,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const AS_OPTIONS = [
	{ label: 'children render prop', value: 'render-prop' },
	{ label: 'as component', value: 'as-component' },
];

/**
 * A component usable with TreeGridItem's `as` prop: it must pass `ref`,
 * `tabIndex` and `onFocus` through to the element it renders.
 */
const RovingButton = forwardRef( function RovingButtonInner( props, ref ) {
	return <Button ref={ ref } variant="secondary" { ...props } />;
} );

export default function Edit( { attributes, setAttributes } ) {
	const { as, text, clicks } = attributes;

	const onClick = () => setAttributes( { clicks: clicks + 1 } );

	// A cell with `withoutGridItem` holds several TreeGridItems, each one a
	// separate roving-tabindex stop.
	const renderTreeGrid = () => (
		<TreeGrid>
			<TreeGridRow level={ 1 } positionInSet={ 1 } setSize={ 1 }>
				<TreeGridCell withoutGridItem>
					{ as === 'as-component' ? (
						<TreeGridItem as={ RovingButton } onClick={ onClick }>
							{ text }
						</TreeGridItem>
					) : (
						<TreeGridItem>
							{ ( props ) => (
								<Button
									{ ...props }
									variant="secondary"
									onClick={ onClick }
								>
									{ text }
								</Button>
							) }
						</TreeGridItem>
					) }
					<TreeGridItem>
						{ ( props ) => (
							<Button { ...props } variant="tertiary">
								{ __(
									'Second item',
									'component-kitchen-sink'
								) }
							</Button>
						) }
					</TreeGridItem>
				</TreeGridCell>
			</TreeGridRow>
		</TreeGrid>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'TreeGridItem', 'component-kitchen-sink' ) }
				>
					{ renderTreeGrid() }
					<SelectControl
						label="as / children"
						value={ as }
						options={ AS_OPTIONS }
						onChange={ ( next ) => setAttributes( { as: next } ) }
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
				<h3>TreeGridItem</h3>
				{ renderTreeGrid() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
