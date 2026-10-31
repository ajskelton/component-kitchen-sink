import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RecursionProvider,
	useHasRecursion,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

// One level of a recursive tree. Each level asks the hook whether its id was
// already rendered above it; if not it wraps its child in the provider.
function Level( { depth, levels, sameId, blockName } ) {
	// With sameId every level reuses one id, so the second level is flagged.
	const uniqueId = sameId ? 'shared-id' : 'level-' + depth;
	const hasRecursion = useHasRecursion( uniqueId, blockName || undefined );

	if ( hasRecursion ) {
		return (
			<div style={ { color: '#cc1818' } }>
				{ 'Level ' +
					depth +
					': hasRecursion = true (id "' +
					uniqueId +
					'" already rendered above), stopped.' }
			</div>
		);
	}

	return (
		<RecursionProvider
			uniqueId={ uniqueId }
			blockName={ blockName || undefined }
		>
			<div
				style={ {
					paddingLeft: '16px',
					borderLeft: '2px solid #949494',
				} }
			>
				{ 'Level ' +
					depth +
					': hasRecursion = false, rendered inside the provider.' }
				{ depth < levels && (
					<Level
						depth={ depth + 1 }
						levels={ levels }
						sameId={ sameId }
						blockName={ blockName }
					/>
				) }
			</div>
		</RecursionProvider>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { levels, sameId, blockName } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'useHasRecursion', 'component-kitchen-sink' ) }
				>
					<RangeControl
						label="levels rendered (not a prop)"
						min={ 1 }
						max={ 5 }
						value={ levels }
						onChange={ ( next ) =>
							setAttributes( { levels: next } )
						}
					/>
					<ToggleControl
						label="uniqueId: same id at every level"
						help={ __(
							'On: the second level detects recursion. Off: every level gets its own id.',
							'component-kitchen-sink'
						) }
						checked={ sameId }
						onChange={ ( next ) =>
							setAttributes( { sameId: next } )
						}
					/>
					<TextControl
						label="blockName"
						help={ __(
							'Ids are tracked per block name. Empty falls back to the current block edit context name.',
							'component-kitchen-sink'
						) }
						value={ blockName }
						onChange={ ( next ) =>
							setAttributes( { blockName: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useHasRecursion</h3>
				<p>
					The useHasRecursion hook reports, per level, whether the id
					was already rendered above (drawn with RecursionProvider).
				</p>
				<Level
					depth={ 1 }
					levels={ levels }
					sameId={ sameId }
					blockName={ blockName }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
