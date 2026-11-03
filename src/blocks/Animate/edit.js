import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Animate,
	Button,
	PanelBody,
	SelectControl,
} from '@wordpress/components';
import './editor.scss';

const TYPE_OPTIONS = [
	{ label: 'appear', value: 'appear' },
	{ label: 'slide-in', value: 'slide-in' },
	{ label: 'loading', value: 'loading' },
	{ label: 'none (undefined)', value: 'none' },
];

const APPEAR_ORIGINS = [
	'top',
	'top left',
	'top right',
	'middle',
	'middle left',
	'middle right',
	'bottom',
	'bottom left',
	'bottom right',
];

const ORIGIN_OPTIONS = {
	appear: APPEAR_ORIGINS.map( ( value ) => ( { label: value, value } ) ),
	'slide-in': [
		{ label: 'left', value: 'left' },
		{ label: 'right', value: 'right' },
	],
};

export default function Edit( { attributes, setAttributes } ) {
	const { type, origin, replays } = attributes;
	// Changing the key remounts the demo so the animation runs again.
	const [ runKey, setRunKey ] = useState( 0 );

	const originOptions = ORIGIN_OPTIONS[ type ];
	const validOrigin = originOptions?.some( ( o ) => o.value === origin )
		? origin
		: originOptions?.[ 0 ].value;

	// Every prop exercised by this block (`options.origin` only applies to
	// the appear and slide-in types).
	const animateProps =
		type === 'none'
			? {}
			: {
					type,
					options: originOptions
						? { origin: validOrigin }
						: undefined,
				};

	const replay = () => {
		setRunKey( runKey + 1 );
		setAttributes( { replays: replays + 1 } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Animate', 'component-kitchen-sink' ) }>
					<SelectControl
						label="type"
						value={ type }
						options={ TYPE_OPTIONS }
						onChange={ ( next ) => setAttributes( { type: next } ) }
					/>
					<SelectControl
						label="options.origin"
						value={ validOrigin ?? '' }
						options={
							originOptions ?? [
								{
									label: __(
										'n/a for this type',
										'component-kitchen-sink'
									),
									value: '',
								},
							]
						}
						disabled={ ! originOptions }
						onChange={ ( next ) =>
							setAttributes( { origin: next } )
						}
					/>
					<Button variant="secondary" onClick={ replay }>
						{ __( 'Replay animation', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Animate</h3>
				<Button variant="secondary" onClick={ replay }>
					{ __( 'Replay animation', 'component-kitchen-sink' ) }
				</Button>
				{ /* Animate is deprecated since 7.2: it logs a deprecation warning. */ }
				<Animate key={ runKey } { ...animateProps }>
					{ ( { className } ) => (
						<div
							className={ className }
							style={ {
								marginTop: 12,
								padding: 16,
								background: '#f0f0f0',
								width: 'fit-content',
							} }
						>
							{ `className: ${ className ?? '(none)' }` }
						</div>
					) }
				</Animate>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
