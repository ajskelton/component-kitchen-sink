import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useContext } from '@wordpress/element';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__experimentalToolbarContext as ToolbarContext,
	PanelBody,
	ToggleControl,
	Toolbar,
	ToolbarButton,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { starFilled } from '@wordpress/icons';
import './editor.scss';

/**
 * Child that reads ToolbarContext. Inside a `Toolbar` the context holds an
 * Ariakit toolbar store; outside it is `undefined`.
 *
 * @param {Object}     props         Component props.
 * @param {number}     props.clicks  Click count, only used to re-render.
 * @param {() => void} props.onClick Click handler.
 */
function ContextReader( { clicks, onClick } ) {
	const store = useContext( ToolbarContext );
	const state = store?.getState?.();

	return (
		<>
			<ToolbarButton
				icon={ starFilled }
				label={ __( 'Click to re-render', 'component-kitchen-sink' ) }
				onClick={ onClick }
			/>
			<span style={ { padding: '0 8px', fontSize: 12 } }>
				{ store
					? `store: present, activeId: ${ state?.activeId ?? 'none' }, orientation: ${ state?.orientation }`
					: 'store: undefined' }
				{ ` (renders after ${ clicks } clicks)` }
			</span>
		</>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { hasToolbar, clicks } = attributes;

	const readerProps = {
		clicks,
		onClick: () => setAttributes( { clicks: clicks + 1 } ),
	};

	const renderDemo = () =>
		hasToolbar ? (
			<Toolbar
				label={ __( 'ToolbarContext demo', 'component-kitchen-sink' ) }
			>
				<ContextReader { ...readerProps } />
			</Toolbar>
		) : (
			<div>
				{ /* Outside a Toolbar the context is undefined and ToolbarButton falls back to a plain Button. */ }
				<ContextReader { ...readerProps } />
			</div>
		);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ToolbarContext', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="wrap child in Toolbar"
						checked={ hasToolbar }
						onChange={ ( next ) =>
							setAttributes( { hasToolbar: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ToolbarContext</h3>
				{ renderDemo() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
