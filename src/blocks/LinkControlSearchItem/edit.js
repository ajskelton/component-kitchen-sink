import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	InspectorControls,
	__experimentalLinkControlSearchItem as LinkControlSearchItem,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	Button,
	MenuGroup,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const TYPE_OPTIONS = [
	'post',
	'page',
	'post_tag',
	'category',
	'attachment',
	'custom',
].map( ( value ) => ( { label: value, value } ) );

export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		url,
		type,
		typeLabel,
		isFrontPage,
		isBlogHome,
		searchTerm,
		isURL,
		shouldShowType,
		clicks,
	} = attributes;

	// Every prop exercised by this block. The suggestion object carries the
	// title, url, type, typeLabel, isFrontPage and isBlogHome fields.
	const searchItemProps = {
		suggestion: {
			id: 1,
			title,
			url,
			type,
			typeLabel: typeLabel || undefined,
			isFrontPage,
			isBlogHome,
		},
		searchTerm,
		isURL,
		shouldShowType,
		onClick: () => setAttributes( { clicks: clicks + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'__experimentalLinkControlSearchItem',
						'component-kitchen-sink'
					) }
				>
					<TextControl
						label="suggestion.title"
						value={ title }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
						}
					/>
					<TextControl
						label="suggestion.url"
						value={ url }
						onChange={ ( next ) => setAttributes( { url: next } ) }
					/>
					<SelectControl
						label="suggestion.type"
						value={ type }
						options={ TYPE_OPTIONS }
						onChange={ ( next ) => setAttributes( { type: next } ) }
					/>
					<TextControl
						label="suggestion.typeLabel"
						value={ typeLabel }
						onChange={ ( next ) =>
							setAttributes( { typeLabel: next } )
						}
					/>
					<ToggleControl
						label="suggestion.isFrontPage"
						checked={ isFrontPage }
						onChange={ ( next ) =>
							setAttributes( { isFrontPage: next } )
						}
					/>
					<ToggleControl
						label="suggestion.isBlogHome"
						checked={ isBlogHome }
						onChange={ ( next ) =>
							setAttributes( { isBlogHome: next } )
						}
					/>
					<TextControl
						label="searchTerm"
						value={ searchTerm }
						help={ __(
							'Highlighted inside the title.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { searchTerm: next } )
						}
					/>
					<ToggleControl
						label="isURL"
						checked={ isURL }
						onChange={ ( next ) =>
							setAttributes( { isURL: next } )
						}
					/>
					<ToggleControl
						label="shouldShowType"
						checked={ shouldShowType }
						onChange={ ( next ) =>
							setAttributes( { shouldShowType: next } )
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
				<h3>LinkControlSearchItem</h3>
				<p>
					{ __(
						'Deprecated export: expect a deprecation warning in the console.',
						'component-kitchen-sink'
					) }
				</p>
				<MenuGroup>
					<LinkControlSearchItem { ...searchItemProps } />
				</MenuGroup>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
