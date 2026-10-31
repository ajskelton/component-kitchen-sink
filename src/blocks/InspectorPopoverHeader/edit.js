import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalInspectorPopoverHeader as InspectorPopoverHeader,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	BaseControl,
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { cog } from '@wordpress/icons';
import './editor.scss';

const ACTION_OPTIONS = [
	{ label: 'none', value: 'none' },
	{ label: 'text action', value: 'text' },
	{ label: 'icon action', value: 'icon' },
	{ label: 'both actions', value: 'both' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { title, help, actionMode, showClose, actionClicks, closeClicks } =
		attributes;

	const actions = [];
	if ( actionMode === 'text' || actionMode === 'both' ) {
		actions.push( {
			label: __( 'Reset', 'component-kitchen-sink' ),
			onClick: () => setAttributes( { actionClicks: actionClicks + 1 } ),
		} );
	}
	if ( actionMode === 'icon' || actionMode === 'both' ) {
		actions.push( {
			label: __( 'Settings', 'component-kitchen-sink' ),
			icon: cog,
			onClick: () => setAttributes( { actionClicks: actionClicks + 1 } ),
		} );
	}

	// Every prop exercised by this block, shared by the inspector and canvas.
	const headerProps = {
		title,
		help: help || undefined,
		actions,
		onClose: showClose
			? () => setAttributes( { closeClicks: closeClicks + 1 } )
			: undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'InspectorPopoverHeader',
						'component-kitchen-sink'
					) }
				>
					<BaseControl
						id="ajs-inspector-popover-header-preview"
						label={ __( 'Preview', 'component-kitchen-sink' ) }
						help={ __(
							'Action and close buttons increment their counters.',
							'component-kitchen-sink'
						) }
					>
						<div>
							<InspectorPopoverHeader { ...headerProps } />
						</div>
					</BaseControl>
					<TextControl
						label="title"
						value={ title }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
						}
					/>
					<TextControl
						label="help"
						value={ help }
						onChange={ ( next ) => setAttributes( { help: next } ) }
					/>
					<SelectControl
						label="actions"
						value={ actionMode }
						options={ ACTION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { actionMode: next } )
						}
					/>
					<ToggleControl
						label="onClose (shows the close button)"
						checked={ showClose }
						onChange={ ( next ) =>
							setAttributes( { showClose: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( { actionClicks: 0, closeClicks: 0 } )
						}
					>
						{ __( 'Reset counters', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>InspectorPopoverHeader</h3>
				<InspectorPopoverHeader { ...headerProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
