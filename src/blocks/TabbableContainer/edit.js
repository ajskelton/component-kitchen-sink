import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	TabbableContainer,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const ITEMS = [ 'Item 1', 'Item 2', 'Item 3', 'Item 4' ];

/**
 * Maps the arrow keys to an offset, so they navigate like Tab does.
 *
 * @param {KeyboardEvent} event Keyboard event.
 * @return {-1|1|undefined} Offset to move focus by.
 */
function arrowKeysToOffset( event ) {
	if ( event.code === 'ArrowRight' || event.code === 'ArrowDown' ) {
		return 1;
	}
	if ( event.code === 'ArrowLeft' || event.code === 'ArrowUp' ) {
		return -1;
	}
	return undefined;
}

export default function Edit( { attributes, setAttributes } ) {
	const { cycle, useArrowKeys, lastIndex } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const containerProps = {
		cycle,
		// eventToOffset overrides the default Tab / Shift+Tab handling.
		eventToOffset: useArrowKeys ? arrowKeysToOffset : undefined,
		onNavigate: ( index ) => setAttributes( { lastIndex: index } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'TabbableContainer',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="cycle"
						checked={ cycle }
						onChange={ ( next ) =>
							setAttributes( { cycle: next } )
						}
					/>
					<ToggleControl
						label="eventToOffset (arrow keys)"
						checked={ useArrowKeys }
						onChange={ ( next ) =>
							setAttributes( { useArrowKeys: next } )
						}
					/>
					<p>
						{ __(
							'onNavigate last index:',
							'component-kitchen-sink'
						) }{ ' ' }
						{ lastIndex }
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>TabbableContainer</h3>
				<p>
					{ __(
						'Focus an item, then press Tab (or the arrow keys when eventToOffset is on).',
						'component-kitchen-sink'
					) }
				</p>
				<TabbableContainer { ...containerProps }>
					{ ITEMS.map( ( item ) => (
						<Button key={ item } variant="secondary" tabIndex={ 0 }>
							{ item }
						</Button>
					) ) }
				</TabbableContainer>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
