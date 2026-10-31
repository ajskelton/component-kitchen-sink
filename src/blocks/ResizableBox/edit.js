import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	RangeControl,
	ResizableBox,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes, toggleSelection } ) {
	const {
		width,
		height,
		showHandle,
		lockAspectRatio,
		minWidth,
		minHeight,
		enableRight,
		enableBottom,
		enableBottomRight,
		showTooltip,
	} = attributes;

	const set = ( name ) => ( next ) => setAttributes( { [ name ]: next } );

	const boxProps = {
		size: { width, height },
		showHandle,
		lockAspectRatio,
		minWidth,
		minHeight,
		// Only the right, bottom and bottom-right handles can be switched on.
		enable: {
			top: false,
			right: enableRight,
			bottom: enableBottom,
			left: false,
			topRight: false,
			bottomRight: enableBottomRight,
			bottomLeft: false,
			topLeft: false,
		},
		__experimentalShowTooltip: showTooltip,
		// Stop the block from being dragged while a handle is dragged.
		onResizeStart: () => toggleSelection?.( false ),
		onResizeStop: ( event, direction, element, delta ) => {
			setAttributes( {
				width: Math.round( width + delta.width ),
				height: Math.round( height + delta.height ),
			} );
			toggleSelection?.( true );
		},
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'ResizableBox', 'component-kitchen-sink' ) }
				>
					<RangeControl
						label="size.width"
						value={ width }
						min={ minWidth }
						max={ 800 }
						onChange={ ( next ) =>
							setAttributes( { width: next ?? 320 } )
						}
					/>
					<RangeControl
						label="size.height"
						value={ height }
						min={ minHeight }
						max={ 600 }
						onChange={ ( next ) =>
							setAttributes( { height: next ?? 160 } )
						}
					/>
					<RangeControl
						label="minWidth"
						value={ minWidth }
						min={ 20 }
						max={ 300 }
						onChange={ ( next ) =>
							setAttributes( { minWidth: next ?? 80 } )
						}
					/>
					<RangeControl
						label="minHeight"
						value={ minHeight }
						min={ 20 }
						max={ 300 }
						onChange={ ( next ) =>
							setAttributes( { minHeight: next ?? 60 } )
						}
					/>
					<ToggleControl
						label="showHandle"
						checked={ showHandle }
						onChange={ set( 'showHandle' ) }
					/>
					<ToggleControl
						label="lockAspectRatio"
						checked={ lockAspectRatio }
						onChange={ set( 'lockAspectRatio' ) }
					/>
					<ToggleControl
						label="enable.right"
						checked={ enableRight }
						onChange={ set( 'enableRight' ) }
					/>
					<ToggleControl
						label="enable.bottom"
						checked={ enableBottom }
						onChange={ set( 'enableBottom' ) }
					/>
					<ToggleControl
						label="enable.bottomRight"
						checked={ enableBottomRight }
						onChange={ set( 'enableBottomRight' ) }
					/>
					<ToggleControl
						label="__experimentalShowTooltip"
						checked={ showTooltip }
						onChange={ set( 'showTooltip' ) }
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( { width: 320, height: 160 } )
						}
					>
						{ __( 'Reset size', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ResizableBox</h3>
				<ResizableBox { ...boxProps }>
					<div
						style={ {
							width: '100%',
							height: '100%',
							background: '#0073aa',
							color: '#fff',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxSizing: 'border-box',
						} }
					>
						{ width } x { height }
					</div>
				</ResizableBox>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
