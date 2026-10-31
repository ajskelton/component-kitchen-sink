import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Fill,
	PanelBody,
	SelectControl,
	Slot,
	SlotFillProvider,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const MODE_OPTIONS = [
	{ label: 'children as node', value: 'node' },
	{ label: 'children as function (fillProps)', value: 'function' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { slotName, fillVisible, mode, fillText, clicks } = attributes;

	const name = slotName || 'ajs-demo-slot';
	const onClick = () => setAttributes( { clicks: clicks + 1 } );

	const button = (
		<Button variant="secondary" onClick={ onClick }>
			{ `${ fillText } (clicked ${ clicks })` }
		</Button>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Fill', 'component-kitchen-sink' ) }>
					<TextControl
						label="name"
						value={ slotName }
						onChange={ ( next ) =>
							setAttributes( { slotName: next } )
						}
					/>
					<ToggleControl
						label="render the Fill"
						checked={ fillVisible }
						onChange={ ( next ) =>
							setAttributes( { fillVisible: next } )
						}
					/>
					<SelectControl
						label="children"
						value={ mode }
						options={ MODE_OPTIONS }
						onChange={ ( next ) => setAttributes( { mode: next } ) }
					/>
					<TextControl
						label="Fill text"
						value={ fillText }
						onChange={ ( next ) =>
							setAttributes( { fillText: next } )
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
				<h3>Fill</h3>
				<SlotFillProvider>
					<p>{ __( 'Slot output:', 'component-kitchen-sink' ) }</p>
					<Slot name={ name } fillProps={ { source: 'Slot' } } />
					{ fillVisible && (
						<Fill name={ name }>
							{ mode === 'function'
								? ( fillProps ) => (
										<div>
											{ button }
											<code>
												{ `fillProps.source: ${ fillProps.source }` }
											</code>
										</div>
									)
								: button }
						</Fill>
					) }
					{ /* A second Fill shows several Fills sharing one Slot. */ }
					<Fill name={ name }>
						<p>
							<em>
								{ __(
									'Second Fill (always rendered)',
									'component-kitchen-sink'
								) }
							</em>
						</p>
					</Fill>
				</SlotFillProvider>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
