import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__experimentalResponsiveBlockControl as ResponsiveBlockControl,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const CUSTOM_VIEWPORTS = [
	{ id: 'phone', label: __( 'Phones', 'component-kitchen-sink' ) },
	{ id: 'desktop', label: __( 'Desktops', 'component-kitchen-sink' ) },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		property,
		toggleLabel,
		isResponsive,
		useCustomViewports,
		values,
	} = attributes;

	// ResponsiveBlockControl does not persist anything: the render function
	// below writes each viewport's value to the `values` attribute.
	const renderDefaultControl = ( labelComponent, viewport ) => (
		<RangeControl
			label={ labelComponent }
			value={ values[ viewport.id ] ?? 0 }
			min={ 0 }
			max={ 100 }
			onChange={ ( next ) =>
				setAttributes( {
					values: { ...values, [ viewport.id ]: next ?? 0 },
				} )
			}
		/>
	);

	// Every prop exercised by this block, shared by the inspector and canvas.
	const controlProps = {
		title,
		property,
		toggleLabel: toggleLabel || undefined,
		isResponsive,
		onIsResponsiveChange: () =>
			setAttributes( { isResponsive: ! isResponsive } ),
		renderDefaultControl,
		viewports: useCustomViewports ? CUSTOM_VIEWPORTS : undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'ResponsiveBlockControl',
						'component-kitchen-sink'
					) }
				>
					<ResponsiveBlockControl { ...controlProps } />
					<TextControl
						label="title"
						value={ title }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
						}
					/>
					<TextControl
						label="property"
						value={ property }
						onChange={ ( next ) =>
							setAttributes( { property: next } )
						}
					/>
					<TextControl
						label="toggleLabel"
						value={ toggleLabel }
						onChange={ ( next ) =>
							setAttributes( { toggleLabel: next } )
						}
					/>
					<ToggleControl
						label="isResponsive"
						checked={ isResponsive }
						onChange={ ( next ) =>
							setAttributes( { isResponsive: next } )
						}
					/>
					<ToggleControl
						label="viewports (custom phone and desktop)"
						checked={ useCustomViewports }
						onChange={ ( next ) =>
							setAttributes( { useCustomViewports: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ResponsiveBlockControl</h3>
				<ResponsiveBlockControl { ...controlProps } />
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
