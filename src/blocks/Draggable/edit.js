import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Draggable,
	Icon,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { dragHandle } from '@wordpress/icons';
import './editor.scss';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		payload,
		appendToOwnerDocument,
		cloneClassname,
		useDragComponent,
		dragStarts,
		drops,
		lastDropped,
	} = attributes;
	const [ isOver, setIsOver ] = useState( false );
	const elementId = `ajs-draggable-${ clientId }`;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const draggableProps = {
		elementId,
		transferData: { payload },
		appendToOwnerDocument,
		cloneClassname: cloneClassname || undefined,
		__experimentalDragComponent: useDragComponent ? (
			<div
				style={ {
					padding: 8,
					background: '#fff',
					border: '1px solid #1e1e1e',
				} }
			>
				{ payload }
			</div>
		) : undefined,
		onDragStart: () => setAttributes( { dragStarts: dragStarts + 1 } ),
	};

	const onDrop = ( event ) => {
		event.preventDefault();
		// Keep the editor from also handling the drop (e.g. inserting blocks).
		event.stopPropagation();
		setIsOver( false );
		let dropped = '';
		try {
			dropped = JSON.parse(
				event.dataTransfer.getData( 'text' )
			).payload;
		} catch {
			dropped = event.dataTransfer.getData( 'text' );
		}
		setAttributes( { drops: drops + 1, lastDropped: dropped } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Draggable', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="transferData.payload"
						value={ payload }
						onChange={ ( next ) =>
							setAttributes( { payload: next } )
						}
					/>
					<ToggleControl
						label="appendToOwnerDocument"
						checked={ appendToOwnerDocument }
						onChange={ ( next ) =>
							setAttributes( { appendToOwnerDocument: next } )
						}
					/>
					<TextControl
						label="cloneClassname"
						value={ cloneClassname }
						onChange={ ( next ) =>
							setAttributes( { cloneClassname: next } )
						}
					/>
					<ToggleControl
						label="__experimentalDragComponent"
						checked={ useDragComponent }
						onChange={ ( next ) =>
							setAttributes( { useDragComponent: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () =>
							setAttributes( {
								dragStarts: 0,
								drops: 0,
								lastDropped: '',
							} )
						}
					>
						{ __( 'Reset counters', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Draggable</h3>
				<div
					id={ elementId }
					style={ {
						display: 'inline-flex',
						alignItems: 'center',
						gap: 8,
						padding: 8,
						background: '#f0f0f0',
					} }
				>
					<Draggable { ...draggableProps }>
						{ ( { onDraggableStart, onDraggableEnd } ) => (
							<div
								draggable
								onDragStart={ onDraggableStart }
								onDragEnd={ onDraggableEnd }
								style={ { cursor: 'grab' } }
								aria-label={ __(
									'Drag handle',
									'component-kitchen-sink'
								) }
							>
								<Icon icon={ dragHandle } />
							</div>
						) }
					</Draggable>
					<span>
						{ __(
							'Drag me by the handle',
							'component-kitchen-sink'
						) }
					</span>
				</div>
				{ /* A plain drop target to prove the transfer data arrives. */ }
				<div
					onDragOver={ ( event ) => {
						event.preventDefault();
						setIsOver( true );
					} }
					onDragLeave={ () => setIsOver( false ) }
					onDrop={ onDrop }
					style={ {
						marginTop: 12,
						padding: 16,
						border: `2px dashed ${ isOver ? '#3858e9' : '#949494' }`,
					} }
				>
					{ `Drop here. Drag starts: ${ dragStarts }. Drops: ${ drops }. Last dropped: ${
						lastDropped || '-'
					}` }
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
