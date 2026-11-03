import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Component } from '@wordpress/element';
import {
	Button,
	PanelBody,
	TextControl,
	withFocusOutside,
} from '@wordpress/components';
import './editor.scss';

/**
 * withFocusOutside only works on class components that define a
 * `handleFocusOutside` method; it binds to the instance through a ref.
 */
class InsideArea extends Component {
	handleFocusOutside() {
		this.props.onFocusOutside();
	}

	render() {
		const { value, onChange } = this.props;
		return (
			<div style={ { padding: 8, border: '1px solid' } }>
				<TextControl
					label={ __( 'First input', 'component-kitchen-sink' ) }
					value={ value }
					onChange={ onChange }
				/>
				<TextControl
					label={ __(
						'Second input (moving here is not outside)',
						'component-kitchen-sink'
					) }
					value=""
					onChange={ () => {} }
				/>
			</div>
		);
	}
}

// Created once at module level, never inside render.
const InsideAreaWithFocusOutside = withFocusOutside( InsideArea );

export default function Edit( { attributes, setAttributes } ) {
	const { outsideCount, inside } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'withFocusOutside', 'component-kitchen-sink' ) }
				>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { outsideCount: 0 } ) }
					>
						{ __( 'Reset count', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>withFocusOutside</h3>
				<InsideAreaWithFocusOutside
					value={ inside }
					onChange={ ( next ) => setAttributes( { inside: next } ) }
					onFocusOutside={ () =>
						setAttributes( { outsideCount: outsideCount + 1 } )
					}
				/>
				<Button variant="secondary">
					{ __(
						'Outside button: focus it',
						'component-kitchen-sink'
					) }
				</Button>
				<p>{ `handleFocusOutside called ${ outsideCount } times` }</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
