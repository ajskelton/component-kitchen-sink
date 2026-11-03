import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	TimePicker,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const DATE_ORDER_OPTIONS = [
	{ label: 'mdy', value: 'mdy' },
	{ label: 'dmy', value: 'dmy' },
	{ label: 'ymd', value: 'ymd' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { currentTime, is12Hour, dateOrder, hideLabelFromVision } =
		attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const pickerProps = {
		currentTime: currentTime || null,
		is12Hour,
		dateOrder,
		hideLabelFromVision,
		onChange: ( next ) => setAttributes( { currentTime: next ?? '' } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'TimePicker', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="is12Hour"
						checked={ is12Hour }
						onChange={ ( next ) =>
							setAttributes( { is12Hour: next } )
						}
					/>
					<SelectControl
						label="dateOrder"
						value={ dateOrder }
						options={ DATE_ORDER_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { dateOrder: next } )
						}
					/>
					<ToggleControl
						label="hideLabelFromVision"
						checked={ hideLabelFromVision }
						onChange={ ( next ) =>
							setAttributes( { hideLabelFromVision: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { currentTime: '' } ) }
					>
						{ __( 'Clear currentTime', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>TimePicker</h3>
				<TimePicker { ...pickerProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
