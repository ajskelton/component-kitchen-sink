import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockEditingMode,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import './editor.scss';

const MODE_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: 'contentOnly', value: 'contentOnly' },
	{ label: 'disabled', value: 'disabled' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { mode, applySeconds } = attributes;

	// The mode is only applied on demand, and only for a few seconds. A
	// persisted 'disabled' mode would make the block unselectable after a
	// reload, with no way back to this inspector.
	const [ appliedMode, setAppliedMode ] = useState( undefined );
	useEffect( () => {
		if ( ! appliedMode ) {
			return undefined;
		}
		const timer = setTimeout(
			() => setAppliedMode( undefined ),
			applySeconds * 1000
		);
		return () => clearTimeout( timer );
	}, [ appliedMode, applySeconds ] );

	// With no argument the hook only reads the mode; with one it also sets it.
	const currentMode = useBlockEditingMode( appliedMode );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'useBlockEditingMode',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="mode"
						value={ mode }
						options={ MODE_OPTIONS }
						onChange={ ( next ) => setAttributes( { mode: next } ) }
					/>
					<RangeControl
						label={ __(
							'Seconds to keep the mode applied',
							'component-kitchen-sink'
						) }
						value={ applySeconds }
						min={ 2 }
						max={ 30 }
						onChange={ ( next ) =>
							setAttributes( { applySeconds: next ?? 6 } )
						}
					/>
					<Button
						variant="secondary"
						onClick={ () => setAppliedMode( mode ) }
					>
						{ __( 'Apply mode now', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useBlockEditingMode</h3>
				<p>
					{ __(
						'Choose a mode in the inspector and apply it. It reverts by itself, so a "disabled" block (which cannot be selected) is not lost.',
						'component-kitchen-sink'
					) }
				</p>
				<pre>
					{ JSON.stringify(
						{
							argument: appliedMode ?? null,
							returned: currentMode,
							attributeMode: mode,
						},
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
