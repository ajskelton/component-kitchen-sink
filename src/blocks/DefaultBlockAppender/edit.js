import { __ } from '@wordpress/i18n';
import {
	DefaultBlockAppender,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useCallback, useMemo } from '@wordpress/element';
import './editor.scss';

const ALLOWED_BLOCKS = {
	all: true,
	text: [ 'core/paragraph', 'core/heading' ],
	none: [],
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { allowedBlocks, templateLock } = attributes;

	// DefaultBlockAppender takes only rootClientId. It hides itself when the
	// root is template-locked and inserts the default block (paragraph).
	const renderAppender = useCallback(
		() => <DefaultBlockAppender rootClientId={ clientId } />,
		[ clientId ]
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
						'DefaultBlockAppender',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="allowedBlocks (of the parent InnerBlocks)"
						value={ allowedBlocks }
						options={ [
							{ label: 'true', value: 'all' },
							{
								label: "[ 'core/paragraph', 'core/heading' ]",
								value: 'text',
							},
							{ label: '[]', value: 'none' },
						] }
						onChange={ ( next ) =>
							setAttributes( { allowedBlocks: next } )
						}
					/>
					<SelectControl
						label="templateLock (of the parent InnerBlocks)"
						value={ templateLock }
						options={ [
							{ label: 'undefined', value: '' },
							{ label: 'all', value: 'all' },
							{ label: 'insert', value: 'insert' },
						] }
						help={ __(
							'A locked root makes DefaultBlockAppender render nothing.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { templateLock: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>DefaultBlockAppender</h3>
				<InnerBlocks
					allowedBlocks={ allowed }
					templateLock={ templateLock || undefined }
					renderAppender={ renderAppender }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
