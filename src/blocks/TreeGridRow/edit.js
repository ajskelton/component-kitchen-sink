import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalTreeGrid as TreeGrid,
	__experimentalTreeGridCell as TreeGridCell,
	__experimentalTreeGridRow as TreeGridRow,
	Button,
	__experimentalNumberControl as NumberControl,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const IS_EXPANDED_OPTIONS = [
	{ label: 'undefined', value: 'undefined' },
	{ label: 'true', value: 'true' },
	{ label: 'false', value: 'false' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { level, positionInSet, setSize, isExpanded, className, selected } =
		attributes;

	// Props under test, shared by the inspector copy and the canvas copy.
	const rowProps = {
		level,
		positionInSet,
		setSize,
		isExpanded:
			isExpanded === 'undefined' ? undefined : isExpanded === 'true',
		className: className || undefined,
	};

	const renderTreeGrid = () => (
		<TreeGrid>
			<TreeGridRow { ...rowProps }>
				<TreeGridCell>
					{ ( props ) => (
						<Button
							{ ...props }
							variant="secondary"
							onClick={ () =>
								setAttributes( { selected: 'first' } )
							}
						>
							{ __( 'First cell', 'component-kitchen-sink' ) }
						</Button>
					) }
				</TreeGridCell>
				<TreeGridCell>
					{ ( props ) => (
						<Button
							{ ...props }
							variant="secondary"
							onClick={ () =>
								setAttributes( { selected: 'second' } )
							}
						>
							{ __( 'Second cell', 'component-kitchen-sink' ) }
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
					title={ __( 'TreeGridRow', 'component-kitchen-sink' ) }
				>
					{ renderTreeGrid() }
					<NumberControl
						label="level"
						min={ 1 }
						value={ level }
						onChange={ ( next ) =>
							setAttributes( { level: Number( next ) || 1 } )
						}
					/>
					<NumberControl
						label="positionInSet"
						min={ 1 }
						value={ positionInSet }
						onChange={ ( next ) =>
							setAttributes( {
								positionInSet: Number( next ) || 1,
							} )
						}
					/>
					<NumberControl
						label="setSize"
						min={ 1 }
						value={ setSize }
						onChange={ ( next ) =>
							setAttributes( { setSize: Number( next ) || 1 } )
						}
					/>
					<SelectControl
						label="isExpanded"
						value={ isExpanded }
						options={ IS_EXPANDED_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { isExpanded: next } )
						}
					/>
					<TextControl
						label="className"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
					<p>
						{ __( 'Last pressed cell:', 'component-kitchen-sink' ) }{ ' ' }
						<code>{ selected || '-' }</code>
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>TreeGridRow</h3>
				{ renderTreeGrid() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
