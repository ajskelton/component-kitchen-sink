import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { size, showLabel } = attributes;

	// Spinner takes no props of its own; width/height/style pass through to the svg.
	const spinnerProps = {
		width: size,
		height: size,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Spinner', 'component-kitchen-sink' ) }>
					<RangeControl
						label="width / height (svg props)"
						value={ size }
						min={ 8 }
						max={ 96 }
						onChange={ ( next ) =>
							setAttributes( { size: next ?? 16 } )
						}
					/>
					<ToggleControl
						label="show 'Loading' label beside it"
						checked={ showLabel }
						onChange={ ( next ) =>
							setAttributes( { showLabel: next } )
						}
					/>
					<div>
						<Spinner { ...spinnerProps } />
					</div>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Spinner</h3>
				<div
					style={ { display: 'flex', alignItems: 'center', gap: 8 } }
				>
					<Spinner { ...spinnerProps } />
					{ showLabel && (
						<span>
							{ __( 'Loading…', 'component-kitchen-sink' ) }
						</span>
					) }
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
