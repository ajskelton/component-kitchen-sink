import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Icon,
	PanelBody,
	SelectControl,
	Snackbar,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { check, info } from '@wordpress/icons';
import './editor.scss';

const ICONS = { check, info };

const ICON_OPTIONS = [
	{ label: __( 'None', 'component-kitchen-sink' ), value: '' },
	{ label: 'check', value: 'check' },
	{ label: 'info', value: 'info' },
];

const POLITENESS_OPTIONS = [
	{ label: 'polite', value: 'polite' },
	{ label: 'assertive', value: 'assertive' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		content,
		explicitDismiss,
		icon,
		politeness,
		actionLabel,
		openInNewTab,
		actionUrl,
		shown,
		dismissals,
		actionClicks,
	} = attributes;
	const [ isVisible, setIsVisible ] = useState( false );

	const show = () => {
		setAttributes( { shown: shown + 1 } );
		setIsVisible( true );
	};

	// Every prop exercised by this block, shared by the inspector and canvas.
	const snackbarProps = {
		explicitDismiss,
		icon: ICONS[ icon ] ? <Icon icon={ ICONS[ icon ] } /> : undefined,
		politeness,
		actions: actionLabel
			? [
					{
						label: actionLabel,
						url: actionUrl || undefined,
						openInNewTab,
						onClick: () =>
							setAttributes( { actionClicks: actionClicks + 1 } ),
					},
				]
			: undefined,
		onDismiss: () => setAttributes( { dismissals: dismissals + 1 } ),
		// A Snackbar removes itself after a timeout unless explicitDismiss.
		onRemove: () => setIsVisible( false ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Snackbar', 'component-kitchen-sink' ) }>
					<TextControl
						label="children"
						value={ content }
						onChange={ ( next ) =>
							setAttributes( { content: next } )
						}
					/>
					<ToggleControl
						label="explicitDismiss"
						help={ __(
							'Off: the Snackbar removes itself after 6 seconds (10 with an action).',
							'component-kitchen-sink'
						) }
						checked={ explicitDismiss }
						onChange={ ( next ) =>
							setAttributes( { explicitDismiss: next } )
						}
					/>
					<SelectControl
						label="icon"
						value={ icon }
						options={ ICON_OPTIONS }
						onChange={ ( next ) => setAttributes( { icon: next } ) }
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
					<TextControl
						label="actions[0].url"
						help={ __(
							'Use an in-page anchor such as #top; never a third-party URL.',
							'component-kitchen-sink'
						) }
						value={ actionUrl }
						onChange={ ( next ) =>
							setAttributes( { actionUrl: next } )
						}
					/>
					<ToggleControl
						label="actions[0].openInNewTab"
						checked={ openInNewTab }
						onChange={ ( next ) =>
							setAttributes( { openInNewTab: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( {
								shown: 0,
								dismissals: 0,
								actionClicks: 0,
							} )
						}
					>
						{ __( 'Reset counters', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Snackbar</h3>
				<Button variant="secondary" onClick={ show }>
					{ __( 'Show Snackbar', 'component-kitchen-sink' ) }
				</Button>
				{ isVisible && (
					<div className="ajs-snackbar-stage">
						<Snackbar { ...snackbarProps }>{ content }</Snackbar>
					</div>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
