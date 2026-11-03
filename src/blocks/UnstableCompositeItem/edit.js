import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__unstableComposite as Composite,
	__unstableCompositeItem as CompositeItem,
	__unstableUseCompositeState as useCompositeState,
	Button,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { disabled, focusable, secondDisabled, clicks } = attributes;

	const state = useCompositeState();

	const onClick = () => setAttributes( { clicks: clicks + 1 } );

	// Legacy CompositeItem maps `focusable` to accessibleWhenDisabled, so a
	// disabled item stays reachable with the arrow keys when it is set.
	const renderDemo = () => (
		<Composite
			state={ state }
			role="toolbar"
			aria-label={ __(
				'__unstableCompositeItem demo',
				'component-kitchen-sink'
			) }
		>
			<CompositeItem
				state={ state }
				disabled={ disabled }
				focusable={ focusable }
				render={ <Button variant="primary" size="compact" /> }
				onClick={ onClick }
			>
				{ __( 'Item under test', 'component-kitchen-sink' ) }
			</CompositeItem>
			<CompositeItem
				state={ state }
				disabled={ secondDisabled }
				render={ <Button variant="secondary" size="compact" /> }
			>
				{ __( 'Sibling', 'component-kitchen-sink' ) }
			</CompositeItem>
			<CompositeItem
				state={ state }
				render={ <Button variant="secondary" size="compact" /> }
			>
				{ __( 'Third', 'component-kitchen-sink' ) }
			</CompositeItem>
		</Composite>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__unstableCompositeItem',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
					<ToggleControl
						label="focusable"
						checked={ focusable }
						onChange={ ( next ) =>
							setAttributes( { focusable: next } )
						}
					/>
					<ToggleControl
						label="sibling disabled"
						checked={ secondDisabled }
						onChange={ ( next ) =>
							setAttributes( { secondDisabled: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { clicks: 0 } ) }
					>
						{ __( 'Reset clicks', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>__unstableCompositeItem</h3>
				{ renderDemo() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
