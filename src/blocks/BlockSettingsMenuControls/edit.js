import { __ } from '@wordpress/i18n';
import {
	BlockSettingsMenuControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	MenuItem,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { starFilled } from '@wordpress/icons';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { enabled, label, closeOnClick, showSelectedBlocks, clicks } =
		attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'BlockSettingsMenuControls',
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
					<ToggleControl
						label="children render prop: show selectedBlocks"
						checked={ showSelectedBlocks }
						onChange={ ( next ) =>
							setAttributes( { showSelectedBlocks: next } )
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
				<h3>BlockSettingsMenuControls</h3>
				<p>
					{ __(
						'This component draws nothing here. While this block is in the post, its menu item is added to the real block settings menu (the three dots in the block toolbar or in List View) of every block, including this one.',
						'component-kitchen-sink'
					) }
				</p>
				<p>
					{ __( 'Menu item clicks:', 'component-kitchen-sink' ) }{ ' ' }
					{ clicks }
				</p>
				{ enabled && (
					<BlockSettingsMenuControls>
						{ ( { onClose, selectedBlocks } ) => (
							<MenuItem
								icon={ starFilled }
								onClick={ () => {
									setAttributes( { clicks: clicks + 1 } );
									if ( closeOnClick ) {
										onClose();
									}
								} }
							>
								{ label }
								{ showSelectedBlocks && selectedBlocks?.length
									? ' (' + selectedBlocks.join( ', ' ) + ')'
									: '' }
							</MenuItem>
						) }
					</BlockSettingsMenuControls>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
