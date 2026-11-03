/**
 * Adds a "Component post" panel to the inspector of every ajs/* test block,
 * linking to the Component post that documents the block's component.
 *
 * Loaded by includes/component-links.php, which prints the block name =>
 * post map as window.ajsComponentLinks. Written against the wp.* globals so
 * it needs no build step.
 *
 * @param {Object} wp The wp globals.
 */
( function ( wp ) {
	const addFilter = wp.hooks.addFilter;
	const createHigherOrderComponent = wp.compose.createHigherOrderComponent;
	const el = wp.element.createElement;
	const Fragment = wp.element.Fragment;
	const InspectorControls = wp.blockEditor.InspectorControls;
	const PanelBody = wp.components.PanelBody;
	const Button = wp.components.Button;
	const __ = wp.i18n.__;
	const links = window.ajsComponentLinks || {};

	const withComponentLink = createHigherOrderComponent( function (
		BlockEdit
	) {
		return function ( props ) {
			const link = links[ props.name ];

			if ( ! link ) {
				return el( BlockEdit, props );
			}

			const buttons = [
				el(
					Button,
					{
						key: 'view',
						href: link.url,
						target: '_blank',
						rel: 'noreferrer',
						variant: 'secondary',
						__next40pxDefaultSize: true,
					},
					__( 'View post', 'component-kitchen-sink' )
				),
			];

			if ( link.editUrl ) {
				buttons.push(
					el(
						Button,
						{
							key: 'edit',
							href: link.editUrl,
							variant: 'tertiary',
							__next40pxDefaultSize: true,
						},
						__( 'Edit post', 'component-kitchen-sink' )
					)
				);
			}

			return el(
				Fragment,
				null,
				el( BlockEdit, props ),
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{
							title: __(
								'Component post',
								'component-kitchen-sink'
							),
							initialOpen: true,
						},
						el(
							'p',
							{ className: 'ajs-component-link__intro' },
							__(
								'Usage by core blocks, version history and this test block, on one page.',
								'component-kitchen-sink'
							)
						),
						el(
							'div',
							{
								style: {
									display: 'flex',
									gap: '8px',
									flexWrap: 'wrap',
								},
							},
							buttons
						)
					)
				)
			);
		};
	}, 'withAjsComponentLink' );

	addFilter( 'editor.BlockEdit', 'ajs/component-links', withComponentLink );
} )( window.wp );
