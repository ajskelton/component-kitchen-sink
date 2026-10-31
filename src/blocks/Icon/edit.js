import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Icon,
	PanelBody,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import {
	cog,
	check,
	plus,
	starFilled,
	trash,
	wordpress,
} from '@wordpress/icons';
import './editor.scss';

// Icon accepts an SVG element from @wordpress/icons or a Dashicon name. The
// attribute stores the key; "dashicon:" keys resolve to a plain string.
const ICONS = {
	wordpress,
	cog,
	check,
	plus,
	starFilled,
	trash,
	'dashicon:smiley': 'smiley',
	'dashicon:admin-site': 'admin-site',
};

const ICON_OPTIONS = Object.keys( ICONS ).map( ( key ) => ( {
	label: key,
	value: key,
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const { icon, size } = attributes;

	const iconProps = { icon: ICONS[ icon ], size };

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Icon', 'component-kitchen-sink' ) }>
					<Icon { ...iconProps } />
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
							setAttributes( { size: next ?? 24 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Icon</h3>
				<Icon { ...iconProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
