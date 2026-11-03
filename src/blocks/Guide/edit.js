import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Guide,
	PanelBody,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const {
		contentLabel,
		pageCount,
		finishButtonText,
		nextButtonText,
		previousButtonText,
		timesOpened,
		timesFinished,
	} = attributes;
	const [ isOpen, setIsOpen ] = useState( false );

	const open = () => {
		setAttributes( { timesOpened: timesOpened + 1 } );
		setIsOpen( true );
	};

	// Every prop exercised by this block, shared by the inspector and canvas.
	const guideProps = {
		contentLabel,
		finishButtonText: finishButtonText || undefined,
		nextButtonText: nextButtonText || undefined,
		previousButtonText: previousButtonText || undefined,
		pages: Array.from( { length: pageCount }, ( _, index ) => ( {
			content: (
				<>
					<h1 className="edit-post-welcome-guide__heading">
						{ `Page ${ index + 1 } of ${ pageCount }` }
					</h1>
					<p>
						{ __(
							'Use the buttons or the arrow keys to move between pages.',
							'component-kitchen-sink'
						) }
					</p>
				</>
			),
		} ) ),
		onFinish: () => {
			setAttributes( { timesFinished: timesFinished + 1 } );
			setIsOpen( false );
		},
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Guide', 'component-kitchen-sink' ) }>
					<TextControl
						label="contentLabel"
						value={ contentLabel }
						onChange={ ( next ) =>
							setAttributes( { contentLabel: next } )
						}
					/>
					<RangeControl
						label="pages (count)"
						help={ __(
							'With a single page the Guide has no close button or page control.',
							'component-kitchen-sink'
						) }
						value={ pageCount }
						min={ 1 }
						max={ 5 }
						onChange={ ( next ) =>
							setAttributes( { pageCount: next ?? 3 } )
						}
					/>
					<TextControl
						label="finishButtonText"
						value={ finishButtonText }
						onChange={ ( next ) =>
							setAttributes( { finishButtonText: next } )
						}
					/>
					<TextControl
						label="nextButtonText"
						value={ nextButtonText }
						onChange={ ( next ) =>
							setAttributes( { nextButtonText: next } )
						}
					/>
					<TextControl
						label="previousButtonText"
						value={ previousButtonText }
						onChange={ ( next ) =>
							setAttributes( { previousButtonText: next } )
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
				<h3>Guide</h3>
				<Button variant="secondary" onClick={ open }>
					{ __( 'Open Guide', 'component-kitchen-sink' ) }
				</Button>
				<p>
					{ `Opened ${ timesOpened } time(s), finished ${ timesFinished } time(s).` }
				</p>
				{ isOpen && <Guide { ...guideProps } /> }
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
