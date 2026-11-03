import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	ProgressBar,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { value, isIndeterminate } = attributes;

	// Omitting `value` renders the indeterminate animation.
	const barProps = {
		value: isIndeterminate ? undefined : value,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ProgressBar', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="value (omit for indeterminate)"
						checked={ isIndeterminate }
						onChange={ ( next ) =>
							setAttributes( { isIndeterminate: next } )
						}
					/>
					<RangeControl
						label="value"
						value={ value }
						min={ 0 }
						max={ 100 }
						disabled={ isIndeterminate }
						onChange={ ( next ) =>
							setAttributes( { value: next ?? 0 } )
						}
					/>
					<ProgressBar { ...barProps } />
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ProgressBar</h3>
				<ProgressBar { ...barProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
