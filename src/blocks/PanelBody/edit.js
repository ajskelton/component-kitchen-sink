import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Panel,
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { cog, check, starFilled, wordpress } from '@wordpress/icons';
import './editor.scss';

const ICONS = { cog, check, starFilled, wordpress };

const ICON_OPTIONS = [
	{ label: __( 'None', 'component-kitchen-sink' ), value: '' },
	...Object.keys( ICONS ).map( ( key ) => ( { label: key, value: key } ) ),
];
const OPENED_OPTIONS = [
	{ label: 'undefined (uncontrolled)', value: 'uncontrolled' },
	{ label: 'true', value: 'opened' },
	{ label: 'false', value: 'closed' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { title, initialOpen, openedMode, icon, scrollAfterOpen, toggles } =
		attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	const bodyProps = {
		title,
		initialOpen,
		// `opened` set to true or false takes control away from the toggle.
		opened: { uncontrolled: undefined, opened: true, closed: false }[
			openedMode
		],
		icon: ICONS[ icon ],
		scrollAfterOpen,
		onToggle: () => setAttributes( { toggles: toggles + 1 } ),
	};

	// PanelBody is styled for the sidebar, so the canvas copy sits in a Panel.
	const demo = (
		<Panel>
			<PanelBody { ...bodyProps }>
				<PanelRow>
					{ __(
						'Content shown when the body is open.',
						'component-kitchen-sink'
					) }
				</PanelRow>
			</PanelBody>
		</Panel>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'PanelBody', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="title"
						value={ title }
						onChange={ set( 'title' ) }
					/>
					<ToggleControl
						label="initialOpen"
						checked={ initialOpen }
						onChange={ set( 'initialOpen' ) }
					/>
					<SelectControl
						label="opened"
						value={ openedMode }
						options={ OPENED_OPTIONS }
						onChange={ set( 'openedMode' ) }
					/>
					<SelectControl
						label="icon"
						value={ icon }
						options={ ICON_OPTIONS }
						onChange={ set( 'icon' ) }
					/>
					<ToggleControl
						label="scrollAfterOpen"
						checked={ scrollAfterOpen }
						onChange={ set( 'scrollAfterOpen' ) }
					/>
					<p>
						{ __( 'onToggle calls:', 'component-kitchen-sink' ) }{ ' ' }
						<strong>{ toggles }</strong>
					</p>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { toggles: 0 } ) }
					>
						{ __( 'Reset count', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>PanelBody</h3>
				{ demo }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
