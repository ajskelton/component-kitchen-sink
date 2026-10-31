import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { alignCenter, alignLeft, alignRight, link } from '@wordpress/icons';
import './editor.scss';

const ALIGNMENTS = [
	{ key: 'left', icon: alignLeft, title: 'Align left' },
	{ key: 'center', icon: alignCenter, title: 'Align center' },
	{ key: 'right', icon: alignRight, title: 'Align right' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { isCollapsed, title, activeControl, split } = attributes;

	// `controls` accepts a flat array or an array of arrays (separated sets).
	const controls = ALIGNMENTS.map( ( item ) => ( {
		icon: item.icon,
		title: item.title,
		isActive: activeControl === item.key,
		onClick: () => setAttributes( { activeControl: item.key } ),
	} ) );

	const groupProps = {
		controls: split
			? [ controls.slice( 0, 1 ), controls.slice( 1 ) ]
			: controls,
		isCollapsed,
		// `title` is only valid (and required) with isCollapsed.
		...( isCollapsed
			? { title: title || __( 'Alignment', 'component-kitchen-sink' ) }
			: {} ),
	};

	const renderToolbar = () => (
		<Toolbar label={ __( 'ToolbarGroup demo', 'component-kitchen-sink' ) }>
			<ToolbarGroup { ...groupProps }>
				{ /* Children are rendered after the generated controls. */ }
				{ ! isCollapsed && (
					<ToolbarButton
						icon={ link }
						label={ __( 'Child button', 'component-kitchen-sink' ) }
					/>
				) }
			</ToolbarGroup>
		</Toolbar>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ToolbarGroup', 'component-kitchen-sink' ) }
				>
					{ renderToolbar() }
					<ToggleControl
						label="isCollapsed"
						checked={ isCollapsed }
						onChange={ ( next ) =>
							setAttributes( { isCollapsed: next } )
						}
					/>
					<TextControl
						label="title"
						value={ title }
						disabled={ ! isCollapsed }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
						}
					/>
					<ToggleControl
						label="controls (split into two sets)"
						checked={ split }
						onChange={ ( next ) =>
							setAttributes( { split: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ToolbarGroup</h3>
				{ renderToolbar() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
