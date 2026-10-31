import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	NavigableMenu,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const ORIENTATION_OPTIONS = [
	{ label: 'vertical', value: 'vertical' },
	{ label: 'horizontal', value: 'horizontal' },
	{ label: 'both', value: 'both' },
];

const ITEMS = [ 'Item 1', 'Item 2', 'Item 3', 'Item 4' ];

export default function Edit( { attributes, setAttributes } ) {
	const { orientation, cycle, lastIndex } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const menuProps = {
		orientation,
		cycle,
		onNavigate: ( index ) => setAttributes( { lastIndex: index } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'NavigableMenu', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="orientation"
						value={ orientation }
						options={ ORIENTATION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { orientation: next } )
						}
					/>
					<ToggleControl
						label="cycle"
						checked={ cycle }
						onChange={ ( next ) =>
							setAttributes( { cycle: next } )
						}
					/>
					<p>
						{ __(
							'onNavigate last index:',
							'component-kitchen-sink'
						) }{ ' ' }
						{ lastIndex }
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>NavigableMenu</h3>
				<p>
					{ __(
						'Focus an item, then use the arrow keys (per orientation) to move between items.',
						'component-kitchen-sink'
					) }
				</p>
				<NavigableMenu { ...menuProps }>
					{ ITEMS.map( ( item ) => (
						<Button
							key={ item }
							variant="secondary"
							role="menuitem"
						>
							{ item }
						</Button>
					) ) }
				</NavigableMenu>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
