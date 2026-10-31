import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBackgroundProps,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

const SAMPLE_IMAGE =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#3858e9"/><circle cx="40" cy="40" r="26" fill="#ffd33d"/></svg>'
	);

const SIZE_OPTIONS = [
	{ label: 'default', value: '' },
	{ label: 'cover', value: 'cover' },
	{ label: 'contain', value: 'contain' },
	{ label: 'auto', value: 'auto' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { label, style } = attributes;

	// Reads attributes.style.background (written by the Background panel of
	// the block supports) and returns { className, style }.
	const backgroundProps = useBackgroundProps( attributes );

	const backgroundImageUrl = style?.background?.backgroundImage?.url ?? '';
	const backgroundSize = style?.background?.backgroundSize ?? '';

	// Fallback for themes that do not enable settings.background.backgroundImage,
	// in which case the editor's Background panel is not shown.
	const updateBackground = ( changes ) => {
		const nextBackground = { ...style?.background, ...changes };
		Object.keys( nextBackground ).forEach( ( key ) => {
			if ( nextBackground[ key ] === undefined ) {
				delete nextBackground[ key ];
			}
		} );
		setAttributes( {
			style: {
				...style,
				background: Object.keys( nextBackground ).length
					? nextBackground
					: undefined,
			},
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'useBackgroundProps',
						'component-kitchen-sink'
					) }
				>
					<p>
						{ __(
							'Use the Background panel in the Styles tab. If your theme does not enable background images, use the fallback fields below, which write to attributes.style.background.',
							'component-kitchen-sink'
						) }
					</p>
					<TextControl
						label="style.background.backgroundImage.url"
						value={ backgroundImageUrl }
						onChange={ ( next ) =>
							updateBackground( {
								backgroundImage: next
									? { url: next, source: 'file' }
									: undefined,
							} )
						}
					/>
					<SelectControl
						label="style.background.backgroundSize"
						value={ backgroundSize }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) =>
							updateBackground( {
								backgroundSize: next || undefined,
							} )
						}
					/>
					<Button
						variant="secondary"
						onClick={ () =>
							updateBackground( {
								backgroundImage: {
									url: SAMPLE_IMAGE,
									source: 'file',
								},
								backgroundSize: 'contain',
							} )
						}
					>
						{ __( 'Use sample image', 'component-kitchen-sink' ) }
					</Button>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useBackgroundProps</h3>
				<div
					className={ backgroundProps.className }
					style={ {
						minHeight: '8em',
						padding: '1em',
						border: '1px dashed currentColor',
						...backgroundProps.style,
					} }
				>
					{ label }
				</div>
				<pre>
					{ JSON.stringify(
						{
							'useBackgroundProps( attributes )': backgroundProps,
						},
						null,
						2
					) }
				</pre>
			</div>
		</>
	);
}
