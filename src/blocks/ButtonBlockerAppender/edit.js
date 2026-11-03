import { __ } from '@wordpress/i18n';
import {
	ButtonBlockerAppender,
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

	// ButtonBlockerAppender is the deprecated (typo) alias of
	// ButtonBlockAppender. It logs a deprecation notice to the console and then
	// renders the same Inserter button.
	const renderAppender = useCallback(
		() => (
			<ButtonBlockerAppender
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
						'ButtonBlockerAppender',
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
				<h3>ButtonBlockerAppender</h3>
				<p>
					{ __(
						'Deprecated alias of ButtonBlockAppender; expect a deprecation warning in the console.',
						'component-kitchen-sink'
					) }
				</p>
				<InnerBlocks
					allowedBlocks={ allowed }
					renderAppender={ renderAppender }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
