import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	IsolatedEventContainer,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { isolated, outerClicks, innerClicks } = attributes;

	// IsolatedEventContainer (deprecated) stops `mousedown` from bubbling out
	// of the container. A plain div is rendered when isolation is off, so the
	// difference is observable at the outer listener.
	const Container = isolated ? IsolatedEventContainer : 'div';

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'IsolatedEventContainer',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="use IsolatedEventContainer"
						checked={ isolated }
						help={ __(
							'Off renders a plain div, so mousedown reaches the outer handler.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { isolated: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( { outerClicks: 0, innerClicks: 0 } )
						}
					>
						{ __( 'Reset counters', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>IsolatedEventContainer</h3>
				{ /* The outer wrapper listens for mousedown that escapes the container. */ }
				{ /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */ }
				<div
					style={ { padding: 12, border: '1px dashed' } }
					onMouseDown={ () =>
						setAttributes( { outerClicks: outerClicks + 1 } )
					}
				>
					<p>
						{ __(
							'Outer area: mousedown here counts as outer.',
							'component-kitchen-sink'
						) }
					</p>
					<Container style={ { padding: 12, border: '1px solid' } }>
						<Button
							variant="secondary"
							onClick={ () =>
								setAttributes( {
									innerClicks: innerClicks + 1,
								} )
							}
						>
							{ __( 'Inner button', 'component-kitchen-sink' ) }
						</Button>
					</Container>
				</div>
				<p>
					{ `outer mousedown count: ${ outerClicks }, inner button clicks: ${ innerClicks }` }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
