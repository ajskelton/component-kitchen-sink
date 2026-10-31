import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	HeadingLevelDropdown,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	SelectControl,
	ToolbarGroup,
} from '@wordpress/components';
import './editor.scss';

const VALUE_OPTIONS = [ 0, 1, 2, 3, 4, 5, 6 ].map( ( level ) => ( {
	label: level === 0 ? 'paragraph (0)' : `H${ level }`,
	value: String( level ),
} ) );

const OPTIONS_PRESETS = [
	{ label: 'default (1 to 6)', value: 'default' },
	{ label: 'with paragraph (0 to 6)', value: 'with-paragraph' },
	{ label: '2, 3, 4', value: 'h2-h4' },
];

const OPTIONS = {
	default: undefined,
	'with-paragraph': [ 0, 1, 2, 3, 4, 5, 6 ],
	'h2-h4': [ 2, 3, 4 ],
};

export default function Edit( { attributes, setAttributes } ) {
	const { level, optionsPreset } = attributes;

	// Every prop exercised by this block, shared by toolbar and inspector.
	const controlProps = {
		value: level,
		onChange: ( next ) => setAttributes( { level: next } ),
		options: OPTIONS[ optionsPreset ],
	};

	const Tag = level === 0 ? 'p' : `h${ level }`;

	return (
		<>
			<BlockControls group="block">
				<ToolbarGroup>
					<HeadingLevelDropdown { ...controlProps } />
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __(
						'HeadingLevelDropdown',
						'component-kitchen-sink'
					) }
				>
					<BaseControl
						id="ajs-heading-level-dropdown-mirror"
						label={ __(
							'Mirror of the toolbar control',
							'component-kitchen-sink'
						) }
					>
						<div>
							<HeadingLevelDropdown { ...controlProps } />
						</div>
					</BaseControl>
					<SelectControl
						label="value"
						value={ String( level ) }
						options={ VALUE_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { level: Number( next ) } )
						}
					/>
					<SelectControl
						label="options"
						value={ optionsPreset }
						options={ OPTIONS_PRESETS }
						onChange={ ( next ) =>
							setAttributes( { optionsPreset: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>HeadingLevelDropdown</h3>
				{ /* The control lives in the block toolbar; this element changes tag with the level. */ }
				<Tag>
					{ __(
						'Text rendered at the chosen level',
						'component-kitchen-sink'
					) }
				</Tag>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
