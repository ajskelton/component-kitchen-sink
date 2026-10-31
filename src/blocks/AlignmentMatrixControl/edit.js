import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { AlignmentMatrixControl, PanelBody } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { alignmentMatrix } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'AlignmentMatrixControl',
						'component-kitchen-sink'
					) }
				>
					<AlignmentMatrixControl
						label={ __(
							'Alignment Matrix Control',
							'component-kitchen-sink'
						) }
						value={ alignmentMatrix }
						onChange={ ( nextAlignment ) =>
							setAttributes( { alignmentMatrix: nextAlignment } )
						}
						width={ 248 }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				{ __(
					'AlignmentMatrixControl test. Select block and update the alignment in the sidebar.',
					'component-kitchen-sink'
				) }
			</div>
		</>
	);
}
