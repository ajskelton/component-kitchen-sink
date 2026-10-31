import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
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
		[ 'core/paragraph', { content: 'First paragraph from the template.' } ],
		[ 'core/paragraph', { content: 'Second paragraph.' } ],
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

const toOptions = ( keys ) => keys.map( ( v ) => ( { label: v, value: v } ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		allowedBlocks,
		template,
		templateLock,
		orientation,
		renderAppender,
	} = attributes;

	// Keep the props referentially stable so InnerBlocks does not re-sync.
	const innerBlocksProps = useMemo(
		() => ( {
			allowedBlocks: ALLOWED_BLOCKS[ allowedBlocks ],
			template: TEMPLATES[ template ],
			templateLock: templateLock || undefined,
			orientation,
			renderAppender: APPENDERS[ renderAppender ],
		} ),
		[ allowedBlocks, template, templateLock, orientation, renderAppender ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'InnerBlocks', 'component-kitchen-sink' ) }
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
						help={ __(
							'Passed as the template prop; blocks are created from it for an empty area.',
							'component-kitchen-sink'
						) }
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
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>InnerBlocks</h3>
				<InnerBlocks { ...innerBlocksProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
