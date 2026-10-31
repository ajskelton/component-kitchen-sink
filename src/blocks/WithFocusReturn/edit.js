import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	withFocusReturn,
} from '@wordpress/components';
import './editor.scss';

const MODE_OPTIONS = [
	{ label: 'withFocusReturn( Component )', value: 'default' },
	{
		label: 'withFocusReturn( { onFocusReturn } )( Component )',
		value: 'custom',
	},
];

/**
 * The wrapped component: it grabs focus when it mounts.
 *
 * @param {Object}     props         Component props.
 * @param {() => void} props.onClose Unmounts the panel.
 */
function Panel( { onClose } ) {
	return (
		<div style={ { padding: 8, border: '1px solid' } }>
			<TextControl
				label={ __( 'Focused on mount', 'component-kitchen-sink' ) }
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus
				value=""
				onChange={ () => {} }
			/>
			<Button variant="secondary" onClick={ onClose }>
				{ __( 'Close (unmount)', 'component-kitchen-sink' ) }
			</Button>
		</div>
	);
}

// HOCs are created once, at module level, never inside render.
const PanelWithFocusReturn = withFocusReturn( Panel );

// The options form lets the caller replace the default focus return. Returning
// `false` skips the default behaviour; the holder lets the block observe it.
const customReturnHandler = { current: () => {} };
const PanelWithCustomFocusReturn = withFocusReturn( {
	onFocusReturn() {
		customReturnHandler.current();
		return false;
	},
} )( Panel );

export default function Edit( { attributes, setAttributes } ) {
	const { mode, openCount, customReturns } = attributes;
	const [ isOpen, setIsOpen ] = useState( false );

	customReturnHandler.current = () =>
		setAttributes( { customReturns: customReturns + 1 } );

	const Enhanced =
		mode === 'custom' ? PanelWithCustomFocusReturn : PanelWithFocusReturn;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'withFocusReturn', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="form"
						value={ mode }
						options={ MODE_OPTIONS }
						onChange={ ( next ) => setAttributes( { mode: next } ) }
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( { openCount: 0, customReturns: 0 } )
						}
					>
						{ __( 'Reset counters', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>withFocusReturn</h3>
				<Button
					variant="secondary"
					onClick={ () => {
						setIsOpen( true );
						setAttributes( { openCount: openCount + 1 } );
					} }
				>
					{ __( 'Open panel', 'component-kitchen-sink' ) }
				</Button>
				{ isOpen && <Enhanced onClose={ () => setIsOpen( false ) } /> }
				<p>
					{ __(
						'Click Open, then Close: focus returns to Open (default) or the custom handler runs instead.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
