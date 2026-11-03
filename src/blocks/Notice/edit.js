import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Notice,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const STATUS_OPTIONS = [
	{ label: 'info', value: 'info' },
	{ label: 'success', value: 'success' },
	{ label: 'warning', value: 'warning' },
	{ label: 'error', value: 'error' },
];

const POLITENESS_OPTIONS = [
	{ label: 'default (from status)', value: 'default' },
	{ label: 'polite', value: 'polite' },
	{ label: 'assertive', value: 'assertive' },
];

const ACTION_VARIANT_OPTIONS = [
	{ label: 'default (from url)', value: 'default' },
	{ label: 'primary', value: 'primary' },
	{ label: 'secondary', value: 'secondary' },
	{ label: 'link', value: 'link' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		content,
		status,
		isDismissible,
		politeness,
		spokenMessage,
		actionLabel,
		actionVariant,
		useHTML,
		dismissals,
		actionClicks,
	} = attributes;
	const [ isVisible, setIsVisible ] = useState( true );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const noticeProps = {
		status,
		isDismissible,
		politeness: politeness === 'default' ? undefined : politeness,
		spokenMessage: spokenMessage || undefined,
		__unstableHTML: useHTML,
		actions: actionLabel
			? [
					{
						label: actionLabel,
						variant:
							actionVariant === 'default'
								? undefined
								: actionVariant,
						onClick: () =>
							setAttributes( { actionClicks: actionClicks + 1 } ),
					},
				]
			: undefined,
		// onRemove hides the Notice; onDismiss fires first and is counted.
		onDismiss: () => setAttributes( { dismissals: dismissals + 1 } ),
		onRemove: () => setIsVisible( false ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Notice', 'component-kitchen-sink' ) }>
					<TextControl
						label="children"
						help={ __(
							'With __unstableHTML on, HTML such as <strong>bold</strong> is rendered.',
							'component-kitchen-sink'
						) }
						value={ content }
						onChange={ ( next ) =>
							setAttributes( { content: next } )
						}
					/>
					<SelectControl
						label="status"
						value={ status }
						options={ STATUS_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { status: next } )
						}
					/>
					<ToggleControl
						label="isDismissible"
						checked={ isDismissible }
						onChange={ ( next ) =>
							setAttributes( { isDismissible: next } )
						}
					/>
					<SelectControl
						label="politeness"
						value={ politeness }
						options={ POLITENESS_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { politeness: next } )
						}
					/>
					<TextControl
						label="spokenMessage"
						value={ spokenMessage }
						onChange={ ( next ) =>
							setAttributes( { spokenMessage: next } )
						}
					/>
					<ToggleControl
						label="__unstableHTML"
						checked={ useHTML }
						onChange={ ( next ) =>
							setAttributes( { useHTML: next } )
						}
					/>
					<TextControl
						label="actions[0].label"
						help={ __(
							'Leave empty for no action.',
							'component-kitchen-sink'
						) }
						value={ actionLabel }
						onChange={ ( next ) =>
							setAttributes( { actionLabel: next } )
						}
					/>
					<SelectControl
						label="actions[0].variant"
						value={ actionVariant }
						options={ ACTION_VARIANT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { actionVariant: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => {
							setAttributes( { dismissals: 0, actionClicks: 0 } );
							setIsVisible( true );
						} }
					>
						{ __( 'Reset and show', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Notice</h3>
				{ isVisible ? (
					<Notice { ...noticeProps }>{ content }</Notice>
				) : (
					<Button
						variant="secondary"
						onClick={ () => setIsVisible( true ) }
					>
						{ __( 'Show Notice again', 'component-kitchen-sink' ) }
					</Button>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
