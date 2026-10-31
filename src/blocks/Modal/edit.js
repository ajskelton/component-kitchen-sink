import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Modal,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { cog } from '@wordpress/icons';
import './editor.scss';

const SIZE_OPTIONS = [
	{ label: 'small', value: 'small' },
	{ label: 'medium', value: 'medium' },
	{ label: 'large', value: 'large' },
	{ label: 'fill', value: 'fill' },
];

const FOCUS_OPTIONS = [
	{ label: 'true', value: 'true' },
	{ label: 'false', value: 'false' },
	{ label: 'firstElement', value: 'firstElement' },
	{ label: 'firstContentElement', value: 'firstContentElement' },
];

/**
 * The focusOnMount attribute is a string so it can carry the boolean values.
 *
 * @param {string} value Stored attribute value.
 * @return {boolean|string} Value for the Modal prop.
 */
function toFocusOnMount( value ) {
	if ( value === 'true' ) {
		return true;
	}
	if ( value === 'false' ) {
		return false;
	}
	return value;
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		size,
		isDismissible,
		isFullScreen,
		shouldCloseOnEsc,
		shouldCloseOnClickOutside,
		focusOnMount,
		hasHeaderActions,
		timesOpened,
		lastClosedBy,
	} = attributes;
	const [ isOpen, setIsOpen ] = useState( false );

	const open = () => {
		setAttributes( { timesOpened: timesOpened + 1 } );
		setIsOpen( true );
	};
	const close = ( reason ) => {
		setAttributes( { lastClosedBy: reason } );
		setIsOpen( false );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Modal', 'component-kitchen-sink' ) }>
					<TextControl
						label="title"
						value={ title }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
						}
					/>
					<SelectControl
						label="size"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<ToggleControl
						label="isDismissible"
						checked={ isDismissible }
						onChange={ ( next ) =>
							setAttributes( { isDismissible: next } )
						}
					/>
					<ToggleControl
						label="isFullScreen"
						checked={ isFullScreen }
						onChange={ ( next ) =>
							setAttributes( { isFullScreen: next } )
						}
					/>
					<ToggleControl
						label="shouldCloseOnEsc"
						checked={ shouldCloseOnEsc }
						onChange={ ( next ) =>
							setAttributes( { shouldCloseOnEsc: next } )
						}
					/>
					<ToggleControl
						label="shouldCloseOnClickOutside"
						checked={ shouldCloseOnClickOutside }
						onChange={ ( next ) =>
							setAttributes( { shouldCloseOnClickOutside: next } )
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
						label="headerActions"
						checked={ hasHeaderActions }
						onChange={ ( next ) =>
							setAttributes( { hasHeaderActions: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( {
								timesOpened: 0,
								lastClosedBy: '',
							} )
						}
					>
						{ __( 'Reset counters', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Modal</h3>
				<Button variant="secondary" onClick={ open }>
					{ __( 'Open Modal', 'component-kitchen-sink' ) }
				</Button>
				<p>
					{ `Opened ${ timesOpened } time(s). Last closed by: ${
						lastClosedBy || 'n/a'
					}` }
				</p>
				{ isOpen && (
					<Modal
						title={ title }
						size={ size }
						isDismissible={ isDismissible }
						isFullScreen={ isFullScreen }
						shouldCloseOnEsc={ shouldCloseOnEsc }
						shouldCloseOnClickOutside={ shouldCloseOnClickOutside }
						focusOnMount={ toFocusOnMount( focusOnMount ) }
						headerActions={
							hasHeaderActions ? (
								<Button
									icon={ cog }
									label={ __(
										'Header action',
										'component-kitchen-sink'
									) }
									onClick={ () => {} }
								/>
							) : undefined
						}
						onRequestClose={ () => close( 'onRequestClose' ) }
					>
						<p>
							{ __(
								'This is the Modal content.',
								'component-kitchen-sink'
							) }
						</p>
						<Button
							variant="primary"
							onClick={ () => close( 'custom close button' ) }
						>
							{ __( 'Close', 'component-kitchen-sink' ) }
						</Button>
					</Modal>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
