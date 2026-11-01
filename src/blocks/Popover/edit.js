import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	Popover,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const PLACEMENT_OPTIONS = [
	'top',
	'top-start',
	'top-end',
	'right',
	'right-start',
	'right-end',
	'bottom',
	'bottom-start',
	'bottom-end',
	'left',
	'left-start',
	'left-end',
	'overlay',
].map( ( value ) => ( { label: value, value } ) );

const VARIANT_OPTIONS = [
	{ label: 'default (undefined)', value: 'default' },
	{ label: 'unstyled', value: 'unstyled' },
	{ label: 'toolbar', value: 'toolbar' },
];

const FOCUS_OPTIONS = [
	{ label: 'firstElement', value: 'firstElement' },
	{ label: 'container', value: 'container' },
	{ label: 'false', value: 'false' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		placement,
		offset,
		noArrow,
		animate,
		flip,
		shift,
		resize,
		variant,
		focusOnMount,
		expandOnMobile,
		headerTitle,
		inline,
		timesOpened,
	} = attributes;
	const [ isOpen, setIsOpen ] = useState( false );
	// The Popover anchors to this element (`anchor` prop).
	const [ anchor, setAnchor ] = useState( null );

	const popoverProps = {
		placement,
		offset,
		noArrow,
		animate,
		flip,
		shift,
		resize,
		variant: variant === 'default' ? undefined : variant,
		focusOnMount: focusOnMount === 'false' ? false : focusOnMount,
		expandOnMobile,
		headerTitle: headerTitle || undefined,
		inline,
	};

	const toggle = () => {
		if ( ! isOpen ) {
			setAttributes( { timesOpened: timesOpened + 1 } );
		}
		setIsOpen( ! isOpen );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Popover', 'component-kitchen-sink' ) }>
					<SelectControl
						label="placement"
						value={ placement }
						options={ PLACEMENT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { placement: next } )
						}
					/>
					<RangeControl
						label="offset"
						value={ offset }
						min={ 0 }
						max={ 50 }
						onChange={ ( next ) =>
							setAttributes( { offset: next ?? 0 } )
						}
					/>
					<ToggleControl
						label="noArrow"
						checked={ noArrow }
						onChange={ ( next ) =>
							setAttributes( { noArrow: next } )
						}
					/>
					<ToggleControl
						label="animate"
						checked={ animate }
						onChange={ ( next ) =>
							setAttributes( { animate: next } )
						}
					/>
					<ToggleControl
						label="flip"
						checked={ flip }
						onChange={ ( next ) => setAttributes( { flip: next } ) }
					/>
					<ToggleControl
						label="shift"
						checked={ shift }
						onChange={ ( next ) =>
							setAttributes( { shift: next } )
						}
					/>
					<ToggleControl
						label="resize"
						checked={ resize }
						onChange={ ( next ) =>
							setAttributes( { resize: next } )
						}
					/>
					<SelectControl
						label="variant"
						value={ variant }
						options={ VARIANT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { variant: next } )
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
						label="expandOnMobile"
						checked={ expandOnMobile }
						onChange={ ( next ) =>
							setAttributes( { expandOnMobile: next } )
						}
					/>
					<TextControl
						label="headerTitle"
						value={ headerTitle }
						help={ __(
							'Shown only when expandOnMobile is on and the viewport is small.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { headerTitle: next } )
						}
					/>
					<ToggleControl
						label="inline"
						checked={ inline }
						onChange={ ( next ) =>
							setAttributes( { inline: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { timesOpened: 0 } ) }
					>
						{ __( 'Reset timesOpened', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Popover</h3>
				<span ref={ setAnchor } className="ajs-popover-anchor">
					<Button variant="secondary" onClick={ toggle }>
						{ isOpen
							? __( 'Close Popover', 'component-kitchen-sink' )
							: __( 'Open Popover', 'component-kitchen-sink' ) }
					</Button>
				</span>
				{ isOpen && (
					<Popover
						{ ...popoverProps }
						anchor={ anchor }
						onClose={ () => setIsOpen( false ) }
					>
						<div style={ { padding: 16, minWidth: 200 } }>
							{ __(
								'This is the Popover content.',
								'component-kitchen-sink'
							) }
							{ /* A focusable child, so focusOnMount has a target and Escape (handled by the popover dialog) closes it. */ }
							<div style={ { marginTop: 8 } }>
								<Button
									variant="tertiary"
									size="compact"
									onClick={ () => setIsOpen( false ) }
								>
									{ __( 'Close', 'component-kitchen-sink' ) }
								</Button>
							</div>
						</div>
					</Popover>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
