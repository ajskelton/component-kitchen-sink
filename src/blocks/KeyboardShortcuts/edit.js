import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useCallback, useRef } from '@wordpress/element';
import {
	Button,
	KeyboardShortcuts,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const SHORTCUT_OPTIONS = [ 'mod+j', 'shift+j', 'j', 'g i' ].map(
	( value ) => ( { label: value, value } )
);

const EVENT_NAME_OPTIONS = [ 'keydown', 'keyup', 'keypress' ].map(
	( value ) => ( { label: value, value } )
);

const TARGET_OPTIONS = [
	{ label: 'children (events inside this block)', value: 'children' },
	{ label: 'no children (events on the document)', value: 'document' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { shortcut, bindGlobal, eventName, target, count, typed } =
		attributes;

	// KeyboardShortcuts needs a stable callback and does not react to a
	// changed `shortcuts` prop, so keep the latest state in a ref and remount
	// the component (via `key`) when the bindings change.
	const latest = useRef( {} );
	latest.current = { count, setAttributes };
	const onShortcut = useCallback( () => {
		latest.current.setAttributes( { count: latest.current.count + 1 } );
	}, [] );

	const shortcutsProps = {
		shortcuts: { [ shortcut ]: onShortcut },
		bindGlobal,
		eventName,
	};
	const remountKey = `${ shortcut }|${ bindGlobal }|${ eventName }|${ target }`;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'KeyboardShortcuts',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="shortcuts (key)"
						value={ shortcut }
						options={ SHORTCUT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { shortcut: next } )
						}
					/>
					<ToggleControl
						label="bindGlobal"
						checked={ bindGlobal }
						help={ __(
							'Also fire while typing in an editable field.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { bindGlobal: next } )
						}
					/>
					<SelectControl
						label="eventName"
						value={ eventName }
						options={ EVENT_NAME_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { eventName: next } )
						}
					/>
					<SelectControl
						label="children"
						value={ target }
						options={ TARGET_OPTIONS }
						help={ __(
							'Without children the shortcuts bind to the top-level document, not the canvas iframe.',
							'component-kitchen-sink'
						) }
						onChange={ ( next ) =>
							setAttributes( { target: next } )
						}
					/>
					<Button
						variant="tertiary"
						size="compact"
						onClick={ () => setAttributes( { count: 0 } ) }
					>
						{ __( 'Reset count', 'component-kitchen-sink' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>KeyboardShortcuts</h3>
				{ target === 'children' ? (
					<KeyboardShortcuts key={ remountKey } { ...shortcutsProps }>
						<Button variant="secondary">
							{ __(
								'Focus me, then press the shortcut',
								'component-kitchen-sink'
							) }
						</Button>
						<TextControl
							label={ __(
								'Type here (blocked unless bindGlobal)',
								'component-kitchen-sink'
							) }
							value={ typed }
							onChange={ ( next ) =>
								setAttributes( { typed: next } )
							}
						/>
					</KeyboardShortcuts>
				) : (
					<>
						<KeyboardShortcuts
							key={ remountKey }
							{ ...shortcutsProps }
						/>
						<p>
							{ __(
								'Shortcut bound on the document (no children).',
								'component-kitchen-sink'
							) }
						</p>
					</>
				) }
				<p>
					<strong>{ `${ shortcut } fired ${ count } times` }</strong>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
