import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Fill,
	PanelBody,
	Slot,
	SlotFillProvider,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const SLOT_NAME = 'ajs-provider-demo';

export default function Edit( { attributes, setAttributes } ) {
	const { nested, passthrough, outerFill, innerFill } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'SlotFillProvider', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="nested provider"
						checked={ nested }
						help={ __(
							'Render a second SlotFillProvider inside the first one.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { nested: next } )
						}
					/>
					<ToggleControl
						label="passthrough (nested provider)"
						checked={ passthrough }
						disabled={ ! nested }
						help={ __(
							'Without passthrough the nested provider gets its own registry, so its Fill never reaches the outer Slot; with passthrough it joins the parent registry and appears there.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { passthrough: next } )
						}
					/>
					<ToggleControl
						label="outer Fill"
						checked={ outerFill }
						onChange={ ( next ) =>
							setAttributes( { outerFill: next } )
						}
					/>
					<ToggleControl
						label="nested Fill"
						checked={ innerFill }
						disabled={ ! nested }
						onChange={ ( next ) =>
							setAttributes( { innerFill: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>SlotFillProvider</h3>
				<SlotFillProvider>
					<p>
						{ __( 'Outer Slot output:', 'component-kitchen-sink' ) }
					</p>
					<div style={ { padding: 8, border: '1px solid' } }>
						<Slot name={ SLOT_NAME } />
					</div>
					{ outerFill && (
						<Fill name={ SLOT_NAME }>
							<p>
								{ __(
									'Fill from the outer provider',
									'component-kitchen-sink'
								) }
							</p>
						</Fill>
					) }
					{ nested && (
						<SlotFillProvider passthrough={ passthrough }>
							{ innerFill && (
								<Fill name={ SLOT_NAME }>
									<p>
										{ __(
											'Fill from the nested provider',
											'component-kitchen-sink'
										) }
									</p>
								</Fill>
							) }
						</SlotFillProvider>
					) }
				</SlotFillProvider>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
