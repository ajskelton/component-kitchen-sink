import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	IconButton,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import {
	check,
	cog,
	external,
	plus,
	starFilled,
	trash,
} from '@wordpress/icons';
import './editor.scss';

const ICONS = { plus, cog, check, trash, external, starFilled };

const ICON_OPTIONS = Object.keys( ICONS ).map( ( key ) => ( {
	label: key,
	value: key,
} ) );

const LABEL_POSITION_OPTIONS = [
	'top',
	'bottom',
	'left',
	'right',
	'top center',
	'bottom center',
].map( ( value ) => ( { label: value, value } ) );

export default function Edit( { attributes, setAttributes } ) {
	const { icon, label, tooltip, labelPosition, size, clicks } = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const iconButtonProps = {
		icon: ICONS[ icon ],
		label,
		tooltip: tooltip || undefined,
		labelPosition,
		size,
		onClick: () => setAttributes( { clicks: clicks + 1 } ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'IconButton', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="icon"
						value={ icon }
						options={ ICON_OPTIONS }
						onChange={ ( next ) => setAttributes( { icon: next } ) }
					/>
					<TextControl
						label="label"
						value={ label }
						onChange={ ( next ) =>
							setAttributes( { label: next } )
						}
					/>
					<TextControl
						label="tooltip"
						help={ __(
							'Overrides label as the tooltip text.',
							'component-kitchen-sink'
						) }
						value={ tooltip }
						onChange={ ( next ) =>
							setAttributes( { tooltip: next } )
						}
					/>
					<SelectControl
						label="labelPosition"
						value={ labelPosition }
						options={ LABEL_POSITION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { labelPosition: next } )
						}
					/>
					<RangeControl
						label="size (icon size in px)"
						value={ size }
						min={ 12 }
						max={ 48 }
						onChange={ ( next ) =>
							setAttributes( { size: next ?? 24 } )
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
				<h3>IconButton</h3>
				{ /* Deprecated since 5.4: logs a deprecation warning when rendered. */ }
				<IconButton { ...iconButtonProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
