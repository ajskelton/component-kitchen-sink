import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Navigator,
	PanelBody,
	SelectControl,
	ToggleControl,
	useNavigator,
} from '@wordpress/components';
import './editor.scss';

const PATH_OPTIONS = [
	{ label: '/', value: '/' },
	{ label: '/child', value: '/child' },
	{ label: '/item/42', value: '/item/42' },
];

// Child of Navigator: calls the hook under test and shows what it returns.
function NavigatorControls( { target, replace, skipFocus, onUse } ) {
	const { location, params, goTo, goBack } = useNavigator();

	return (
		<>
			<p>{ `location.path: ${ location.path }` }</p>
			<p>{ `params: ${ JSON.stringify( params ) }` }</p>
			<div style={ { display: 'flex', gap: 8, flexWrap: 'wrap' } }>
				<Button
					variant="secondary"
					onClick={ () => {
						goTo( target, { replace, skipFocus } );
						onUse();
					} }
				>
					{ `goTo( '${ target }' )` }
				</Button>
				<Button
					variant="secondary"
					onClick={ () => {
						goBack();
						onUse();
					} }
				>
					goBack()
				</Button>
			</div>
		</>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { target, replace, skipFocus, calls } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'useNavigator', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="goTo( path )"
						value={ target }
						options={ PATH_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { target: next } )
						}
					/>
					<ToggleControl
						label="options.replace"
						checked={ replace }
						onChange={ ( next ) =>
							setAttributes( { replace: next } )
						}
					/>
					<ToggleControl
						label="options.skipFocus"
						checked={ skipFocus }
						onChange={ ( next ) =>
							setAttributes( { skipFocus: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { calls: 0 } ) }
					>
						{ __( 'Reset calls', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useNavigator</h3>
				<Navigator initialPath="/" style={ { height: 200 } }>
					<Navigator.Screen path="/">
						<p>
							{ __( 'Home screen.', 'component-kitchen-sink' ) }
						</p>
						<NavigatorControls
							target={ target }
							replace={ replace }
							skipFocus={ skipFocus }
							onUse={ () =>
								setAttributes( { calls: calls + 1 } )
							}
						/>
					</Navigator.Screen>
					<Navigator.Screen path="/child">
						<p>
							{ __( 'Child screen.', 'component-kitchen-sink' ) }
						</p>
						<NavigatorControls
							target={ target }
							replace={ replace }
							skipFocus={ skipFocus }
							onUse={ () =>
								setAttributes( { calls: calls + 1 } )
							}
						/>
					</Navigator.Screen>
					<Navigator.Screen path="/item/:id">
						<p>
							{ __( 'Item screen.', 'component-kitchen-sink' ) }
						</p>
						<NavigatorControls
							target={ target }
							replace={ replace }
							skipFocus={ skipFocus }
							onUse={ () =>
								setAttributes( { calls: calls + 1 } )
							}
						/>
					</Navigator.Screen>
				</Navigator>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
