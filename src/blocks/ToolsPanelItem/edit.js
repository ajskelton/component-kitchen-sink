import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		itemLabel,
		isShownByDefault,
		defaultShown,
		value,
		selectCount,
		deselectCount,
		shown,
	} = attributes;

	// Remount the panel when registration-time props change, because
	// isShownByDefault and defaultShown are only read when an item registers.
	const panelKey = `${ isShownByDefault }-${ defaultShown }-${ itemLabel }`;

	const itemProps = {
		label: itemLabel || 'Item',
		isShownByDefault,
		defaultShown,
		hasValue: () => !! value,
		onSelect: () => setAttributes( { selectCount: selectCount + 1 } ),
		onDeselect: () =>
			setAttributes( { value: '', deselectCount: deselectCount + 1 } ),
		onShownChange: ( isShown ) => setAttributes( { shown: isShown } ),
	};

	// ToolsPanelItem only works inside a ToolsPanel; render a minimal one.
	const renderPanel = ( location ) => (
		<ToolsPanel
			key={ `${ location }-${ panelKey }` }
			label={ __( 'ToolsPanelItem host', 'component-kitchen-sink' ) }
			panelId={ `${ clientId }-${ location }` }
			resetAll={ () => setAttributes( { value: '' } ) }
		>
			<ToolsPanelItem
				{ ...itemProps }
				panelId={ `${ clientId }-${ location }` }
			>
				<TextControl
					label={ itemProps.label }
					value={ value }
					onChange={ ( next ) => setAttributes( { value: next } ) }
				/>
			</ToolsPanelItem>
			{ /* A second, always-visible item so the menu has a sibling. */ }
			<ToolsPanelItem
				label="Sibling"
				isShownByDefault
				panelId={ `${ clientId }-${ location }` }
				hasValue={ () => false }
			>
				<p>{ __( 'Sibling item', 'component-kitchen-sink' ) }</p>
			</ToolsPanelItem>
		</ToolsPanel>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ToolsPanelItem', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="label"
						value={ itemLabel }
						onChange={ ( next ) =>
							setAttributes( { itemLabel: next } )
						}
					/>
					<ToggleControl
						label="isShownByDefault"
						checked={ isShownByDefault }
						onChange={ ( next ) =>
							setAttributes( { isShownByDefault: next } )
						}
					/>
					<ToggleControl
						label="defaultShown"
						checked={ defaultShown }
						help={ __(
							'Only applies to items that are not shown by default.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { defaultShown: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( {
								selectCount: 0,
								deselectCount: 0,
							} )
						}
					>
						{ __( 'Reset counters', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
				{ renderPanel( 'inspector' ) }
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ToolsPanelItem</h3>
				{ renderPanel( 'canvas' ) }
				<p>
					{ `onSelect: ${ selectCount }, onDeselect: ${ deselectCount }, onShownChange: ${ shown }` }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
