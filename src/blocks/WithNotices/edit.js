import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	withNotices,
} from '@wordpress/components';
import './editor.scss';

const STATUS_OPTIONS = [ 'info', 'success', 'warning', 'error' ].map(
	( value ) => ( { label: value, value } )
);

/**
 * The wrapped component receives `noticeOperations`, `noticeList` and
 * `noticeUI` from withNotices, plus the props the block passes in.
 *
 * @param {Object} props                  Component props.
 * @param {Object} props.noticeOperations createNotice, createErrorNotice, removeNotice, removeAllNotices.
 * @param {Array}  props.noticeList       Current notices.
 * @param {Object} props.noticeUI         Rendered NoticeList, or false when empty.
 * @param {Object} props.noticeConfig     Options for the notice to create.
 * @param {Object} props.onCreated        Called after a notice is created.
 */
function NoticeDemo( {
	noticeOperations,
	noticeList,
	noticeUI,
	noticeConfig,
	onCreated,
} ) {
	const { status, message, isDismissible, withAction } = noticeConfig;

	return (
		<div>
			{ noticeUI }
			<Button
				variant="secondary"
				onClick={ () => {
					noticeOperations.createNotice( {
						status,
						content: message,
						isDismissible,
						actions: withAction
							? [
									{
										label: __(
											'Action',
											'component-kitchen-sink'
										),
										onClick: () =>
											noticeOperations.removeAllNotices(),
									},
								]
							: undefined,
					} );
					onCreated();
				} }
			>
				{ __( 'createNotice', 'component-kitchen-sink' ) }
			</Button>{ ' ' }
			<Button
				variant="secondary"
				isDestructive
				onClick={ () => {
					noticeOperations.createErrorNotice( message );
					onCreated();
				} }
			>
				{ __( 'createErrorNotice', 'component-kitchen-sink' ) }
			</Button>{ ' ' }
			<Button
				variant="tertiary"
				onClick={ () => noticeOperations.removeAllNotices() }
			>
				{ __( 'removeAllNotices', 'component-kitchen-sink' ) }
			</Button>
			<p>{ `noticeList.length: ${ noticeList.length }` }</p>
		</div>
	);
}

// Created once at module level, never inside render.
const NoticeDemoWithNotices = withNotices( NoticeDemo );

export default function Edit( { attributes, setAttributes } ) {
	const { status, message, isDismissible, withAction, created } = attributes;

	const noticeConfig = { status, message, isDismissible, withAction };

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'withNotices', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="status"
						value={ status }
						options={ STATUS_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { status: next } )
						}
					/>
					<TextControl
						label="content"
						value={ message }
						onChange={ ( next ) =>
							setAttributes( { message: next } )
						}
					/>
					<ToggleControl
						label="isDismissible"
						checked={ isDismissible }
						onChange={ ( next ) =>
							setAttributes( { isDismissible: next } )
						}
					/>
					<ToggleControl
						label="actions"
						checked={ withAction }
						onChange={ ( next ) =>
							setAttributes( { withAction: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>withNotices</h3>
				<NoticeDemoWithNotices
					noticeConfig={ noticeConfig }
					onCreated={ () =>
						setAttributes( { created: created + 1 } )
					}
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
