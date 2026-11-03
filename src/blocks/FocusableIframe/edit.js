import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	FocusableIframe,
	PanelBody,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

// Static markup only: the iframe never loads a third-party URL.
const SRC_DOC =
	'<!doctype html><html><body style="font-family:sans-serif;margin:8px"><p>Static iframe content.</p><input aria-label="Field inside the iframe" value="Click or focus me"></body></html>';

export default function Edit( { attributes, setAttributes } ) {
	const { title, height, focusCount } = attributes;
	const iframeRef = useRef();

	// Every prop exercised by this block, shared by the inspector and canvas.
	const iframeProps = {
		title,
		height,
		width: '100%',
		srcDoc: SRC_DOC,
		// iframeRef is merged with the component's own focus handling ref.
		iframeRef,
		// Focusing the iframe element itself (not its contents).
		onFocus: () => setAttributes( { focusCount: focusCount + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'FocusableIframe', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="title"
						value={ title }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
						}
					/>
					<RangeControl
						label="height"
						value={ height }
						min={ 60 }
						max={ 300 }
						onChange={ ( next ) =>
							setAttributes( { height: next ?? 120 } )
						}
					/>
					<Button
						variant="secondary"
						onClick={ () => iframeRef.current?.focus() }
					>
						{ __(
							'Focus iframe via iframeRef',
							'component-kitchen-sink'
						) }
					</Button>{ ' ' }
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { focusCount: 0 } ) }
					>
						{ __( 'Reset focusCount', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>FocusableIframe</h3>
				{ /* Deprecated since 5.9 (use the useFocusableIframe hook): logs a deprecation warning. */ }
				<FocusableIframe { ...iframeProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
