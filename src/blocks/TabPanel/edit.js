import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TabPanel,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { cog, starFilled } from '@wordpress/icons';
import './editor.scss';

const ORIENTATION_OPTIONS = [
	{ label: 'horizontal', value: 'horizontal' },
	{ label: 'vertical', value: 'vertical' },
];

const TAB_NAME_OPTIONS = [
	{ label: 'tab1', value: 'tab1' },
	{ label: 'tab2', value: 'tab2' },
	{ label: 'tab3', value: 'tab3' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		orientation,
		selectOnMove,
		initialTabName,
		activeClass,
		selectedTab,
		disableThird,
		useIcons,
	} = attributes;

	// Every prop exercised by this block, shared by the inspector and canvas.
	const tabPanelProps = {
		orientation,
		selectOnMove,
		initialTabName,
		activeClass: activeClass || undefined,
		onSelect: ( tabName ) => setAttributes( { selectedTab: tabName } ),
		tabs: [
			{
				name: 'tab1',
				title: 'Tab 1',
				className: 'ajs-tab-one',
				icon: useIcons ? cog : undefined,
			},
			{ name: 'tab2', title: 'Tab 2', className: 'ajs-tab-two' },
			{
				name: 'tab3',
				title: 'Tab 3',
				disabled: disableThird,
				icon: useIcons ? starFilled : undefined,
			},
		],
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'TabPanel', 'component-kitchen-sink' ) }>
					<SelectControl
						label="orientation"
						value={ orientation }
						options={ ORIENTATION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { orientation: next } )
						}
					/>
					<ToggleControl
						label="selectOnMove"
						checked={ selectOnMove }
						onChange={ ( next ) =>
							setAttributes( { selectOnMove: next } )
						}
					/>
					<SelectControl
						label="initialTabName"
						help={ __(
							'Read on mount only; reselect the block to see it.',
							'component-kitchen-sink'
						) }
						value={ initialTabName }
						options={ TAB_NAME_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { initialTabName: next } )
						}
					/>
					<TextControl
						label="activeClass"
						value={ activeClass }
						onChange={ ( next ) =>
							setAttributes( { activeClass: next } )
						}
					/>
					<ToggleControl
						label="tabs[2].disabled"
						checked={ disableThird }
						onChange={ ( next ) =>
							setAttributes( { disableThird: next } )
						}
					/>
					<ToggleControl
						label="tabs[].icon"
						checked={ useIcons }
						onChange={ ( next ) =>
							setAttributes( { useIcons: next } )
						}
					/>
					<p>
						{ __(
							'Last selected tab (onSelect):',
							'component-kitchen-sink'
						) }{ ' ' }
						{ selectedTab || '-' }
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>TabPanel</h3>
				<TabPanel
					key={ `${ initialTabName }-${ orientation }` }
					{ ...tabPanelProps }
				>
					{ ( tab ) => <p>{ `Content of ${ tab.title }` }</p> }
				</TabPanel>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
