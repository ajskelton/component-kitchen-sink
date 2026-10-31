import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	store as blockEditorStore,
	__unstableUseBlockSelectionClearer as useBlockSelectionClearer,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { PanelBody, RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { areaHeight } = attributes;

	// Returns a ref callback. A mousedown directly on the element it is
	// attached to (not on a child) clears the block selection.
	const clearerRef = useBlockSelectionClearer();

	const { selectedClientId, clearBlockSelection } = useSelect( ( select ) => {
		const { getSelectedBlockClientId, getSettings } =
			select( blockEditorStore );
		return {
			selectedClientId: getSelectedBlockClientId() ?? null,
			clearBlockSelection: getSettings().clearBlockSelection,
		};
	}, [] );

	// Keep a short history of selection changes, so a clear is visible even
	// when the block gets selected again right after.
	const [ history, setHistory ] = useState( [] );
	useEffect( () => {
		setHistory( ( previous ) =>
			[ selectedClientId ?? 'none', ...previous ].slice( 0, 6 )
		);
	}, [ selectedClientId ] );

	const [ directClicks, setDirectClicks ] = useState( 0 );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__unstableUseBlockSelectionClearer',
						'component-kitchen-sink'
					) }
				>
					<RangeControl
						label={ __(
							'Height of the clearing area (px)',
							'component-kitchen-sink'
						) }
						value={ areaHeight }
						min={ 40 }
						max={ 300 }
						onChange={ ( next ) =>
							setAttributes( { areaHeight: next ?? 120 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useBlockSelectionClearer</h3>
				{ /* The ref is attached to this element. */ }
				{ /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */ }
				<div
					ref={ clearerRef }
					onMouseDown={ ( event ) => {
						if ( event.target === event.currentTarget ) {
							setDirectClicks( ( count ) => count + 1 );
						}
					} }
					style={ {
						height: areaHeight,
						border: '2px dashed currentColor',
						padding: 8,
					} }
				>
					<span>
						{ __(
							'Click the empty dashed area (not this text) to clear the selection.',
							'component-kitchen-sink'
						) }
					</span>
				</div>
				<pre>
					{ JSON.stringify(
						{
							'settings.clearBlockSelection': clearBlockSelection,
							directClicksOnArea: directClicks,
							selectedClientId,
							selectionHistory: history,
						},
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
