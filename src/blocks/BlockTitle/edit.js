import { __ } from '@wordpress/i18n';
import {
	BlockTitle,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import './editor.scss';

const TARGET_OPTIONS = [
	{ label: 'self (this block)', value: 'self' },
	{ label: 'parent block', value: 'parent' },
	{ label: 'first block in the editor', value: 'firstBlock' },
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { target, maximumLength, context } = attributes;

	// BlockTitle needs the clientId of a block that exists in the editor.
	const targetClientId = useSelect(
		( select ) => {
			const { getBlockRootClientId, getBlockOrder } =
				select( blockEditorStore );
			if ( target === 'parent' ) {
				return getBlockRootClientId( clientId );
			}
			if ( target === 'firstBlock' ) {
				return getBlockOrder()[ 0 ];
			}
			return clientId;
		},
		[ target, clientId ]
	);

	// Every prop exercised by this block.
	const blockTitleProps = {
		clientId: targetClientId,
		maximumLength: maximumLength > 0 ? maximumLength : undefined,
		context: context || undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'BlockTitle', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="clientId (which block)"
						value={ target }
						options={ TARGET_OPTIONS }
						help={ __(
							'The parent choice shows nothing for a top-level block.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { target: next } )
						}
					/>
					<TextControl
						type="number"
						label="maximumLength"
						help={ __(
							'0 means no truncation.',
							'component-kitchen-sink'
						) }
						value={ maximumLength }
						min={ 0 }
						onChange={ ( next ) =>
							setAttributes( {
								maximumLength: Number( next ) || 0,
							} )
						}
					/>
					<SelectControl
						label="context"
						value={ context }
						options={ [
							'',
							'visual',
							'accessibility',
							'list-view',
						].map( ( value ) => ( {
							label: value || '(none)',
							value,
						} ) ) }
						onChange={ ( next ) =>
							setAttributes( { context: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>BlockTitle</h3>
				<p>
					{ __( 'Title:', 'component-kitchen-sink' ) }{ ' ' }
					<strong>
						{ targetClientId ? (
							<BlockTitle { ...blockTitleProps } />
						) : (
							__( '(no such block)', 'component-kitchen-sink' )
						) }
					</strong>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
