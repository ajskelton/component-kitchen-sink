import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalPublishDateTimePicker as PublishDateTimePicker,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { currentDate, is12Hour, title, showPopoverHeader, closeClicks } =
		attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	// An empty currentDate stands for "now" (the picker's default).
	const pickerProps = {
		currentDate: currentDate || undefined,
		onChange: ( next ) => setAttributes( { currentDate: next ?? '' } ),
		is12Hour,
		title: title || undefined,
		showPopoverHeader,
		onClose: () => setAttributes( { closeClicks: closeClicks + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'PublishDateTimePicker',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="title"
						value={ title }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
						}
					/>
					<ToggleControl
						label="is12Hour"
						checked={ is12Hour }
						onChange={ ( next ) =>
							setAttributes( { is12Hour: next } )
						}
					/>
					<ToggleControl
						label="showPopoverHeader"
						checked={ showPopoverHeader }
						onChange={ ( next ) =>
							setAttributes( { showPopoverHeader: next } )
						}
					/>
					<TextControl
						label="currentDate (ISO string, set by the picker)"
						value={ currentDate }
						onChange={ ( next ) =>
							setAttributes( { currentDate: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( { currentDate: '', closeClicks: 0 } )
						}
					>
						{ __(
							'Reset date and counter',
							'component-kitchen-sink'
						) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>PublishDateTimePicker</h3>
				<PublishDateTimePicker { ...pickerProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
