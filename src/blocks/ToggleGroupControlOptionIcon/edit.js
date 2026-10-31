import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	alignCenter,
	alignJustify,
	alignLeft,
	alignRight,
} from '@wordpress/icons';
import './editor.scss';

/**
 * Icons offered by the icon select. The attribute stores the key, the option
 * receives the icon element from `@wordpress/icons`.
 */
const ICONS = { alignLeft, alignCenter, alignRight, alignJustify };

const ICON_OPTIONS = Object.keys( ICONS ).map( ( key ) => ( {
	label: key,
	value: key,
} ) );

export default function Edit( { attributes, setAttributes } ) {
	const { selected, value, label, icon, disabled } = attributes;

	// The option only works inside a ToggleGroupControl, which provides its
	// state through context. The group here is a minimal parent; the controls
	// below drive the middle option, which is the one under test.
	const renderGroup = () => (
		<ToggleGroupControl
			label={ __( 'Icon option demo group', 'component-kitchen-sink' ) }
			value={ selected || undefined }
			isDeselectable
			onChange={ ( next ) =>
				setAttributes( { selected: String( next ?? '' ) } )
			}
		>
			<ToggleGroupControlOptionIcon
				value="first"
				icon={ alignLeft }
				label="Align left"
			/>
			<ToggleGroupControlOptionIcon
				value={ value || 'second' }
				icon={ ICONS[ icon ] ?? alignCenter }
				label={ label }
				disabled={ disabled }
			/>
			<ToggleGroupControlOptionIcon
				value="third"
				icon={ alignRight }
				label="Align right"
			/>
		</ToggleGroupControl>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'ToggleGroupControlOptionIcon',
						'component-kitchen-sink'
					) }
				>
					{ renderGroup() }
					<TextControl
						label="value"
						value={ value }
						onChange={ ( next ) =>
							setAttributes( { value: next } )
						}
					/>
					<TextControl
						label="label"
						help={ __(
							'Shown in the tooltip and used as the accessible name.',
							'component-kitchen-sink'
						) }
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<SelectControl
						label="icon"
						value={ icon }
						options={ ICON_OPTIONS }
						onChange={ ( next ) => setAttributes( { icon: next } ) }
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ToggleGroupControlOptionIcon</h3>
				{ renderGroup() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
