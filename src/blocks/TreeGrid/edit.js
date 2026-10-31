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
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

/**
 * Flat description of a small tree. `level`, `positionInSet` and `setSize`
 * are the ARIA numbers TreeGridRow requires.
 */
const NODES = [
	{ id: 'a', label: 'Fruit', parent: null, level: 1, pos: 1, size: 2 },
	{ id: 'a1', label: 'Apple', parent: 'a', level: 2, pos: 1, size: 2 },
	{ id: 'a2', label: 'Pear', parent: 'a', level: 2, pos: 2, size: 2 },
	{ id: 'b', label: 'Vegetables', parent: null, level: 1, pos: 2, size: 2 },
];

const hasChildren = ( id ) => NODES.some( ( node ) => node.parent === id );

export default function Edit( { attributes, setAttributes } ) {
	const { applicationAriaLabel, expanded, selected, lastEvent } = attributes;

	const setExpanded = ( id, isOpen ) =>
		setAttributes( {
			expanded: isOpen
				? [ ...new Set( [ ...expanded, id ] ) ]
				: expanded.filter( ( item ) => item !== id ),
		} );

	// Keyboard callbacks receive the row element; the id is stored on it.
	const treeGridProps = {
		applicationAriaLabel: applicationAriaLabel || undefined,
		onExpandRow: ( row ) => {
			setExpanded( row.dataset.nodeId, true );
			setAttributes( {
				lastEvent: `onExpandRow ${ row.dataset.nodeId }`,
			} );
		},
		onCollapseRow: ( row ) => {
			setExpanded( row.dataset.nodeId, false );
			setAttributes( {
				lastEvent: `onCollapseRow ${ row.dataset.nodeId }`,
			} );
		},
		onFocusRow: ( event, startRow, destinationRow ) =>
			setAttributes( {
				lastEvent: `onFocusRow ${ startRow.dataset.nodeId } -> ${ destinationRow.dataset.nodeId }`,
			} ),
	};

	const renderTreeGrid = () => (
		<TreeGrid { ...treeGridProps }>
			{ NODES.filter(
				( node ) => ! node.parent || expanded.includes( node.parent )
			).map( ( node ) => (
				<TreeGridRow
					key={ node.id }
					level={ node.level }
					positionInSet={ node.pos }
					setSize={ node.size }
					isExpanded={
						hasChildren( node.id )
							? expanded.includes( node.id )
							: undefined
					}
					data-node-id={ node.id }
				>
					<TreeGridCell>
						{ ( props ) => (
							<Button
								{ ...props }
								variant={
									selected === node.id
										? 'primary'
										: 'tertiary'
								}
								style={ {
									marginLeft: ( node.level - 1 ) * 16,
								} }
								onClick={ () =>
									setAttributes( { selected: node.id } )
								}
							>
								{ node.label }
							</Button>
						) }
					</TreeGridCell>
					<TreeGridCell>
						{ ( props ) =>
							hasChildren( node.id ) ? (
								<Button
									{ ...props }
									variant="secondary"
									size="compact"
									onClick={ () =>
										setExpanded(
											node.id,
											! expanded.includes( node.id )
										)
									}
								>
									{ expanded.includes( node.id )
										? __(
												'Collapse',
												'component-kitchen-sink'
											)
										: __(
												'Expand',
												'component-kitchen-sink'
											) }
								</Button>
							) : (
								<Button
									{ ...props }
									variant="link"
									disabled
									accessibleWhenDisabled
								>
									{ __(
										'No children',
										'component-kitchen-sink'
									) }
								</Button>
							)
						}
					</TreeGridCell>
				</TreeGridRow>
			) ) }
		</TreeGrid>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'TreeGrid', 'component-kitchen-sink' ) }>
					{ renderTreeGrid() }
					<TextControl
						label="applicationAriaLabel"
						value={ applicationAriaLabel }
						onChange={ ( next ) =>
							setAttributes( { applicationAriaLabel: next } )
						}
					/>
					<p>
						{ __(
							'Focus a row and use Up/Down, Left/Right, Home/End. Last callback:',
							'component-kitchen-sink'
						) }{ ' ' }
						<code>{ lastEvent || '-' }</code>
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>TreeGrid</h3>
				{ renderTreeGrid() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
