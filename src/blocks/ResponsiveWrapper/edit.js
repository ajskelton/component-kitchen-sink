import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ResponsiveWrapper,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

// A self-contained image so the block needs no network request.
const IMAGE_SRC =
	'data:image/svg+xml;utf8,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">' +
			'<rect width="1600" height="900" fill="#0073aa"/>' +
			'<circle cx="800" cy="450" r="300" fill="#e8590c"/>' +
			'<rect x="0" y="0" width="1600" height="900" fill="none" stroke="#fff" stroke-width="20"/>' +
			'</svg>'
	);

export default function Edit( { attributes, setAttributes } ) {
	const { naturalWidth, naturalHeight, isInline, containerWidth } =
		attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	const wrapperProps = { naturalWidth, naturalHeight, isInline };

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'ResponsiveWrapper',
						'component-kitchen-sink'
					) }
				>
					<p>
						{ __(
							'ResponsiveWrapper is deprecated in this version of the package, so it logs a deprecation notice.',
							'component-kitchen-sink'
						) }
					</p>
					<RangeControl
						label="naturalWidth"
						value={ naturalWidth }
						min={ 100 }
						max={ 3000 }
						onChange={ ( next ) =>
							setAttributes( { naturalWidth: next ?? 1600 } )
						}
					/>
					<RangeControl
						label="naturalHeight"
						value={ naturalHeight }
						min={ 100 }
						max={ 3000 }
						onChange={ ( next ) =>
							setAttributes( { naturalHeight: next ?? 900 } )
						}
					/>
					<ToggleControl
						label="isInline"
						checked={ isInline }
						onChange={ set( 'isInline' ) }
					/>
					<RangeControl
						label={ __(
							'Container width (px)',
							'component-kitchen-sink'
						) }
						value={ containerWidth }
						min={ 120 }
						max={ 700 }
						onChange={ ( next ) =>
							setAttributes( { containerWidth: next ?? 360 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ResponsiveWrapper</h3>
				{ /* The wrapper keeps the aspect ratio as its container's width changes. */ }
				<div style={ { width: containerWidth, maxWidth: '100%' } }>
					<ResponsiveWrapper { ...wrapperProps }>
						<img src={ IMAGE_SRC } alt="" />
					</ResponsiveWrapper>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
