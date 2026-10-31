import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalBlockPatternSetup as BlockPatternSetup,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import './editor.scss';

const ALL_PATTERNS = () => true;

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		initialViewMode,
		showTitles,
		filterMode,
		blockName,
		titleFilter,
		replaceBlock,
		lastSelected,
	} = attributes;

	const patternCount = useSelect(
		( select ) => {
			const { getBlockRootClientId, __experimentalGetAllowedPatterns } =
				select( blockEditorStore );
			return __experimentalGetAllowedPatterns(
				getBlockRootClientId( clientId )
			).length;
		},
		[ clientId ]
	);

	// filterPatternsFn replaces the blockName lookup when it is given.
	const filterByTitle = useCallback(
		( pattern ) =>
			pattern.title?.toLowerCase().includes( titleFilter.toLowerCase() ),
		[ titleFilter ]
	);
	let filterPatternsFn;
	if ( filterMode === 'all' ) {
		filterPatternsFn = ALL_PATTERNS;
	} else if ( filterMode === 'titleContains' ) {
		filterPatternsFn = filterByTitle;
	}

	// Every prop exercised by this block. By default BlockPatternSetup replaces
	// the block with the chosen pattern (which would delete this block), so the
	// replacement only happens when the replaceBlock toggle is on.
	const setupProps = {
		clientId,
		blockName,
		filterPatternsFn,
		initialViewMode,
		showTitles,
		onBlockPatternSelect: replaceBlock
			? undefined
			: ( blocks ) =>
					setAttributes( { lastSelected: blocks?.length ?? 0 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockPatternSetup',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="initialViewMode"
						value={ initialViewMode }
						options={ [ 'carousel', 'grid' ].map( ( value ) => ( {
							label: value,
							value,
						} ) ) }
						help={ __(
							'Read on mount; the block remounts the setup when it changes.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { initialViewMode: next } )
						}
					/>
					<ToggleControl
						label="showTitles"
						checked={ showTitles }
						onChange={ ( next ) =>
							setAttributes( { showTitles: next } )
						}
					/>
					<SelectControl
						label="pattern source"
						value={ filterMode }
						options={ [
							{ label: 'all allowed patterns', value: 'all' },
							{
								label: 'blockName (patterns for a block type)',
								value: 'blockName',
							},
							{
								label: 'filterPatternsFn (title contains)',
								value: 'titleContains',
							},
						] }
						onChange={ ( next ) =>
							setAttributes( { filterMode: next } )
						}
					/>
					<TextControl
						label="blockName"
						value={ blockName }
						disabled={ filterMode !== 'blockName' }
						onChange={ ( next ) =>
							setAttributes( { blockName: next } )
						}
					/>
					<TextControl
						label="filterPatternsFn text"
						value={ titleFilter }
						disabled={ filterMode !== 'titleContains' }
						onChange={ ( next ) =>
							setAttributes( { titleFilter: next } )
						}
					/>
					<ToggleControl
						label="default onBlockPatternSelect (replaces this block)"
						checked={ replaceBlock }
						onChange={ ( next ) =>
							setAttributes( { replaceBlock: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { lastSelected: 0 } ) }
					>
						{ __( 'Reset selection', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockPatternSetup</h3>
				<p>
					{ `Allowed patterns in this editor: ${ patternCount }. Blocks in last selected pattern: ${ lastSelected }.` }
				</p>
				{ patternCount === 0 && (
					<p>
						{ __(
							'No patterns are registered, so BlockPatternSetup renders nothing.',
							'component-kitchen-sink'
						) }
					</p>
				) }
				<BlockPatternSetup key={ initialViewMode } { ...setupProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
