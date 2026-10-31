import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalBlockVariationPicker as BlockVariationPicker,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { store as blocksStore } from '@wordpress/blocks';
import {
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { layout } from '@wordpress/icons';
import metadata from './block.json';
import './editor.scss';

const ACCENTS = {
	red: '#d63638',
	green: '#00a32a',
	blue: '#2271b1',
	orange: '#dba617',
	purple: '#8c5bd6',
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		variation,
		accent,
		label,
		instructions,
		allowSkip,
		showPicker,
		hasIcon,
	} = attributes;

	// The block declares its own variations (scope "block") in block.json, so
	// the picker has something to list.
	const variations = useSelect(
		( select ) =>
			select( blocksStore ).getBlockVariations( metadata.name, 'block' ),
		[]
	);

	// Every prop exercised by this block.
	const pickerProps = {
		variations,
		label,
		instructions,
		allowSkip,
		icon: hasIcon ? layout : undefined,
		// Called with the chosen variation, or with nothing when skipped.
		onSelect: ( picked ) =>
			setAttributes( {
				variation: picked?.name ?? '',
				accent: picked?.attributes?.accent ?? '',
				showPicker: false,
			} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockVariationPicker',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="instructions"
						value={ instructions }
						onChange={ ( next ) =>
							setAttributes( { instructions: next } )
						}
					/>
					<ToggleControl
						label="allowSkip"
						checked={ allowSkip }
						onChange={ ( next ) =>
							setAttributes( { allowSkip: next } )
						}
					/>
					<ToggleControl
						label="icon"
						checked={ hasIcon }
						help={ __(
							'Off falls back to the default layout icon.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { hasIcon: next } )
						}
					/>
					<ToggleControl
						label="show the picker"
						checked={ showPicker }
						onChange={ ( next ) =>
							setAttributes( { showPicker: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( {
								variation: '',
								accent: '',
								showPicker: true,
							} )
						}
					>
						{ __( 'Reset variation', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockVariationPicker</h3>
				{ showPicker ? (
					<BlockVariationPicker { ...pickerProps } />
				) : (
					<div
						className="ajs-variation-swatch"
						style={ { background: ACCENTS[ accent ] ?? '#ddd' } }
					>
						{ variation
							? `Variation: ${ variation }`
							: __(
									'No variation chosen',
									'component-kitchen-sink'
								) }
					</div>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
