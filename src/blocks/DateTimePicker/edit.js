import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	DateTimePicker,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const START_OF_WEEK_OPTIONS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
].map( ( label, index ) => ( {
	label: `${ index } (${ label })`,
	value: String( index ),
} ) );

const DATE_ORDER_OPTIONS = [
	{ label: 'mdy', value: 'mdy' },
	{ label: 'dmy', value: 'dmy' },
	{ label: 'ymd', value: 'ymd' },
];

/**
 * Builds a few events relative to today so the calendar shows event dots.
 *
 * @return {Array<{date: Date}>} Events in the shape DateTimePicker expects.
 */
function getDemoEvents() {
	return [ 2, 5, 9 ].map( ( offset ) => {
		const date = new Date();
		date.setDate( date.getDate() + offset );
		return { date };
	} );
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		currentDate,
		is12Hour,
		dateOrder,
		startOfWeek,
		disableWeekends,
		showEvents,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const pickerProps = {
		currentDate: currentDate || null,
		is12Hour,
		dateOrder,
		startOfWeek: Number( startOfWeek ),
		isInvalidDate: disableWeekends
			? ( date ) => [ 0, 6 ].includes( date.getDay() )
			: undefined,
		events: showEvents ? getDemoEvents() : undefined,
		onChange: ( next ) => setAttributes( { currentDate: next ?? '' } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'DateTimePicker', 'component-kitchen-sink' ) }
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
					<SelectControl
						label="startOfWeek"
						value={ String( startOfWeek ) }
						options={ START_OF_WEEK_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { startOfWeek: Number( next ) } )
						}
					/>
					<ToggleControl
						label="isInvalidDate"
						help={ __(
							'Marks weekends as invalid.',
							'component-kitchen-sink'
						) }
						checked={ disableWeekends }
						onChange={ ( next ) =>
							setAttributes( { disableWeekends: next } )
						}
					/>
					<ToggleControl
						label="events"
						help={ __(
							'Adds events on three upcoming days.',
							'component-kitchen-sink'
						) }
						checked={ showEvents }
						onChange={ ( next ) =>
							setAttributes( { showEvents: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { currentDate: '' } ) }
					>
						{ __( 'Clear currentDate', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>DateTimePicker</h3>
				<DateTimePicker { ...pickerProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
