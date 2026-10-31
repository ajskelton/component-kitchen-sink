import { __ } from '@wordpress/i18n';
import {
	ButtonBlockAppender,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useCallback, useMemo } from '@wordpress/element';
import './editor.scss';

const ALLOWED_BLOCKS = {
	all: true,
	paragraph: [ 'core/paragraph' ],
	text: [ 'core/paragraph', 'core/heading', 'core/list' ],
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { allowedBlocks, className, selections } = attributes;

	// ButtonBlockAppender must receive the rootClientId of the block whose
	// inner blocks it appends to: this block.
	const renderAppender = useCallback(
		() => (
			<ButtonBlockAppender
				rootClientId={ clientId }
				className={ className || undefined }
				onSelect={ () =>
					setAttributes( { selections: selections + 1 } )
				}
			/>
		),
		[ clientId, className, selections, setAttributes ]
	);
	const allowed = useMemo(
		() => ALLOWED_BLOCKS[ allowedBlocks ],
		[ allowedBlocks ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'ButtonBlockAppender',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="allowedBlocks (of the parent InnerBlocks)"
						value={ allowedBlocks }
						options={ [
							{
								label: 'true (generic "Add block")',
								value: 'all',
							},
							{
								label: '[ \'core/paragraph\' ] ("Add paragraph")',
								value: 'paragraph',
							},
							{
								label: 'paragraph, heading, list',
								value: 'text',
							},
						] }
						help={ __(
							'With a single allowed block type the button inserts it directly and its label changes.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { allowedBlocks: next } )
						}
					/>
					<TextControl
						label="className"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { selections: 0 } ) }
					>
						{ __(
							'Reset onSelect count',
							'component-kitchen-sink'
						) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ButtonBlockAppender</h3>
				<InnerBlocks
					allowedBlocks={ allowed }
					renderAppender={ renderAppender }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
