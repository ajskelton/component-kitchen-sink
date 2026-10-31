import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	Toolbar,
	ToolbarItem,
} from '@wordpress/components';
import './editor.scss';

const AS_OPTIONS = [
	{ label: 'children render prop (Button)', value: 'render-prop' },
	{ label: 'as="button"', value: 'button-as' },
	{ label: 'as="input"', value: 'input-as' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { as, text, disabled, clicks } = attributes;

	const onClick = () => setAttributes( { clicks: clicks + 1 } );

	// ToolbarItem is headless: it needs either an `as` component or a render
	// prop child. All three forms receive the roving-tabindex props.
	const renderItem = () => {
		if ( as === 'button-as' ) {
			return (
				<ToolbarItem
					as="button"
					onClick={ onClick }
					disabled={ disabled }
				>
					{ text }
				</ToolbarItem>
			);
		}
		if ( as === 'input-as' ) {
			return (
				<ToolbarItem
					as="input"
					type="text"
					aria-label={ __(
						'ToolbarItem input',
						'component-kitchen-sink'
					) }
					value={ text }
					disabled={ disabled }
					onChange={ ( event ) =>
						setAttributes( { text: event.target.value } )
					}
				/>
			);
		}
		return (
			<ToolbarItem disabled={ disabled }>
				{ ( toolbarItemProps ) => (
					<Button
						{ ...toolbarItemProps }
						variant="secondary"
						size="compact"
						accessibleWhenDisabled
						onClick={ onClick }
					>
						{ text }
					</Button>
				) }
			</ToolbarItem>
		);
	};

	const renderToolbar = () => (
		<Toolbar label={ __( 'ToolbarItem demo', 'component-kitchen-sink' ) }>
			{ renderItem() }
			{ /* A second item so arrow-key roving focus is observable. */ }
			<ToolbarItem as="button" type="button">
				{ __( 'Sibling item', 'component-kitchen-sink' ) }
			</ToolbarItem>
		</Toolbar>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ToolbarItem', 'component-kitchen-sink' ) }
				>
					{ renderToolbar() }
					<SelectControl
						label="as / children"
						value={ as }
						options={ AS_OPTIONS }
						onChange={ ( next ) => setAttributes( { as: next } ) }
					/>
					<TextControl
						label="text"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
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
				<h3>ToolbarItem</h3>
				{ renderToolbar() }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
