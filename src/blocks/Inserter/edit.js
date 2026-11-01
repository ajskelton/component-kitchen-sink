import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	Inserter,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const POSITION_OPTIONS = [
	'bottom center',
	'bottom left',
	'bottom right',
	'top center',
	'middle right',
].map( ( value ) => ( { label: value, value } ) );

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		position,
		isAppender,
		isQuick,
		selectBlockOnInsert,
		showInserterHelpPanel,
		shouldDirectInsert,
		disabled,
		toggleLabel,
		selections,
	} = attributes;

	// Every prop exercised by this block. rootClientId points the Inserter at
	// this block's own inner blocks, so inserted blocks land below it.
	const inserterProps = {
		rootClientId: clientId,
		position,
		isAppender,
		__experimentalIsQuick: isQuick,
		selectBlockOnInsert,
		showInserterHelpPanel,
		shouldDirectInsert,
		disabled,
		toggleProps: toggleLabel ? { label: toggleLabel } : undefined,
		onSelectOrClose: () => setAttributes( { selections: selections + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Inserter', 'component-kitchen-sink' ) }>
					<SelectControl
						label="position"
						value={ position }
						options={ POSITION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { position: next } )
						}
					/>
					<ToggleControl
						label="isAppender"
						help={ __(
							'On inserts into this block (rootClientId). Off inserts after the selected block, beside this one.',
							'component-kitchen-sink'
						) }
						checked={ isAppender }
						onChange={ ( next ) =>
							setAttributes( { isAppender: next } )
						}
					/>
					<ToggleControl
						label="__experimentalIsQuick"
						checked={ isQuick }
						onChange={ ( next ) =>
							setAttributes( { isQuick: next } )
						}
					/>
					<ToggleControl
						label="selectBlockOnInsert"
						checked={ selectBlockOnInsert }
						onChange={ ( next ) =>
							setAttributes( { selectBlockOnInsert: next } )
						}
					/>
					<ToggleControl
						label="showInserterHelpPanel"
						checked={ showInserterHelpPanel }
						onChange={ ( next ) =>
							setAttributes( { showInserterHelpPanel: next } )
						}
					/>
					<ToggleControl
						label="shouldDirectInsert"
						checked={ shouldDirectInsert }
						onChange={ ( next ) =>
							setAttributes( { shouldDirectInsert: next } )
						}
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
					<TextControl
						label="toggleProps.label"
						value={ toggleLabel }
						onChange={ ( next ) =>
							setAttributes( { toggleLabel: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { selections: 0 } ) }
					>
						{ __(
							'Reset onSelectOrClose count',
							'component-kitchen-sink'
						) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Inserter</h3>
				<Inserter { ...inserterProps } />
				<InnerBlocks
					allowedBlocks={ [
						'core/paragraph',
						'core/heading',
						'core/image',
					] }
					renderAppender={ false }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
