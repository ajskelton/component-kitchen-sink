import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	/* eslint-disable @wordpress/no-unsafe-wp-apis */
	__unstableBlockSettingsMenuFirstItem as BlockSettingsMenuFirstItem,
	/* eslint-enable @wordpress/no-unsafe-wp-apis */
} from '@wordpress/block-editor';
import {
	Button,
	MenuItem,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { pin } from '@wordpress/icons';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { enabled, label, closeOnClick, clicks } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockSettingsMenuFirstItem',
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
						label="children (menu item label)"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<ToggleControl
						label="children render prop: call onClose"
						checked={ closeOnClick }
						onChange={ ( next ) =>
							setAttributes( { closeOnClick: next } )
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
				<h3>BlockSettingsMenuFirstItem</h3>
				<p>
					{ __(
						'This fill draws nothing here. While this block is in the post, its menu item is added as the first item of the real block settings menu (the three dots) of every block.',
						'component-kitchen-sink'
					) }
				</p>
				<p>
					{ __( 'Menu item clicks:', 'component-kitchen-sink' ) }{ ' ' }
					{ clicks }
				</p>
				{ enabled && (
					<BlockSettingsMenuFirstItem>
						{ ( { onClose } ) => (
							<MenuItem
								icon={ pin }
								onClick={ () => {
									setAttributes( { clicks: clicks + 1 } );
									if ( closeOnClick ) {
										onClose();
									}
								} }
							>
								{ label }
							</MenuItem>
						) }
					</BlockSettingsMenuFirstItem>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
