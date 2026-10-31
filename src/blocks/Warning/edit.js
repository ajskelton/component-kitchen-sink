import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	Warning,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const {
		message,
		className,
		withActions,
		actionLabel,
		withSecondaryActions,
		clicks,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const warningProps = {
		className: className || undefined,
		actions: withActions
			? [
					<Button
						key="fix"
						variant="primary"
						onClick={ () =>
							setAttributes( { clicks: clicks + 1 } )
						}
					>
						{ actionLabel }
					</Button>,
				]
			: undefined,
		secondaryActions: withSecondaryActions
			? [
					{
						title: __( 'Get help', 'component-kitchen-sink' ),
						onClick: () => setAttributes( { clicks: clicks + 1 } ),
					},
					{
						title: __( 'Reset clicks', 'component-kitchen-sink' ),
						onClick: () => setAttributes( { clicks: 0 } ),
					},
				]
			: undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Warning', 'component-kitchen-sink' ) }>
					<TextControl
						label="children"
						value={ message }
						onChange={ ( next ) =>
							setAttributes( { message: next } )
						}
					/>
					<TextControl
						label="className"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
					<ToggleControl
						label="actions"
						checked={ withActions }
						onChange={ ( next ) =>
							setAttributes( { withActions: next } )
						}
					/>
					<TextControl
						label="actions[0] label"
						value={ actionLabel }
						disabled={ ! withActions }
						onChange={ ( next ) =>
							setAttributes( { actionLabel: next } )
						}
					/>
					<ToggleControl
						label="secondaryActions"
						checked={ withSecondaryActions }
						onChange={ ( next ) =>
							setAttributes( { withSecondaryActions: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Warning</h3>
				<Warning { ...warningProps }>{ message }</Warning>
				<p>{ `Action clicks: ${ clicks }` }</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
