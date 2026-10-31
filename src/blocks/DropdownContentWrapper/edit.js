import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	Button,
	Dropdown,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	PanelBody,
	SelectControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const PADDING_OPTIONS = [
	{ label: 'none', value: 'none' },
	{ label: 'small', value: 'small' },
	{ label: 'medium', value: 'medium' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { paddingSize } = attributes;

	const wrapperProps = { paddingSize };

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'DropdownContentWrapper',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="paddingSize"
						value={ paddingSize }
						options={ PADDING_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { paddingSize: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>DropdownContentWrapper</h3>
				{ /* The wrapper is only meaningful as a Dropdown's renderContent. */ }
				<Dropdown
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							variant="secondary"
							onClick={ onToggle }
							aria-expanded={ isOpen }
						>
							{ __(
								'Open Dropdown with wrapped content',
								'component-kitchen-sink'
							) }
						</Button>
					) }
					renderContent={ () => (
						<DropdownContentWrapper { ...wrapperProps }>
							<div
								style={ {
									background: '#f0f0f0',
									minWidth: 200,
								} }
							>
								{ __(
									'Content inside DropdownContentWrapper',
									'component-kitchen-sink'
								) }
							</div>
						</DropdownContentWrapper>
					) }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
