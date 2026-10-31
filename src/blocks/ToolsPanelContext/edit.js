import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useContext } from '@wordpress/element';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelContext as ToolsPanelContext,
	__experimentalToolsPanelItem as ToolsPanelItem,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

/**
 * Reads ToolsPanelContext. Rendered inside a ToolsPanel it shows the panel's
 * registered menu items; outside, it shows the context's default value.
 */
function ContextReader() {
	const context = useContext( ToolsPanelContext );
	const summary = {
		panelId: context.panelId ?? null,
		hasMenuItems: context.hasMenuItems,
		isResetting: context.isResetting,
		shouldRenderPlaceholderItems: context.shouldRenderPlaceholderItems,
		areAllOptionalControlsHidden: context.areAllOptionalControlsHidden,
		firstDisplayedItem: context.firstDisplayedItem ?? null,
		lastDisplayedItem: context.lastDisplayedItem ?? null,
		defaultMenuItems: Object.keys( context.menuItems?.default ?? {} ),
		optionalMenuItems: context.menuItems?.optional ?? {},
	};
	return (
		<pre style={ { gridColumn: '1 / -1' } }>
			{ JSON.stringify( summary, null, 2 ) }
		</pre>
	);
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { value, flag } = attributes;

	const renderDemo = ( location ) => {
		const panelId = `${ clientId }-${ location }`;
		return (
			<ToolsPanel
				label={ __(
					'ToolsPanelContext demo',
					'component-kitchen-sink'
				) }
				panelId={ panelId }
				resetAll={ () => setAttributes( { value: '', flag: false } ) }
			>
				<ToolsPanelItem
					label="Text"
					panelId={ panelId }
					isShownByDefault
					hasValue={ () => !! value }
					onDeselect={ () => setAttributes( { value: '' } ) }
				>
					<TextControl
						label="Text"
						value={ value }
						onChange={ ( next ) =>
							setAttributes( { value: next } )
						}
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					label="Flag"
					panelId={ panelId }
					hasValue={ () => flag }
					onDeselect={ () => setAttributes( { flag: false } ) }
				>
					<ToggleControl
						label="Flag"
						checked={ flag }
						onChange={ ( next ) => setAttributes( { flag: next } ) }
					/>
				</ToolsPanelItem>
				<ContextReader />
			</ToolsPanel>
		);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'ToolsPanelContext',
						'component-kitchen-sink'
					) }
				>
					<p>
						{ __(
							'Use the panel menu in the canvas to show Flag and watch the context change.',
							'component-kitchen-sink'
						) }
					</p>
					<TextControl
						label="value"
						value={ value }
						onChange={ ( next ) =>
							setAttributes( { value: next } )
						}
					/>
					<ToggleControl
						label="flag"
						checked={ flag }
						onChange={ ( next ) => setAttributes( { flag: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ToolsPanelContext</h3>
				{ renderDemo( 'canvas' ) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
