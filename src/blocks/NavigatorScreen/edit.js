import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	Button,
	__experimentalNavigatorBackButton as NavigatorBackButton,
	__experimentalNavigatorButton as NavigatorButton,
	__experimentalNavigatorProvider as NavigatorProvider,
	__experimentalNavigatorScreen as NavigatorScreen,
	__experimentalUseNavigator as useNavigator,
	PanelBody,
	SelectControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

/*
 * The path pattern of the screen under test, and a concrete path that matches
 * it. A pattern with a `:id` segment exposes the value as a navigator param.
 */
const SCREEN_PATHS = {
	'/child': '/child',
	'/item/:id': '/item/42',
};

const PATH_OPTIONS = Object.keys( SCREEN_PATHS ).map( ( value ) => ( {
	label: value,
	value,
} ) );

function ParamsReadout() {
	const { params, location } = useNavigator();
	return (
		<p>
			{ `location.path: ${ location.path } | params: ${ JSON.stringify(
				params
			) }` }
		</p>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { screenPath, visits } = attributes;
	const target = SCREEN_PATHS[ screenPath ] ?? '/child';

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'NavigatorScreen', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="path"
						value={ screenPath }
						options={ PATH_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { screenPath: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { visits: 0 } ) }
					>
						{ __( 'Reset visits', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>NavigatorScreen</h3>
				<NavigatorProvider
					key={ screenPath }
					initialPath="/"
					style={ { height: 160 } }
				>
					<NavigatorScreen path="/">
						<p>
							{ __(
								'Home screen (parent).',
								'component-kitchen-sink'
							) }
						</p>
						<NavigatorButton
							path={ target }
							onClick={ () =>
								setAttributes( { visits: visits + 1 } )
							}
						>
							{ `Go to ${ target }` }
						</NavigatorButton>
					</NavigatorScreen>
					{ /* The NavigatorScreen under test. */ }
					<NavigatorScreen path={ screenPath }>
						<p>{ `NavigatorScreen path="${ screenPath }"` }</p>
						<ParamsReadout />
						<NavigatorBackButton>
							{ __( 'Go back', 'component-kitchen-sink' ) }
						</NavigatorBackButton>
					</NavigatorScreen>
				</NavigatorProvider>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
