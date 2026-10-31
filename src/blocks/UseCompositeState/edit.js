import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__unstableComposite as Composite,
	__unstableCompositeItem as CompositeItem,
	__unstableUseCompositeState as useCompositeState,
	Button,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const ORIENTATION_OPTIONS = [
	{ label: 'undefined', value: '' },
	{ label: 'horizontal', value: 'horizontal' },
	{ label: 'vertical', value: 'vertical' },
];

const ITEM_OPTIONS = [
	{ label: 'undefined', value: '' },
	{ label: 'apple', value: 'apple' },
	{ label: 'banana', value: 'banana' },
	{ label: 'cherry', value: 'cherry' },
];

/**
 * Shows live state read from the store that useCompositeState returned.
 *
 * @param {Object} props       Component props.
 * @param {Object} props.state Return value of useCompositeState.
 */
function StateReader( { state } ) {
	const activeId = state.store.useState( 'activeId' );
	return (
		<p>
			<code>
				{ `baseId: ${ state.baseId }, store.activeId: ${ activeId }` }
			</code>
		</p>
	);
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		orientation,
		loop,
		wrap,
		shift,
		unstable_virtual: virtual,
		rtl,
		currentItem,
		lastPressed,
	} = attributes;

	const baseId = `ajs-ucs-${ clientId }`;

	// The hook under test. `currentId` only seeds the initial active item, so
	// reload the editor after changing it.
	const state = useCompositeState( {
		baseId,
		orientation: orientation || undefined,
		loop,
		wrap,
		shift,
		unstable_virtual: virtual,
		rtl,
		currentId: currentItem ? `${ baseId }-${ currentItem }` : undefined,
	} );

	const renderDemo = () => (
		<>
			<Composite
				state={ state }
				role="toolbar"
				aria-label={ __(
					'useCompositeState demo',
					'component-kitchen-sink'
				) }
			>
				{ [ 'apple', 'banana', 'cherry' ].map( ( name ) => (
					<CompositeItem
						key={ name }
						state={ state }
						id={ `${ baseId }-${ name }` }
						render={ <Button variant="secondary" size="compact" /> }
						onClick={ () => setAttributes( { lastPressed: name } ) }
					>
						{ name }
					</CompositeItem>
				) ) }
			</Composite>
			<StateReader state={ state } />
		</>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'useCompositeState',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="orientation"
						value={ orientation }
						options={ ORIENTATION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { orientation: next } )
						}
					/>
					<ToggleControl
						label="loop"
						checked={ loop }
						onChange={ ( next ) => setAttributes( { loop: next } ) }
					/>
					<ToggleControl
						label="wrap"
						checked={ wrap }
						onChange={ ( next ) => setAttributes( { wrap: next } ) }
					/>
					<ToggleControl
						label="shift"
						checked={ shift }
						onChange={ ( next ) =>
							setAttributes( { shift: next } )
						}
					/>
					<ToggleControl
						label="unstable_virtual"
						checked={ virtual }
						onChange={ ( next ) =>
							setAttributes( { unstable_virtual: next } )
						}
					/>
					<ToggleControl
						label="rtl"
						checked={ rtl }
						onChange={ ( next ) => setAttributes( { rtl: next } ) }
					/>
					<SelectControl
						label="currentId (initial item)"
						value={ currentItem }
						options={ ITEM_OPTIONS }
						help={ __(
							'Only read on first render; reload the editor to see it apply.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { currentItem: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useCompositeState</h3>
				{ renderDemo() }
				<p>
					{ __( 'Last pressed:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ lastPressed || '-' }</code>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
