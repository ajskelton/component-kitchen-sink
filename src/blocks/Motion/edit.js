import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__unstableMotion as Motion,
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const EASE_OPTIONS = [
	{ label: 'linear', value: 'linear' },
	{ label: 'easeIn', value: 'easeIn' },
	{ label: 'easeOut', value: 'easeOut' },
	{ label: 'easeInOut', value: 'easeInOut' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { x, rotate, scale, opacity, duration, ease, whileHoverScale } =
		attributes;

	// `animate` is the target state; framer-motion tweens to it on every change.
	const motionProps = {
		animate: { x, rotate, scale, opacity },
		transition: { duration, ease },
		whileHover: whileHoverScale ? { scale: scale * 1.1 } : undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Motion', 'component-kitchen-sink' ) }>
					<RangeControl
						label="animate.x"
						value={ x }
						min={ -100 }
						max={ 200 }
						onChange={ ( next ) =>
							setAttributes( { x: next ?? 0 } )
						}
					/>
					<RangeControl
						label="animate.rotate"
						value={ rotate }
						min={ -180 }
						max={ 180 }
						onChange={ ( next ) =>
							setAttributes( { rotate: next ?? 0 } )
						}
					/>
					<RangeControl
						label="animate.scale"
						value={ scale }
						min={ 0.2 }
						max={ 2 }
						step={ 0.1 }
						onChange={ ( next ) =>
							setAttributes( { scale: next ?? 1 } )
						}
					/>
					<RangeControl
						label="animate.opacity"
						value={ opacity }
						min={ 0 }
						max={ 1 }
						step={ 0.1 }
						onChange={ ( next ) =>
							setAttributes( { opacity: next ?? 1 } )
						}
					/>
					<RangeControl
						label="transition.duration"
						value={ duration }
						min={ 0 }
						max={ 3 }
						step={ 0.1 }
						onChange={ ( next ) =>
							setAttributes( { duration: next ?? 0.5 } )
						}
					/>
					<SelectControl
						label="transition.ease"
						value={ ease }
						options={ EASE_OPTIONS }
						onChange={ ( next ) => setAttributes( { ease: next } ) }
					/>
					<ToggleControl
						label="whileHover"
						checked={ whileHoverScale }
						onChange={ ( next ) =>
							setAttributes( { whileHoverScale: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( {
								x: 0,
								rotate: 0,
								scale: 1,
								opacity: 1,
							} )
						}
					>
						{ __( 'Reset animate', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Motion</h3>
				<div style={ { overflow: 'hidden', padding: '16px 0' } }>
					<Motion.div
						{ ...motionProps }
						style={ {
							width: 80,
							height: 80,
							background: '#3858e9',
							borderRadius: 8,
						} }
					/>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
