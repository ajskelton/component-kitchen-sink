import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	Tooltip,
} from '@wordpress/components';
import './editor.scss';

const PLACEMENT_OPTIONS = [
	'top',
	'top-start',
	'top-end',
	'right',
	'bottom',
	'bottom-start',
	'bottom-end',
	'left',
].map( ( value ) => ( { label: value, value } ) );

export default function Edit( { attributes, setAttributes } ) {
	const { text, shortcut, placement, delay, hideOnClick } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const tooltipProps = {
		text,
		shortcut: shortcut || undefined,
		placement,
		delay,
		hideOnClick,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Tooltip', 'component-kitchen-sink' ) }>
					<TextControl
						label="text"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<TextControl
						label="shortcut"
						help={ __(
							'For example: mod+shift+k',
							'component-kitchen-sink'
						) }
						value={ shortcut }
						onChange={ ( next ) =>
							setAttributes( { shortcut: next } )
						}
					/>
					<SelectControl
						label="placement"
						value={ placement }
						options={ PLACEMENT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { placement: next } )
						}
					/>
					<RangeControl
						label="delay (ms)"
						value={ delay }
						min={ 0 }
						max={ 2000 }
						step={ 50 }
						onChange={ ( next ) =>
							setAttributes( { delay: next ?? 700 } )
						}
					/>
					<ToggleControl
						label="hideOnClick"
						checked={ hideOnClick }
						onChange={ ( next ) =>
							setAttributes( { hideOnClick: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Tooltip</h3>
				<p>
					{ __(
						'Hover or focus the button to see the Tooltip.',
						'component-kitchen-sink'
					) }
				</p>
				<Tooltip { ...tooltipProps }>
					<Button variant="secondary">
						{ __( 'Hover me', 'component-kitchen-sink' ) }
					</Button>
				</Tooltip>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
