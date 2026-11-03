import { __ } from '@wordpress/i18n';
import {
	BlockStyles,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { hoveredStyle, switches } = attributes;

	// Every prop exercised by this block. The styles themselves are declared
	// in block.json ("styles"); choosing one changes the className attribute
	// (is-style-<name>), which the stylesheet reacts to.
	const blockStylesProps = {
		clientId,
		onSwitch: () => setAttributes( { switches: switches + 1 } ),
		onHoverClassName: ( name ) =>
			setAttributes( { hoveredStyle: name ?? '' } ),
	};

	return (
		<>
			<InspectorControls>
				{ /* BlockStyles renders its own "Styles" tools panel. */ }
				<BlockStyles { ...blockStylesProps } />
				<PanelBody
					title={ __( 'BlockStyles', 'component-kitchen-sink' ) }
					initialOpen={ false }
				>
					<p>
						{ `onSwitch calls: ${ switches }; onHoverClassName: ${
							hoveredStyle || '(none)'
						}` }
					</p>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( { switches: 0, hoveredStyle: '' } )
						}
					>
						{ __( 'Reset counters', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockStyles</h3>
				<p>
					{ __(
						'Pick a style in the "Styles" panel of the inspector (styles are Default, Fancy, Outline, Inverted).',
						'component-kitchen-sink'
					) }
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
