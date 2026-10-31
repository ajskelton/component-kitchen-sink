import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalBlockPatternsList as BlockPatternsList,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';
import './editor.scss';

/**
 * Builds sample patterns. A pattern needs a unique `name`, a `title` and an
 * array of `blocks`; `viewportWidth` and `description` are optional.
 *
 * @return {Object[]} Three sample patterns.
 */
function createPatterns() {
	return [
		{
			name: 'ajs/sample-heading',
			title: 'Heading and text',
			description: 'A heading followed by a paragraph',
			viewportWidth: 600,
			blocks: [
				createBlock( 'core/heading', { level: 3, content: 'Heading' } ),
				createBlock( 'core/paragraph', { content: 'Some text.' } ),
			],
		},
		{
			name: 'ajs/sample-quote',
			title: 'Quote',
			viewportWidth: 600,
			blocks: [
				createBlock( 'core/quote', { citation: 'Someone' }, [
					createBlock( 'core/paragraph', {
						content: 'A short quote.',
					} ),
				] ),
			],
		},
		{
			name: 'ajs/sample-buttons',
			title: 'Buttons',
			viewportWidth: 600,
			blocks: [
				createBlock( 'core/buttons', {}, [
					createBlock( 'core/button', { text: 'One' } ),
					createBlock( 'core/button', { text: 'Two' } ),
				] ),
			],
		},
	];
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		patternCount,
		isDraggable,
		orientation,
		label,
		showTitlesAsTooltip,
		category,
		lastClicked,
		clicks,
	} = attributes;
	const [ hovered, setHovered ] = useState( '' );

	const allPatterns = useMemo( createPatterns, [] );
	const blockPatterns = useMemo(
		() => allPatterns.slice( 0, patternCount ),
		[ allPatterns, patternCount ]
	);

	// Every prop exercised by this block.
	const listProps = {
		blockPatterns,
		isDraggable,
		orientation: orientation || undefined,
		label,
		showTitlesAsTooltip,
		category: category || undefined,
		onClickPattern: ( pattern ) =>
			setAttributes( {
				lastClicked: pattern.name,
				clicks: clicks + 1,
			} ),
		onHover: ( pattern ) => setHovered( pattern?.name ?? '' ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockPatternsList',
						'component-kitchen-sink'
					) }
				>
					<RangeControl
						label="blockPatterns (count)"
						value={ patternCount }
						min={ 1 }
						max={ allPatterns.length }
						onChange={ ( next ) =>
							setAttributes( { patternCount: next ?? 1 } )
						}
					/>
					<ToggleControl
						label="isDraggable"
						checked={ isDraggable }
						onChange={ ( next ) =>
							setAttributes( { isDraggable: next } )
						}
					/>
					<SelectControl
						label="orientation"
						value={ orientation }
						options={ [ '', 'vertical', 'horizontal' ].map(
							( value ) => ( {
								label: value || '(all arrow keys)',
								value,
							} )
						) }
						onChange={ ( next ) =>
							setAttributes( { orientation: next } )
						}
					/>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<ToggleControl
						label="showTitlesAsTooltip"
						checked={ showTitlesAsTooltip }
						onChange={ ( next ) =>
							setAttributes( { showTitlesAsTooltip: next } )
						}
					/>
					<TextControl
						label="category"
						help={ __(
							'Only used for dragging: narrows the dragged pattern to this category.',
							'component-kitchen-sink'
						) }
						value={ category }
						onChange={ ( next ) =>
							setAttributes( { category: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( { clicks: 0, lastClicked: '' } )
						}
					>
						{ __( 'Reset clicks', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockPatternsList</h3>
				<p>
					{ __( 'Hovered pattern:', 'component-kitchen-sink' ) }{ ' ' }
					{ hovered || '-' } ({ lastClicked || '-' })
				</p>
				<BlockPatternsList { ...listProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
