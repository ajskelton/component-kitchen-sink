import { __ } from '@wordpress/i18n';
import {
	BlockEdit,
	BlockEditorProvider,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';
import './editor.scss';

const EDITOR_SETTINGS = {};

const NAME_OPTIONS = [
	{ label: 'core/paragraph', value: 'core/paragraph' },
	{ label: 'core/heading', value: 'core/heading' },
	{ label: 'core/separator', value: 'core/separator' },
	{ label: 'core/spacer', value: 'core/spacer' },
];

// The static attributes handed to each block's own edit function.
const STATIC_ATTRIBUTES = {
	'core/paragraph': { content: 'BlockEdit renders the paragraph edit.' },
	'core/heading': {
		level: 3,
		content: 'BlockEdit renders the heading edit.',
	},
	'core/separator': {},
	'core/spacer': { height: '48px' },
};

// Renders BlockEdit for one block. The block also lives in a nested store so
// the edit function can resolve its clientId; BlockList is deliberately not
// used, so BlockEdit is what draws the block.
function EditForBlock( { name, clientId, isSelected, onAttributes } ) {
	const [ attributes, setLocalAttributes ] = useState(
		() => STATIC_ATTRIBUTES[ name ]
	);
	return (
		<BlockEdit
			name={ name }
			clientId={ clientId }
			attributes={ attributes }
			isSelected={ isSelected }
			context={ {} }
			setAttributes={ ( next ) => {
				setLocalAttributes( ( current ) => ( {
					...current,
					...next,
				} ) );
				onAttributes();
			} }
		/>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { blockName, isSelected, setAttributesCalls } = attributes;

	// The store gets a real block of the same type so selectors resolve it.
	const blocks = useMemo(
		() => [ createBlock( blockName, STATIC_ATTRIBUTES[ blockName ] ) ],
		[ blockName ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockEdit', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="name"
						value={ blockName }
						options={ NAME_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { blockName: next } )
						}
					/>
					<ToggleControl
						label="isSelected"
						checked={ isSelected }
						onChange={ ( next ) =>
							setAttributes( { isSelected: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( { setAttributesCalls: 0 } )
						}
					>
						{ __(
							'Reset setAttributes calls',
							'component-kitchen-sink'
						) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockEdit</h3>
				<BlockEditorProvider
					value={ blocks }
					onInput={ () => {} }
					onChange={ () => {} }
					settings={ EDITOR_SETTINGS }
				>
					<div
						style={ {
							border: '1px dashed #949494',
							padding: '8px',
						} }
					>
						<EditForBlock
							key={ blockName }
							name={ blockName }
							clientId={ blocks[ 0 ].clientId }
							isSelected={ isSelected }
							onAttributes={ () =>
								setAttributes( {
									setAttributesCalls: setAttributesCalls + 1,
								} )
							}
						/>
					</div>
				</BlockEditorProvider>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
