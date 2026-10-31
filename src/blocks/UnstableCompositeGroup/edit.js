import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__unstableComposite as Composite,
	__unstableCompositeGroup as CompositeGroup,
	__unstableCompositeItem as CompositeItem,
	__unstableUseCompositeState as useCompositeState,
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const ROLE_OPTIONS = [
	{ label: 'group (renders Composite.Group)', value: 'group' },
	{ label: 'row (renders Composite.Row)', value: 'row' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { role, label, wrap, lastPressed } = attributes;

	const state = useCompositeState( { wrap } );

	// Legacy CompositeGroup switches on `role`: `row` gives a two-dimensional
	// composite, anything else a plain group.
	const renderDemo = () => (
		<Composite
			state={ state }
			role={ role === 'row' ? 'grid' : undefined }
			aria-label={ __(
				'__unstableCompositeGroup demo',
				'component-kitchen-sink'
			) }
		>
			{ [ 'A', 'B' ].map( ( rowName ) => (
				<CompositeGroup
					key={ rowName }
					state={ state }
					role={ role }
					aria-label={ `${ label } ${ rowName }` }
				>
					{ [ 1, 2, 3 ].map( ( n ) => (
						<CompositeItem
							key={ n }
							state={ state }
							role={ role === 'row' ? 'gridcell' : undefined }
							render={
								<Button variant="secondary" size="compact" />
							}
							onClick={ () =>
								setAttributes( {
									lastPressed: `${ rowName }${ n }`,
								} )
							}
						>
							{ `${ rowName }${ n }` }
						</CompositeItem>
					) ) }
				</CompositeGroup>
			) ) }
		</Composite>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__unstableCompositeGroup',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="role"
						value={ role }
						options={ ROLE_OPTIONS }
						onChange={ ( next ) => setAttributes( { role: next } ) }
					/>
					<TextControl
						label="aria-label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<ToggleControl
						label="wrap (useCompositeState)"
						checked={ wrap }
						onChange={ ( next ) => setAttributes( { wrap: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>__unstableCompositeGroup</h3>
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
