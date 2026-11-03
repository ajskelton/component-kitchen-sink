import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import './editor.scss';

const ALLOWED_BLOCKS = {
	all: true,
	text: [ 'core/paragraph', 'core/heading', 'core/list' ],
	media: [ 'core/image', 'core/gallery' ],
	none: false,
};

const TEMPLATES = {
	none: undefined,
	paragraphs: [
		[ 'core/paragraph', { content: 'Paragraph from the template.' } ],
		[ 'core/paragraph', { placeholder: 'Write something...' } ],
	],
	'heading-and-paragraph': [
		[ 'core/heading', { level: 4, content: 'Heading from the template' } ],
		[ 'core/paragraph', { placeholder: 'Write something...' } ],
	],
};

const APPENDERS = {
	default: undefined,
	button: InnerBlocks.ButtonBlockAppender,
	'default-block': InnerBlocks.DefaultBlockAppender,
	none: false,
};

const DEFAULT_BLOCKS = {
	'': undefined,
	paragraph: { name: 'core/paragraph', attributes: { content: 'Added' } },
	heading: { name: 'core/heading', attributes: { content: 'Added' } },
};

const toOptions = ( keys ) => keys.map( ( v ) => ( { label: v, value: v } ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		allowedBlocks,
		template,
		templateLock,
		orientation,
		renderAppender,
		defaultBlock,
		directInsert,
	} = attributes;

	// useInnerBlocksProps merges the block wrapper props with the inner blocks
	// list props, so a single element is both the block and its container.
	const blockProps = useBlockProps();
	const options = useMemo(
		() => ( {
			allowedBlocks: ALLOWED_BLOCKS[ allowedBlocks ],
			template: TEMPLATES[ template ],
			templateLock: templateLock || undefined,
			orientation,
			renderAppender: APPENDERS[ renderAppender ],
			defaultBlock: DEFAULT_BLOCKS[ defaultBlock ],
			directInsert,
		} ),
		[
			allowedBlocks,
			template,
			templateLock,
			orientation,
			renderAppender,
			defaultBlock,
			directInsert,
		]
	);
	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		blockProps,
		options
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'useInnerBlocksProps',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="allowedBlocks"
						value={ allowedBlocks }
						options={ [
							{ label: 'true (all blocks)', value: 'all' },
							{
								label: "[ 'core/paragraph', 'core/heading', 'core/list' ]",
								value: 'text',
							},
							{
								label: "[ 'core/image', 'core/gallery' ]",
								value: 'media',
							},
							{ label: 'false (none)', value: 'none' },
						] }
						onChange={ ( next ) =>
							setAttributes( { allowedBlocks: next } )
						}
					/>
					<SelectControl
						label="template"
						value={ template }
						options={ toOptions( Object.keys( TEMPLATES ) ) }
						onChange={ ( next ) =>
							setAttributes( { template: next } )
						}
					/>
					<SelectControl
						label="templateLock"
						value={ templateLock }
						options={ [
							{ label: 'undefined', value: '' },
							{ label: 'all', value: 'all' },
							{ label: 'insert', value: 'insert' },
							{ label: 'contentOnly', value: 'contentOnly' },
						] }
						onChange={ ( next ) =>
							setAttributes( { templateLock: next } )
						}
					/>
					<SelectControl
						label="orientation"
						value={ orientation }
						options={ toOptions( [ 'vertical', 'horizontal' ] ) }
						onChange={ ( next ) =>
							setAttributes( { orientation: next } )
						}
					/>
					<SelectControl
						label="renderAppender"
						value={ renderAppender }
						options={ [
							{ label: 'undefined (default)', value: 'default' },
							{
								label: 'InnerBlocks.ButtonBlockAppender',
								value: 'button',
							},
							{
								label: 'InnerBlocks.DefaultBlockAppender',
								value: 'default-block',
							},
							{ label: 'false', value: 'none' },
						] }
						onChange={ ( next ) =>
							setAttributes( { renderAppender: next } )
						}
					/>
					<SelectControl
						label="defaultBlock"
						value={ defaultBlock }
						options={ [
							{ label: 'undefined', value: '' },
							{ label: 'core/paragraph', value: 'paragraph' },
							{ label: 'core/heading', value: 'heading' },
						] }
						onChange={ ( next ) =>
							setAttributes( { defaultBlock: next } )
						}
					/>
					<ToggleControl
						label="directInsert"
						checked={ directInsert }
						help={ __(
							'Needs defaultBlock: the appender then inserts it without opening the inserter.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { directInsert: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps }>
				<h3>useInnerBlocksProps</h3>
				{ children }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
