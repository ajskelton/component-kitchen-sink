<?php
/**
 * Block templates for the Component post type, and its archive query.
 *
 * The templates are registered from the plugin (WordPress 6.7+), so any
 * block theme gets the same single page and archive grid. They reuse the
 * active theme's header and footer template parts. The archive shows 24
 * components per page, ordered by export name without its prefix.
 *
 * @package ajs
 */

defined( 'ABSPATH' ) || exit;

/** Components shown per archive page. */
const AJS_COMPONENT_ARCHIVE_PER_PAGE = 24;

/**
 * Registers the single and archive templates.
 */
function ajs_component_register_templates(): void {
	if ( ! function_exists( 'register_block_template' ) ) {
		return;
	}

	register_block_template(
		'component-kitchen-sink//single-' . AJS_COMPONENT_POST_TYPE,
		array(
			'title'       => __( 'Single Component', 'component-kitchen-sink' ),
			'description' => __( 'One component: its usage, history and test block.', 'component-kitchen-sink' ),
			'post_types'  => array( AJS_COMPONENT_POST_TYPE ),
			'content'     => ajs_component_single_template(),
		)
	);

	$archive = ajs_component_archive_template();

	register_block_template(
		'component-kitchen-sink//archive-' . AJS_COMPONENT_POST_TYPE,
		array(
			'title'       => __( 'Component Archive', 'component-kitchen-sink' ),
			'description' => __( 'All components in a grid, 24 per page.', 'component-kitchen-sink' ),
			'content'     => $archive,
		)
	);

	foreach ( array( AJS_COMPONENT_TAX_PACKAGE, AJS_COMPONENT_TAX_KIND ) as $taxonomy ) {
		register_block_template(
			'component-kitchen-sink//taxonomy-' . $taxonomy,
			array(
				'title'       => __( 'Component Archive', 'component-kitchen-sink' ) . ' (' . $taxonomy . ')',
				'description' => __( 'Components filtered by package or kind.', 'component-kitchen-sink' ),
				'content'     => $archive,
			)
		);
	}
}

add_action( 'init', 'ajs_component_register_templates' );

/**
 * Sets the archive page size and title order for the component archives.
 *
 * @param WP_Query $query The query being run.
 */
function ajs_component_archive_query( WP_Query $query ): void {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}

	if (
		! $query->is_post_type_archive( AJS_COMPONENT_POST_TYPE )
		&& ! $query->is_tax( array( AJS_COMPONENT_TAX_PACKAGE, AJS_COMPONENT_TAX_KIND ) )
	) {
		return;
	}

	$query->set( 'posts_per_page', AJS_COMPONENT_ARCHIVE_PER_PAGE );
	$query->set( 'meta_key', AJS_COMPONENT_META_SORT ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- 309 posts, indexed meta.
	$query->set( 'orderby', array( 'meta_value' => 'ASC', 'title' => 'ASC' ) );
}

add_action( 'pre_get_posts', 'ajs_component_archive_query' );

/**
 * The link back to the archive, as block markup.
 *
 * @return string Paragraph block.
 */
function ajs_component_archive_link_block(): string {
	return sprintf(
		'<!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size"><a href="%1$s">&larr; %2$s</a></p><!-- /wp:paragraph -->',
		esc_url( get_post_type_archive_link( AJS_COMPONENT_POST_TYPE ) ?: home_url( '/components/' ) ),
		esc_html__( 'All components', 'component-kitchen-sink' )
	);
}

/**
 * The single component template.
 *
 * @return string Block markup.
 */
function ajs_component_single_template(): string {
	$back = ajs_component_archive_link_block();

	return <<<HTML
<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","align":"full","layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull">
	<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50"},"margin":{"bottom":"var:preset|spacing|40"},"blockGap":"var:preset|spacing|20"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
	<div class="wp-block-group" style="margin-bottom:var(--wp--preset--spacing--40);padding-top:var(--wp--preset--spacing--50)">
		{$back}

		<!-- wp:post-title {"level":1,"fontSize":"x-large"} /-->

		<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->
		<div class="wp-block-group">
			<!-- wp:post-terms {"term":"ajs_package","className":"is-style-pill"} /-->
			<!-- wp:post-terms {"term":"ajs_component_kind","className":"is-style-pill"} /-->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->

	<!-- wp:post-content {"lock":{"move":false,"remove":true},"align":"full","layout":{"type":"constrained"}} /-->

	<!-- wp:group {"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"},"padding":{"bottom":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
	<div class="wp-block-group" style="margin-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)">
		<!-- wp:separator {"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}},"backgroundColor":"contrast-3","className":"is-style-wide"} -->
		<hr class="wp-block-separator has-text-color has-contrast-3-color has-alpha-channel-opacity has-contrast-3-background-color has-background is-style-wide" style="margin-bottom:var(--wp--preset--spacing--40)"/>
		<!-- /wp:separator -->

		<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
		<div class="wp-block-group">
			<!-- wp:post-navigation-link {"type":"previous","showTitle":true,"linkLabel":true,"arrow":"arrow"} /-->
			<!-- wp:post-navigation-link {"showTitle":true,"linkLabel":true,"arrow":"arrow"} /-->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->
HTML;
}

/**
 * The archive template, shared by the post type archive and both taxonomies.
 *
 * @return string Block markup.
 */
function ajs_component_archive_template(): string {
	$per_page = AJS_COMPONENT_ARCHIVE_PER_PAGE;
	$package  = esc_html__( 'Package', 'component-kitchen-sink' );
	$kind     = esc_html__( 'Kind', 'component-kitchen-sink' );
	$all      = esc_html__( 'All components', 'component-kitchen-sink' );
	$archive  = esc_url( get_post_type_archive_link( AJS_COMPONENT_POST_TYPE ) ?: home_url( '/components/' ) );

	return <<<HTML
<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","align":"full","layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull">
	<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|50"},"blockGap":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
	<div class="wp-block-group alignwide" style="padding-top:var(--wp--preset--spacing--50)">
		<!-- wp:query-title {"type":"archive","showPrefix":false,"align":"wide","style":{"typography":{"lineHeight":"1"}}} /-->

		<!-- wp:term-description {"align":"wide"} /-->

		<!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"wrap","verticalAlignment":"top"}} -->
		<div class="wp-block-group alignwide">
			<!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size"><a href="{$archive}">{$all}</a></p><!-- /wp:paragraph -->
			<!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size"><strong>{$package}</strong></p><!-- /wp:paragraph -->
			<!-- wp:tag-cloud {"taxonomy":"ajs_package","showTagCounts":true,"smallestFontSize":"0.85rem","largestFontSize":"0.85rem"} /-->
			<!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size"><strong>{$kind}</strong></p><!-- /wp:paragraph -->
			<!-- wp:tag-cloud {"taxonomy":"ajs_component_kind","showTagCounts":true,"smallestFontSize":"0.85rem","largestFontSize":"0.85rem"} /-->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->

	<!-- wp:query {"query":{"perPage":{$per_page},"pages":0,"offset":0,"postType":"ajs_component","order":"asc","orderBy":"title","inherit":true},"align":"wide","layout":{"type":"default"}} -->
	<div class="wp-block-query alignwide">
		<!-- wp:query-no-results -->
		<!-- wp:paragraph --><p>No components found.</p><!-- /wp:paragraph -->
		<!-- /wp:query-no-results -->

		<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|50"}}},"layout":{"type":"default"}} -->
		<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--50)">
			<!-- wp:post-template {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"grid","columnCount":3}} -->
			<!-- wp:group {"className":"ajs-component-card","style":{"border":{"width":"1px","radius":"8px"},"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30","right":"var:preset|spacing|30"},"blockGap":"var:preset|spacing|10"},"dimensions":{"minHeight":"100%"}},"borderColor":"contrast-3","layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
			<div class="wp-block-group ajs-component-card has-border-color has-contrast-3-border-color" style="border-width:1px;border-radius:8px;min-height:100%;padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
				<!-- wp:post-title {"isLink":true,"level":2,"fontSize":"medium"} /-->
				<!-- wp:ajs/component-info {"variant":"summary"} /-->
			</div>
			<!-- /wp:group -->
			<!-- /wp:post-template -->

			<!-- wp:spacer {"height":"var:preset|spacing|40"} -->
			<div style="height:var(--wp--preset--spacing--40)" aria-hidden="true" class="wp-block-spacer"></div>
			<!-- /wp:spacer -->

			<!-- wp:query-pagination {"paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"space-between"}} -->
			<!-- wp:query-pagination-previous /-->
			<!-- wp:query-pagination-numbers /-->
			<!-- wp:query-pagination-next /-->
			<!-- /wp:query-pagination -->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:query -->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->
HTML;
}
