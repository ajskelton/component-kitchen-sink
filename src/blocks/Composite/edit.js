import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useContext } from '@wordpress/element';
import {
	Button,
	Composite,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import './editor.scss';

const LAYOUT_OPTIONS = [
	{ label: 'Composite.Group + GroupLabel', value: 'group' },
	{ label: 'Composite.Row (two-dimensional)', value: 'grid' },
	{ label: 'Composite.Hover', value: 'hover' },
	{ label: 'Composite.Typeahead', value: 'typeahead' },
];

const ORIENTATION_OPTIONS = [
	{ label: 'both', value: 'both' },
	{ label: 'horizontal', value: 'horizontal' },
	{ label: 'vertical', value: 'vertical' },
];

const LOOP_OPTIONS = [ 'false', 'true', 'horizontal', 'vertical', 'both' ].map(
	( value ) => ( { label: value, value } )
);

const WRAP_OPTIONS = [ 'false', 'true', 'horizontal', 'vertical' ].map(
	( value ) => ( { label: value, value } )
);

const FRUIT = [ 'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig' ];

// Maps a stored 'false' | 'true' | 'horizontal' ... value to the prop value.
const toFlag = ( value ) => {
	if ( value === 'true' ) {
		return true;
	}
	return value === 'false' ? false : value;
};

/**
 * Reads the store through Composite.Context to show the active item id.
 */
function ActiveIdReader() {
	const { store } = useContext( Composite.Context );
	const activeId = store?.useState( 'activeId' );
	return (
		<p>
			<code>activeId: { String( activeId ) }</code>
		</p>
	);
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		layout,
		orientation,
		focusLoop,
		focusWrap,
		focusShift,
		virtualFocus,
		rtl,
		disabled,
		activeKey,
		lastPressed,
	} = attributes;

	// Item ids are scoped by clientId; only the suffix is stored.
	const idFor = ( key ) => `${ clientId }-${ key }`;
	const prefix = `${ clientId }-`;

	const compositeProps = {
		'aria-label': __( 'Composite demo', 'component-kitchen-sink' ),
		orientation,
		focusLoop: toFlag( focusLoop ),
		focusWrap: toFlag( focusWrap ),
		focusShift,
		virtualFocus,
		rtl,
		disabled,
		activeId: activeKey ? idFor( activeKey ) : undefined,
		setActiveId: ( next ) => {
			const nextKey =
				typeof next === 'string' && next.startsWith( prefix )
					? next.slice( prefix.length )
					: '';
			// Skip no-op writes so merely rendering never dirties the post.
			if ( nextKey !== activeKey ) {
				setAttributes( { activeKey: nextKey } );
			}
		},
		render: layout === 'typeahead' ? <Composite.Typeahead /> : undefined,
	};

	const itemButton = (
		<Button variant="secondary" size="compact" accessibleWhenDisabled />
	);

	const renderItem = ( name, index ) => {
		const key = `item-${ index }`;
		const common = {
			id: idFor( key ),
			onClick: () => setAttributes( { lastPressed: name } ),
		};
		if ( layout === 'hover' ) {
			return (
				<Composite.Hover
					key={ key }
					render={ <Composite.Item render={ itemButton } /> }
					{ ...common }
				>
					{ name }
				</Composite.Hover>
			);
		}
		return (
			<Composite.Item key={ key } render={ itemButton } { ...common }>
				{ name }
			</Composite.Item>
		);
	};

	const renderContent = () => {
		if ( layout === 'grid' ) {
			return [ FRUIT.slice( 0, 3 ), FRUIT.slice( 3 ) ].map(
				( row, rowIndex ) => (
					<Composite.Row key={ rowIndex }>
						{ row.map( ( name, index ) =>
							renderItem( name, rowIndex * 3 + index )
						) }
					</Composite.Row>
				)
			);
		}
		if ( layout === 'group' ) {
			return (
				<Composite.Group>
					<Composite.GroupLabel>
						{ __( 'Fruit', 'component-kitchen-sink' ) }
					</Composite.GroupLabel>
					{ FRUIT.slice( 0, 3 ).map( renderItem ) }
				</Composite.Group>
			);
		}
		return FRUIT.slice( 0, 3 ).map( renderItem );
	};

	const renderComposite = () => (
		<Composite { ...compositeProps }>
			{ renderContent() }
			<ActiveIdReader />
		</Composite>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Composite', 'component-kitchen-sink' ) }
				>
					<SelectControl
						label="demo (sub-component)"
						value={ layout }
						options={ LAYOUT_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { layout: next } )
						}
					/>
					<SelectControl
						label="orientation"
						value={ orientation }
						options={ ORIENTATION_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { orientation: next } )
						}
					/>
					<SelectControl
						label="focusLoop"
						value={ focusLoop }
						options={ LOOP_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { focusLoop: next } )
						}
					/>
					<SelectControl
						label="focusWrap"
						value={ focusWrap }
						options={ WRAP_OPTIONS }
						onChange={ ( next ) =>
							setAttributes( { focusWrap: next } )
						}
					/>
					<ToggleControl
						label="focusShift"
						checked={ focusShift }
						onChange={ ( next ) =>
							setAttributes( { focusShift: next } )
						}
					/>
					<ToggleControl
						label="virtualFocus"
						checked={ virtualFocus }
						onChange={ ( next ) =>
							setAttributes( { virtualFocus: next } )
						}
					/>
					<ToggleControl
						label="rtl"
						checked={ rtl }
						onChange={ ( next ) => setAttributes( { rtl: next } ) }
					/>
					<ToggleControl
						label="disabled"
						checked={ disabled }
						onChange={ ( next ) =>
							setAttributes( { disabled: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<h3>Composite</h3>
				{ renderComposite() }
				<p>
					{ __( 'Last pressed:', 'component-kitchen-sink' ) }{ ' ' }
					<code>{ lastPressed || '-' }</code>
				</p>
				<pre>{ JSON.stringify( attributes, null, 2 ) }</pre>
			</div>
		</>
	);
}
