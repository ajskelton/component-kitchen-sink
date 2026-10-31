import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const HEADING_LEVEL_OPTIONS = [ 1, 2, 3, 4, 5, 6 ].map( ( level ) => ( {
	label: String( level ),
	value: String( level ),
} ) );

const DEFAULTS = { width: '', height: '', color: '', opacity: 0 };

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		label,
		headingLevel,
		hasInnerWrapper,
		shouldRenderPlaceholderItems,
		width,
		height,
		color,
		opacity,
		enabledItems,
	} = attributes;

	// Remember which optional items the user switched on via the panel menu.
	const trackShown = ( itemLabel ) => ( isShown ) => {
		const rest = enabledItems.filter( ( item ) => item !== itemLabel );
		setAttributes( {
			enabledItems: isShown ? [ ...rest, itemLabel ] : rest,
		} );
	};

	// One panel per location, so each gets its own panelId.
	const renderPanel = ( location ) => (
		<ToolsPanel
			label={ label || __( 'Dimensions', 'component-kitchen-sink' ) }
			headingLevel={ headingLevel }
			hasInnerWrapper={ hasInnerWrapper }
			shouldRenderPlaceholderItems={ shouldRenderPlaceholderItems }
			panelId={ `${ clientId }-${ location }` }
			resetAll={ () =>
				setAttributes( { ...DEFAULTS, enabledItems: [] } )
			}
		>
			<ToolsPanelItem
				label="Width"
				panelId={ `${ clientId }-${ location }` }
				isShownByDefault
				hasValue={ () => !! width }
				onDeselect={ () => setAttributes( { width: '' } ) }
			>
				<TextControl
					label="Width"
					value={ width }
					onChange={ ( next ) => setAttributes( { width: next } ) }
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				label="Height"
				panelId={ `${ clientId }-${ location }` }
				defaultShown={ enabledItems.includes( 'Height' ) }
				onShownChange={ trackShown( 'Height' ) }
				hasValue={ () => !! height }
				onDeselect={ () => setAttributes( { height: '' } ) }
			>
				<TextControl
					label="Height"
					value={ height }
					onChange={ ( next ) => setAttributes( { height: next } ) }
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				label="Color"
				panelId={ `${ clientId }-${ location }` }
				defaultShown={ enabledItems.includes( 'Color' ) }
				onShownChange={ trackShown( 'Color' ) }
				hasValue={ () => !! color }
				onDeselect={ () => setAttributes( { color: '' } ) }
			>
				<TextControl
					label="Color"
					value={ color }
					onChange={ ( next ) => setAttributes( { color: next } ) }
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				label="Opacity"
				panelId={ `${ clientId }-${ location }` }
				defaultShown={ enabledItems.includes( 'Opacity' ) }
				onShownChange={ trackShown( 'Opacity' ) }
				hasValue={ () => opacity > 0 }
				onDeselect={ () => setAttributes( { opacity: 0 } ) }
			>
				<RangeControl
					label="Opacity"
					value={ opacity }
					min={ 0 }
					max={ 100 }
					onChange={ ( next ) =>
						setAttributes( { opacity: next ?? 0 } )
					}
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ToolsPanel props', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<SelectControl
						label="headingLevel"
						value={ String( headingLevel ) }
						options={ HEADING_LEVEL_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { headingLevel: Number( next ) } )
						}
					/>
					<ToggleControl
						label="hasInnerWrapper"
						checked={ hasInnerWrapper }
						onChange={ ( next ) =>
							setAttributes( { hasInnerWrapper: next } )
						}
					/>
					<ToggleControl
						label="shouldRenderPlaceholderItems"
						checked={ shouldRenderPlaceholderItems }
						onChange={ ( next ) =>
							setAttributes( {
								shouldRenderPlaceholderItems: next,
							} )
						}
					/>
				</PanelBody>
				{ renderPanel( 'inspector' ) }
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ToolsPanel</h3>
				{ renderPanel( 'canvas' ) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
