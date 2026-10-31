import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis -- this plugin exists to exercise these APIs. */
import {
	__unstableUseNavigateRegions as useNavigateRegions,
	PanelBody,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import './editor.scss';

const SHORTCUT_MODE_OPTIONS = [
	{
		label: 'default (ctrl+` / ctrl+shift+` / alt+shift+n,p)',
		value: 'default',
	},
	{ label: 'custom (ctrl+. next / ctrl+, previous)', value: 'custom' },
];

const CUSTOM_SHORTCUTS = {
	previous: [ { modifier: 'ctrl', character: ',' } ],
	next: [ { modifier: 'ctrl', character: '.' } ],
};

/**
 * Calls the hook and spreads its result (`ref`, `className`, `onKeyDown`) on
 * a wrapper element. `className` becomes `is-focusing-regions` after a
 * keyboard jump and resets on click.
 *
 * @param {Object}   props           Component props.
 * @param {Object}   props.shortcuts Shortcut definition, or undefined for the defaults.
 * @param {number}   props.count     Number of regions.
 * @param {()=>void} props.onFocus   Called with the label of the focused region.
 */
function RegionsWithHook( { shortcuts, count, onFocus } ) {
	const navigateProps = useNavigateRegions( shortcuts );
	return (
		<div { ...navigateProps }>
			{ Array.from( { length: count }, ( _, index ) => {
				const label = `Region ${ index + 1 }`;
				return (
					<div
						key={ label }
						role="region"
						tabIndex="-1"
						aria-label={ label }
						style={ {
							padding: 12,
							margin: '4px 0',
							border: '1px solid',
						} }
						onFocus={ () => onFocus( label ) }
					>
						{ label }
					</div>
				);
			} ) }
			<code>{ `wrapper className: "${ navigateProps.className }"` }</code>
		</div>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { shortcutMode, regionCount, lastFocused } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'useNavigateRegions',
						'component-kitchen-sink'
					) }
				>
					<SelectControl
						label="shortcuts"
						value={ shortcutMode }
						options={ SHORTCUT_MODE_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { shortcutMode: next } )
						}
					/>
					<RangeControl
						label="regions"
						value={ regionCount }
						min={ 1 }
						max={ 5 }
						onChange={ ( next ) =>
							setAttributes( { regionCount: next ?? 1 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>useNavigateRegions</h3>
				<p>
					{ __(
						'Focus a region, then press the shortcut to jump between regions.',
						'component-kitchen-sink'
					) }
				</p>
				<RegionsWithHook
					shortcuts={
						shortcutMode === 'custom' ? CUSTOM_SHORTCUTS : undefined
					}
					count={ regionCount }
					onFocus={ ( label ) => {
						if ( label !== lastFocused ) {
							setAttributes( { lastFocused: label } );
						}
					} }
				/>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
