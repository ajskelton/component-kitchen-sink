import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { selected, value, label, showTooltip, disabled } = attributes;

	// The option only works inside a ToggleGroupControl, which provides its
	// state through context. The group here is a minimal parent; the controls
	// below drive the middle option, which is the one under test.
	const renderGroup = () => (
		<ToggleGroupControl
			label={ __( 'Option demo group', 'component-kitchen-sink' ) }
			value={ selected || undefined }
			isDeselectable
			onChange={ ( next ) =>
				setAttributes( { selected: String( next ?? '' ) } )
			}
		>
			<ToggleGroupControlOption value="first" label="First" />
			<ToggleGroupControlOption
				value={ value || 'second' }
				label={ label }
				showTooltip={ showTooltip }
				disabled={ disabled }
			/>
			<ToggleGroupControlOption value="third" label="Third" />
		</ToggleGroupControl>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'ToggleGroupControlOption',
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
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<ToggleControl
						label="showTooltip"
						checked={ showTooltip }
						onChange={ ( next ) =>
							setAttributes( { showTooltip: next } )
						}
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
				<h3>ToggleGroupControlOption</h3>
				{ renderGroup() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
