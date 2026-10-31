import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	NoticeList,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const STATUS_OPTIONS = [
	{ label: 'info', value: 'info' },
	{ label: 'success', value: 'success' },
	{ label: 'warning', value: 'warning' },
	{ label: 'error', value: 'error' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { notices, nextId, newStatus, newContent, isDismissible } =
		attributes;

	const addNotice = () =>
		setAttributes( {
			notices: [
				...notices,
				{
					id: `notice-${ nextId }`,
					status: newStatus,
					content: `${ newContent } (#${ nextId })`,
					isDismissible,
				},
			],
			nextId: nextId + 1,
		} );

	// Every prop exercised by this block, shared by the inspector and canvas.
	const listProps = {
		notices,
		// onRemove is called with the id when a Notice is dismissed.
		onRemove: ( id ) =>
			setAttributes( {
				notices: notices.filter( ( notice ) => notice.id !== id ),
			} ),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'NoticeList', 'component-kitchen-sink' ) }
				>
					<TextControl
						label="notices[].content"
						value={ newContent }
						onChange={ ( next ) =>
							setAttributes( { newContent: next } )
						}
					/>
					<SelectControl
						label="notices[].status"
						value={ newStatus }
						options={ STATUS_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { newStatus: next } )
						}
					/>
					<ToggleControl
						label="notices[].isDismissible"
						checked={ isDismissible }
						onChange={ ( next ) =>
							setAttributes( { isDismissible: next } )
						}
					/>
					<Button variant="secondary" onClick={ addNotice }>
						{ __( 'Add notice', 'component-kitchen-sink' ) }
					</Button>{ ' ' }
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { notices: [] } ) }
					>
						{ __( 'Clear notices', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>NoticeList</h3>
				<NoticeList { ...listProps }>
					<p>
						{ __(
							'NoticeList children render above the notices.',
							'component-kitchen-sink'
						) }
					</p>
				</NoticeList>
				<Button variant="secondary" onClick={ addNotice }>
					{ __( 'Add notice', 'component-kitchen-sink' ) }
				</Button>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
