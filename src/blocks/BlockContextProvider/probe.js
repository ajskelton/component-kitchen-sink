import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export const PROBE_NAME = 'ajs/context-probe';
export const CONTEXT_TEXT_KEY = 'ajs/probeText';
export const CONTEXT_NUMBER_KEY = 'ajs/probeNumber';

/**
 * A throwaway, client-only block used to make block context visible. It is
 * registered in the editor only (never on the server) and is only ever
 * created inside the nested editor of the BlockContextProvider test block.
 *
 * @param {Object} props         Edit props.
 * @param {Object} props.context Block context resolved from `usesContext`.
 */
function ProbeEdit( { context } ) {
	return (
		<div
			{ ...useBlockProps( {
				style: { border: '1px solid #949494', padding: '8px' },
			} ) }
		>
			<strong>{ __( 'Context probe', 'component-kitchen-sink' ) }</strong>
			<pre>
				{ JSON.stringify(
					{
						[ CONTEXT_TEXT_KEY ]: context[ CONTEXT_TEXT_KEY ],
						[ CONTEXT_NUMBER_KEY ]: context[ CONTEXT_NUMBER_KEY ],
					},
					null,
					2
				) }
			</pre>
		</div>
	);
}

export const probeSettings = {
	apiVersion: 3,
	title: 'Context probe',
	category: 'ajs-kitchen-sink',
	description: 'Shows the block context it receives. Test fixture.',
	attributes: {},
	supports: { inserter: false },
	usesContext: [ CONTEXT_TEXT_KEY, CONTEXT_NUMBER_KEY ],
	edit: ProbeEdit,
	save: () => null,
};
