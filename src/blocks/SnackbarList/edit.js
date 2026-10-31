import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SnackbarList,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { notices, nextId, newContent, explicitDismiss, withAction } =
		attributes;

	const addNotice = () =>
		setAttributes( {
			notices: [
				...notices,
				{
					id: `snackbar-${ nextId }`,
					content: `${ newContent } (#${ nextId })`,
					explicitDismiss,
					actions: withAction
						? [ { label: 'Undo', url: '#undo' } ]
						: undefined,
				},
			],
			nextId: nextId + 1,
		} );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const listProps = {
		notices,
		// onRemove is called with the id when a Snackbar is dismissed or times out.
		onRemove: ( id ) =>
			setAttributes( {
				notices: notices.filter( ( notice ) => notice.id !== id ),
			} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'SnackbarList', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="notices[].content"
						value={ newContent }
						onChange={ ( next ) =>
							setAttributes( { newContent: next } )
						}
					/>
					<ToggleControl
						label="notices[].explicitDismiss"
						help={ __(
							'Off: each Snackbar removes itself after 6 seconds.',
							'component-kitchen-sink'
						) }
						checked={ explicitDismiss }
						onChange={ ( next ) =>
							setAttributes( { explicitDismiss: next } )
						}
					/>
					<ToggleControl
						label="notices[].actions"
						checked={ withAction }
						onChange={ ( next ) =>
							setAttributes( { withAction: next } )
						}
					/>
					<Button variant="secondary" onClick={ addNotice }>
						{ __( 'Add snackbar', 'component-kitchen-sink' ) }
					</Button>{ ' ' }
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { notices: [] } ) }
					>
						{ __( 'Clear snackbars', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>SnackbarList</h3>
				<Button variant="secondary" onClick={ addNotice }>
					{ __( 'Add snackbar', 'component-kitchen-sink' ) }
				</Button>
				{ /* The list is position: absolute, so give it a positioned stage. */ }
				<div className="ajs-snackbar-list-stage">
					<SnackbarList { ...listProps } />
				</div>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
