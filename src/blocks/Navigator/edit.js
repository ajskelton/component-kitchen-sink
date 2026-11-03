import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Navigator,
	PanelBody,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
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
					title={ __( 'Navigator', 'component-kitchen-sink' ) }
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
						label="height (style on Navigator)"
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
				<h3>Navigator</h3>
				<Navigator
					key={ initialPath }
					initialPath={ initialPath }
					style={ { height } }
				>
					<Navigator.Screen path="/">
						<p>
							{ __(
								'This is the home screen.',
								'component-kitchen-sink'
							) }
						</p>
						<Navigator.Button
							path="/child"
							onClick={ countNavigation }
						>
							{ __(
								'Go to child screen',
								'component-kitchen-sink'
							) }
						</Navigator.Button>
					</Navigator.Screen>
					<Navigator.Screen path="/child">
						<p>
							{ __(
								'This is the child screen.',
								'component-kitchen-sink'
							) }
						</p>
						<Navigator.BackButton onClick={ countNavigation }>
							{ __( 'Go back', 'component-kitchen-sink' ) }
						</Navigator.BackButton>
					</Navigator.Screen>
				</Navigator>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
