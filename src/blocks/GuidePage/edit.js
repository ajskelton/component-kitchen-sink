import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Guide,
	GuidePage,
	PanelBody,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { pageCount, pageText, pageClassName, timesOpened, timesFinished } =
		attributes;
	const [ isOpen, setIsOpen ] = useState( false );

	const open = () => {
		setAttributes( { timesOpened: timesOpened + 1 } );
		setIsOpen( true );
	};
	const finish = () => {
		setAttributes( { timesFinished: timesFinished + 1 } );
		setIsOpen( false );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'GuidePage', 'component-kitchen-sink' ) }
				>
					<RangeControl
						label="number of GuidePage children"
						value={ pageCount }
						min={ 1 }
						max={ 5 }
						onChange={ ( next ) =>
							setAttributes( { pageCount: next ?? 3 } )
						}
					/>
					<TextControl
						label="children"
						value={ pageText }
						onChange={ ( next ) =>
							setAttributes( { pageText: next } )
						}
					/>
					<TextControl
						label="className"
						value={ pageClassName }
						onChange={ ( next ) =>
							setAttributes( { pageClassName: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( {
								timesOpened: 0,
								timesFinished: 0,
							} )
						}
					>
						{ __( 'Reset counters', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>GuidePage</h3>
				<Button variant="secondary" onClick={ open }>
					{ __(
						'Open Guide with GuidePage children',
						'component-kitchen-sink'
					) }
				</Button>
				<p>
					{ `Opened ${ timesOpened } time(s), finished ${ timesFinished } time(s).` }
				</p>
				{ /* GuidePage is the deprecated way to give Guide its pages (use the pages prop). */ }
				{ isOpen && (
					<Guide contentLabel="GuidePage demo" onFinish={ finish }>
						{ Array.from( { length: pageCount }, ( _, index ) => (
							<GuidePage
								key={ index }
								className={ pageClassName || undefined }
							>
								<p>{ `${ pageText } (${ index + 1 } of ${ pageCount })` }</p>
							</GuidePage>
						) ) }
					</Guide>
				) }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
