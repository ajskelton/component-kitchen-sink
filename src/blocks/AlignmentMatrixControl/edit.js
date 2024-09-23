import { __ } from "@wordpress/i18n";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { useState } from "@wordpress/element";
import "./editor.scss";
import {
	__experimentalAlignmentMatrixControl as AlignmentMatrixControl,
	PanelBody,
} from "@wordpress/components";
export default function Edit({ attributes, setAttributes }) {
	const { alignmentMatrix } = attributes;
	const [alignment, setAlignment] = useState(alignmentMatrix);

	const updateAlignment = (newAlignment) => {
		setAttributes({ alignmentMatrix: newAlignment });
		setAlignment(newAlignment);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("AlignmentMatrixControl")}>
					<AlignmentMatrixControl
						label={__("Alignment Matrix Control")}
						value={alignment}
						onChange={updateAlignment}
						width={248}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>
				{__(
					"AlignmentMatrixControl test. Select block and update the alignment in the sidebar.",
					"component-kitchen-sink",
				)}
			</div>
		</>
	);
}
