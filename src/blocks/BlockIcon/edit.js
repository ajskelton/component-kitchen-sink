import { __ } from '@wordpress/i18n';
import {
	BlockIcon,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { cog, heading, image, paragraph, starFilled } from '@wordpress/icons';
import './editor.scss';

const ICONS = { cog, image, paragraph, starFilled, heading };

const KIND_OPTIONS = [
	{ label: 'element (icon from @wordpress/icons)', value: 'element' },
	{ label: 'dashicon (string)', value: 'dashicon' },
	{
		label: 'descriptor ({ src, foreground, background })',
		value: 'descriptor',
	},
];

const DASHICONS = {
	cog: 'admin-generic',
	image: 'format-image',
	paragraph: 'editor-paragraph',
	starFilled: 'star-filled',
	heading: 'heading',
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		iconKind,
		iconKey,
		showColors,
		foreground,
		background,
		className,
		context,
	} = attributes;

	// The `icon` prop accepts an element, a Dashicon name, or a descriptor
	// object, which is what a block type's `icon` setting looks like.
	let icon = ICONS[ iconKey ];
	if ( iconKind === 'dashicon' ) {
		icon = DASHICONS[ iconKey ];
	} else if ( iconKind === 'descriptor' ) {
		icon = { src: ICONS[ iconKey ], foreground, background };
	}

	// Every prop exercised by this block.
	const blockIconProps = {
		icon,
		showColors,
		className: className || undefined,
		context: context || undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockIcon', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="icon (kind)"
						value={ iconKind }
						options={ KIND_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { iconKind: next } )
						}
					/>
					<SelectControl
						label="icon (which)"
						value={ iconKey }
						options={ Object.keys( ICONS ).map( ( value ) => ( {
							label: value,
							value,
						} ) ) }
						onChange={ ( next ) =>
							setAttributes( { iconKey: next } )
						}
					/>
					<ToggleControl
						label="showColors"
						checked={ showColors }
						help={ __(
							'Applies the descriptor foreground and background.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { showColors: next } )
						}
					/>
					<TextControl
						label="icon.foreground"
						value={ foreground }
						onChange={ ( next ) =>
							setAttributes( { foreground: next } )
						}
					/>
					<TextControl
						label="icon.background"
						value={ background }
						onChange={ ( next ) =>
							setAttributes( { background: next } )
						}
					/>
					<TextControl
						label="className"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
					<TextControl
						label="context"
						value={ context }
						onChange={ ( next ) =>
							setAttributes( { context: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockIcon</h3>
				<BlockIcon { ...blockIconProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
