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

const ROLE_OPTIONS = [ 'toolbar', 'listbox', 'grid', 'none' ].map(
	( value ) => ( { label: value, value } )
);

export default function Edit( { attributes, setAttributes } ) {
	const { orientation, loop, wrap, role, disabled, lastPressed } = attributes;

	// The legacy Composite needs the state returned by useCompositeState.
	const state = useCompositeState( {
		orientation: orientation || undefined,
		loop,
		wrap,
	} );

	const renderDemo = () => (
		<Composite
			state={ state }
			role={ role === 'none' ? undefined : role }
			disabled={ disabled }
			aria-label={ __(
				'__unstableComposite demo',
				'component-kitchen-sink'
			) }
		>
			{ [ 'One', 'Two', 'Three' ].map( ( name ) => (
				<CompositeItem
					key={ name }
					state={ state }
					render={ <Button variant="secondary" size="compact" /> }
					onClick={ () => setAttributes( { lastPressed: name } ) }
				>
					{ name }
				</CompositeItem>
			) ) }
		</Composite>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__unstableComposite',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="orientation (useCompositeState)"
						value={ orientation }
						options={ ORIENTATION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { orientation: next } )
						}
					/>
					<ToggleControl
						label="loop (useCompositeState)"
						checked={ loop }
						onChange={ ( next ) => setAttributes( { loop: next } ) }
					/>
					<ToggleControl
						label="wrap (useCompositeState)"
						checked={ wrap }
						onChange={ ( next ) => setAttributes( { wrap: next } ) }
					/>
					<SelectControl
						label="role"
						value={ role }
						options={ ROLE_OPTIONS }
						onChange={ ( next ) => setAttributes( { role: next } ) }
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>__unstableComposite</h3>
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
