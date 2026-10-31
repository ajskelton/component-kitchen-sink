import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	Button,
	__experimentalNavigatorBackButton as NavigatorBackButton,
	__experimentalNavigatorButton as NavigatorButton,
	__experimentalNavigatorProvider as NavigatorProvider,
	__experimentalNavigatorScreen as NavigatorScreen,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const VARIANT_OPTIONS = [
	{ label: 'primary', value: 'primary' },
	{ label: 'secondary', value: 'secondary' },
	{ label: 'tertiary', value: 'tertiary' },
	{ label: 'link', value: 'link' },
];

const PATH_OPTIONS = [
	{ label: '/child', value: '/child' },
	{ label: '/child/nested', value: '/child/nested' },
];

const ATTRIBUTE_NAME_OPTIONS = [
	{ label: 'id (default)', value: 'id' },
	{ label: 'data-nav-target', value: 'data-nav-target' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { text, path, attributeName, variant, disabled, clicks } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const buttonProps = {
		path,
		attributeName,
		variant,
		disabled,
		accessibleWhenDisabled: disabled,
		onClick: () => setAttributes( { clicks: clicks + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'NavigatorButton', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="children"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<SelectControl
						label="path"
						value={ path }
						options={ PATH_OPTIONS }
						onChange={ ( next ) => setAttributes( { path: next } ) }
					/>
					<SelectControl
						label="attributeName"
						value={ attributeName }
						options={ ATTRIBUTE_NAME_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { attributeName: next } )
						}
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
				<h3>NavigatorButton</h3>
				<NavigatorProvider initialPath="/" style={ { height: 160 } }>
					<NavigatorScreen path="/">
						<p>
							{ __( 'Home screen.', 'component-kitchen-sink' ) }
						</p>
						<NavigatorButton { ...buttonProps }>
							{ text }
						</NavigatorButton>
					</NavigatorScreen>
					<NavigatorScreen path="/child">
						<p>
							{ __( 'Child screen.', 'component-kitchen-sink' ) }
						</p>
						<NavigatorButton path="/child/nested">
							{ __(
								'Go to /child/nested',
								'component-kitchen-sink'
							) }
						</NavigatorButton>{ ' ' }
						<NavigatorBackButton>
							{ __( 'Back', 'component-kitchen-sink' ) }
						</NavigatorBackButton>
					</NavigatorScreen>
					<NavigatorScreen path="/child/nested">
						<p>
							{ __( 'Nested screen.', 'component-kitchen-sink' ) }
						</p>
						<NavigatorBackButton>
							{ __( 'Back', 'component-kitchen-sink' ) }
						</NavigatorBackButton>
					</NavigatorScreen>
				</NavigatorProvider>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
