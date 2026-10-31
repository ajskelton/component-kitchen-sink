import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__unstableAnimatePresence as AnimatePresence,
	__unstableMotion as Motion,
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const MODE_OPTIONS = [
	{ label: 'sync', value: 'sync' },
	{ label: 'wait', value: 'wait' },
	{ label: 'popLayout', value: 'popLayout' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { isShown, initial, mode, duration, toggles } = attributes;

	const toggle = () =>
		setAttributes( { isShown: ! isShown, toggles: toggles + 1 } );

	// Every prop exercised by this block. `initial={ false }` skips the
	// first enter animation for children present on mount.
	const presenceProps = {
		initial,
		mode,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'AnimatePresence', 'component-kitchen-sink' ) }
				>
					<ToggleControl
						label="child present"
						checked={ isShown }
						onChange={ toggle }
					/>
					<ToggleControl
						label="initial"
						help={ __(
							'Off: children present on mount do not animate in. Reselect the block to see it.',
							'component-kitchen-sink'
						) }
						checked={ initial }
						onChange={ ( next ) =>
							setAttributes( { initial: next } )
						}
					/>
					<SelectControl
						label="mode"
						value={ mode }
						options={ MODE_OPTIONS }
						onChange={ ( next ) => setAttributes( { mode: next } ) }
					/>
					<RangeControl
						label="child transition duration"
						value={ duration }
						min={ 0.1 }
						max={ 2 }
						step={ 0.1 }
						onChange={ ( next ) =>
							setAttributes( { duration: next ?? 0.4 } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { toggles: 0 } ) }
					>
						{ __( 'Reset toggles', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>AnimatePresence</h3>
				<Button variant="secondary" onClick={ toggle }>
					{ isShown
						? __( 'Remove child', 'component-kitchen-sink' )
						: __( 'Add child', 'component-kitchen-sink' ) }
				</Button>
				<div style={ { minHeight: 100, paddingTop: 12 } }>
					<AnimatePresence { ...presenceProps }>
						{ isShown && (
							<Motion.div
								key="box"
								initial={ { opacity: 0, y: -20 } }
								animate={ { opacity: 1, y: 0 } }
								exit={ { opacity: 0, y: 20 } }
								transition={ { duration } }
								style={ {
									width: 80,
									height: 80,
									background: '#3858e9',
									borderRadius: 8,
								} }
							/>
						) }
					</AnimatePresence>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
