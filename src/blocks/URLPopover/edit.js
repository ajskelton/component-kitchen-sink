import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	URLPopover,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

const PLACEMENT_OPTIONS = [
	'bottom',
	'bottom-start',
	'bottom-end',
	'top',
	'top-start',
	'right',
	'left',
].map( ( value ) => ( { label: value, value } ) );

const FOCUS_OPTIONS = [ 'firstElement', 'firstContentElement', 'false' ].map(
	( value ) => ( { label: value, value } )
);

export default function Edit( { attributes, setAttributes } ) {
	const {
		url,
		opensInNewWindow,
		placement,
		focusOnMount,
		withSettings,
		withAdditionalControls,
	} = attributes;
	const [ isVisible, setIsVisible ] = useState( false );
	const [ isEditing, setIsEditing ] = useState( false );

	// Every URLPopover prop exercised by this block.
	const popoverProps = {
		placement,
		focusOnMount: focusOnMount === 'false' ? false : focusOnMount,
		onClose: () => setIsVisible( false ),
		renderSettings: withSettings
			? () => (
					<ToggleControl
						label={ __(
							'Open in new tab',
							'component-kitchen-sink'
						) }
						checked={ opensInNewWindow }
						onChange={ ( next ) =>
							setAttributes( { opensInNewWindow: next } )
						}
					/>
				)
			: undefined,
		additionalControls: withAdditionalControls ? (
			<Button
				variant="tertiary"
				size="compact"
				onClick={ () => setAttributes( { url: '' } ) }
			>
				{ __( 'Clear URL', 'component-kitchen-sink' ) }
			</Button>
		) : undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'URLPopover', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="placement"
						value={ placement }
						options={ PLACEMENT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { placement: next } )
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
						label="renderSettings"
						checked={ withSettings }
						onChange={ ( next ) =>
							setAttributes( { withSettings: next } )
						}
					/>
					<ToggleControl
						label="additionalControls"
						checked={ withAdditionalControls }
						onChange={ ( next ) =>
							setAttributes( { withAdditionalControls: next } )
						}
					/>
					<TextControl
						label="url (LinkViewer / LinkEditor value)"
						value={ url }
						onChange={ ( next ) => setAttributes( { url: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>URLPopover</h3>
				<Button
					variant="secondary"
					onClick={ () => {
						setIsEditing( false );
						setIsVisible( ! isVisible );
					} }
				>
					{ __( 'Toggle URLPopover', 'component-kitchen-sink' ) }
				</Button>
				{ /* The popover is anchored to its parent, this wrapper. */ }
				{ isVisible && (
					<URLPopover { ...popoverProps }>
						{ isEditing ? (
							<URLPopover.LinkEditor
								value={ url }
								onChangeInputValue={ ( next ) =>
									setAttributes( { url: next } )
								}
								onSubmit={ ( event ) => {
									event.preventDefault();
									setIsEditing( false );
								} }
							/>
						) : (
							<URLPopover.LinkViewer
								url={ url }
								onEditLinkClick={ () => setIsEditing( true ) }
							/>
						) }
					</URLPopover>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
