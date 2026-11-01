import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	ButtonGroup,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

const CHOICES = [ 'left', 'center', 'right' ];

const SIZE_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: 'compact', value: 'compact' },
	{ label: 'small', value: 'small' },
];

// ButtonGroup is deprecated since WordPress 6.8 in favour of
// ToggleGroupControl. Mounting it logs a deprecation notice by design.
export default function Edit( { attributes, setAttributes } ) {
	const { selected, size, className, clicks } = attributes;

	const group = (
		<ButtonGroup className={ className || undefined }>
			{ CHOICES.map( ( choice ) => (
				<Button
					key={ choice }
					size={ size }
					variant={ choice === selected ? 'primary' : 'secondary' }
					isPressed={ choice === selected }
					onClick={ () =>
						setAttributes( {
							selected: choice,
							clicks: clicks + 1,
						} )
					}
				>
					{ choice }
				</Button>
			) ) }
		</ButtonGroup>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ButtonGroup', 'component-kitchen-sink' ) }
				>
					<BaseControl
						id="ajs-button-group-preview"
						label={ __( 'Preview', 'component-kitchen-sink' ) }
						help={ __(
							'Deprecated since 6.8; logs a deprecation notice when mounted. Clicking a Button sets selected and increments clicks.',
							'component-kitchen-sink'
						) }
					>
						<div>{ group }</div>
					</BaseControl>
					<SelectControl
						label="size (on each Button)"
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( next ) => setAttributes( { size: next } ) }
					/>
					<TextControl
						label="className"
						value={ className }
						onChange={ ( next ) =>
							setAttributes( { className: next ?? '' } )
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
				<h3>ButtonGroup</h3>
				{ group }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
