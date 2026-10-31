import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Dropdown,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const PLACEMENT_OPTIONS = [
	'top-start',
	'top',
	'top-end',
	'right-start',
	'right',
	'bottom-start',
	'bottom',
	'bottom-end',
	'left-start',
	'left',
].map( ( value ) => ( { label: value, value } ) );

const FOCUS_OPTIONS = [
	{ label: 'firstElement', value: 'firstElement' },
	{ label: 'container', value: 'container' },
	{ label: 'false', value: 'false' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		placement,
		noArrow,
		expandOnMobile,
		headerTitle,
		focusOnMount,
		defaultOpen,
		contentClassName,
		toggles,
		closes,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const dropdownProps = {
		popoverProps: { placement, noArrow },
		expandOnMobile,
		headerTitle: headerTitle || undefined,
		focusOnMount: focusOnMount === 'false' ? false : focusOnMount,
		defaultOpen,
		contentClassName: contentClassName || undefined,
		onToggle: () => setAttributes( { toggles: toggles + 1 } ),
		onClose: () => setAttributes( { closes: closes + 1 } ),
		renderToggle: ( { isOpen, onToggle } ) => (
			<Button
				variant="secondary"
				onClick={ onToggle }
				aria-expanded={ isOpen }
			>
				{ __( 'Toggle Dropdown', 'component-kitchen-sink' ) }
			</Button>
		),
		renderContent: ( { onClose } ) => (
			<div style={ { padding: 16, minWidth: 200 } }>
				<p>
					{ __(
						'This is the Dropdown content.',
						'component-kitchen-sink'
					) }
				</p>
				<Button variant="primary" onClick={ onClose }>
					{ __( 'Close', 'component-kitchen-sink' ) }
				</Button>
			</div>
		),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Dropdown', 'component-kitchen-sink' ) }>
					<SelectControl
						label="popoverProps.placement"
						value={ placement }
						options={ PLACEMENT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { placement: next } )
						}
					/>
					<ToggleControl
						label="popoverProps.noArrow"
						checked={ noArrow }
						onChange={ ( next ) =>
							setAttributes( { noArrow: next } )
						}
					/>
					<ToggleControl
						label="expandOnMobile"
						checked={ expandOnMobile }
						onChange={ ( next ) =>
							setAttributes( { expandOnMobile: next } )
						}
					/>
					<TextControl
						label="headerTitle"
						value={ headerTitle }
						onChange={ ( next ) =>
							setAttributes( { headerTitle: next } )
						}
					/>
					<SelectControl
						label="focusOnMount"
						value={ focusOnMount }
						options={ FOCUS_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { focusOnMount: next } )
						}
					/>
					<ToggleControl
						label="defaultOpen"
						help={ __(
							'Read on mount only; reselect the block to see it.',
							'component-kitchen-sink'
						) }
						checked={ defaultOpen }
						onChange={ ( next ) =>
							setAttributes( { defaultOpen: next } )
						}
					/>
					<TextControl
						label="contentClassName"
						value={ contentClassName }
						onChange={ ( next ) =>
							setAttributes( { contentClassName: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( { toggles: 0, closes: 0 } )
						}
					>
						{ __( 'Reset counters', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Dropdown</h3>
				<Dropdown { ...dropdownProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
