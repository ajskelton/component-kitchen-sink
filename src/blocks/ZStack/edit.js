import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	__experimentalZStack as ZStack,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const COLORS = [ '#0073aa', '#e8590c', '#2b8a3e', '#862e9c', '#c92a2a' ];

export default function Edit( { attributes, setAttributes } ) {
	const { isLayered, isReversed, offset, itemCount } = attributes;

	const stackProps = { isLayered, isReversed, offset };

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'ZStack', 'component-kitchen-sink' ) }>
					<ToggleControl
						label="isLayered"
						checked={ isLayered }
						onChange={ ( next ) =>
							setAttributes( { isLayered: next } )
						}
					/>
					<ToggleControl
						label="isReversed"
						checked={ isReversed }
						onChange={ ( next ) =>
							setAttributes( { isReversed: next } )
						}
					/>
					<RangeControl
						label="offset"
						value={ offset }
						min={ -40 }
						max={ 80 }
						onChange={ ( next ) =>
							setAttributes( { offset: next ?? 0 } )
						}
					/>
					<RangeControl
						label={ __(
							'Number of children',
							'component-kitchen-sink'
						) }
						value={ itemCount }
						min={ 2 }
						max={ 5 }
						onChange={ ( next ) =>
							setAttributes( { itemCount: next ?? 4 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>ZStack</h3>
				<div style={ { border: '1px dashed #999', padding: 16 } }>
					<ZStack { ...stackProps }>
						{ COLORS.slice( 0, itemCount ).map(
							( color, index ) => (
								<div
									key={ color }
									style={ {
										background: color,
										color: '#fff',
										width: 56,
										height: 56,
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										border: '2px solid #fff',
										boxSizing: 'border-box',
									} }
								>
									{ index + 1 }
								</div>
							)
						) }
					</ZStack>
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
