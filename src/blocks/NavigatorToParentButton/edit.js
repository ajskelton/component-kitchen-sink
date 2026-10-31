import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	Button,
	__experimentalNavigatorButton as NavigatorButton,
	__experimentalNavigatorProvider as NavigatorProvider,
	__experimentalNavigatorScreen as NavigatorScreen,
	__experimentalNavigatorToParentButton as NavigatorToParentButton,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { chevronLeft } from '@wordpress/icons';
import './editor.scss';

const VARIANT_OPTIONS = [
	{ label: 'primary', value: 'primary' },
	{ label: 'secondary', value: 'secondary' },
	{ label: 'tertiary', value: 'tertiary' },
	{ label: 'link', value: 'link' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { text, variant, showIcon, disabled, clicks } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const parentProps = {
		variant,
		icon: showIcon ? chevronLeft : undefined,
		disabled,
		accessibleWhenDisabled: disabled,
		onClick: () => setAttributes( { clicks: clicks + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'NavigatorToParentButton',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="children"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<SelectControl
						label="variant"
						value={ variant }
						options={ VARIANT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { variant: next } )
						}
					/>
					<ToggleControl
						label="icon"
						checked={ showIcon }
						onChange={ ( next ) =>
							setAttributes( { showIcon: next } )
						}
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { clicks: 0 } ) }
					>
						{ __( 'Reset clicks', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>NavigatorToParentButton</h3>
				{ /* Deprecated alias of the back button; it emits a deprecation warning. */ }
				<NavigatorProvider
					initialPath="/child"
					style={ { height: 160 } }
				>
					<NavigatorScreen path="/">
						<p>
							{ __( 'Home screen.', 'component-kitchen-sink' ) }
						</p>
						<NavigatorButton path="/child">
							{ __(
								'Go to child screen',
								'component-kitchen-sink'
							) }
						</NavigatorButton>
					</NavigatorScreen>
					<NavigatorScreen path="/child">
						<p>
							{ __( 'Child screen.', 'component-kitchen-sink' ) }
						</p>
						<NavigatorToParentButton { ...parentProps }>
							{ text }
						</NavigatorToParentButton>
					</NavigatorScreen>
				</NavigatorProvider>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
