import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	/* eslint-disable @wordpress/no-unsafe-wp-apis */
	__unstableBlockToolbarLastItem as BlockToolbarLastItem,
	/* eslint-enable @wordpress/no-unsafe-wp-apis */
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
	ToolbarButton,
} from '@wordpress/components';
import { starFilled } from '@wordpress/icons';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { enabled, label, clicks } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockToolbarLastItem',
						'component-kitchen-sink'
					) }
				>
					<ToggleControl
						label="render the fill"
						checked={ enabled }
						onChange={ ( next ) =>
							setAttributes( { enabled: next } )
						}
					/>
					<TextControl
						label="children (ToolbarButton label)"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
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
				<h3>BlockToolbarLastItem</h3>
				<p>
					{ __(
						'This fill draws nothing here. While this block is in the post, a star ToolbarButton is added at the end of the real block toolbar whenever a block is selected.',
						'component-kitchen-sink'
					) }
				</p>
				<p>
					{ __( 'Toolbar button clicks:', 'component-kitchen-sink' ) }{ ' ' }
					{ clicks }
				</p>
				{ enabled && (
					<BlockToolbarLastItem>
						<ToolbarButton
							icon={ starFilled }
							label={ label }
							onClick={ () =>
								setAttributes( { clicks: clicks + 1 } )
							}
						/>
					</BlockToolbarLastItem>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
