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
	RangeControl,
	SelectControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const INITIAL_PATH_OPTIONS = [
	{ label: '/', value: '/' },
	{ label: '/child', value: '/child' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { initialPath, height, navigations } = attributes;

	const countNavigation = () =>
		setAttributes( { navigations: navigations + 1 } );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'NavigatorProvider',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="initialPath"
						help={ __(
							'Read on mount only; reselect the block to see it.',
							'component-kitchen-sink'
						) }
						value={ initialPath }
						options={ INITIAL_PATH_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { initialPath: next } )
						}
					/>
					<RangeControl
						label="style.height"
						value={ height }
						min={ 80 }
						max={ 400 }
						onChange={ ( next ) =>
							setAttributes( { height: next ?? 160 } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { navigations: 0 } ) }
					>
						{ __( 'Reset navigations', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>NavigatorProvider</h3>
				<NavigatorProvider
					key={ initialPath }
					initialPath={ initialPath }
					style={ { height } }
				>
					<NavigatorScreen path="/">
						<p>
							{ __(
								'This is the home screen.',
								'component-kitchen-sink'
							) }
						</p>
						<NavigatorButton
							path="/child"
							onClick={ countNavigation }
						>
							{ __(
								'Go to child screen',
								'component-kitchen-sink'
							) }
						</NavigatorButton>
					</NavigatorScreen>
					<NavigatorScreen path="/child">
						<p>
							{ __(
								'This is the child screen.',
								'component-kitchen-sink'
							) }
						</p>
						<NavigatorBackButton onClick={ countNavigation }>
							{ __( 'Go back', 'component-kitchen-sink' ) }
						</NavigatorBackButton>
					</NavigatorScreen>
				</NavigatorProvider>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
