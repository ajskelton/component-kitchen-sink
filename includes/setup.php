<?php
/**
 * One-call site setup: seeds the posts, the navigation menu and the
 * rewrite rules.
 *
 * Used by `wp ajs setup` and by the WordPress Playground blueprint in
 * playground/blueprint.json, which calls ajs_site_setup() after importing
 * the test pages. Safe to run again: posts are matched by meta, an
 * existing navigation menu is only replaced while it is still the default
 * page list, and a footer part is only created when the theme's is not
 * yet customised.
 *
 * @package ajs
 */

defined( 'ABSPATH' ) || exit;

/**
 * Seeds everything the site needs and returns a one-line report.
 *
 * @param callable|null $log Receives progress lines.
 * @return string Report.
 * @throws RuntimeException When a data file is missing.
 */
function ajs_site_setup( ?callable $log = null ): string {
	$components = ( new AJS_Component_Sync( $log ) )->run();
	$blocks     = ( new AJS_Core_Block_Sync( $log ) )->run();
	$menu       = ajs_site_setup_navigation();
	$footer     = ajs_site_setup_footer();

	flush_rewrite_rules();

	return sprintf(
		'Components: %d created, %d updated. Core blocks: %d created, %d updated. Navigation menu %s. Footer part %s. Rewrite rules flushed.',
		$components['created'],
		$components['updated'],
		$blocks['created'],
		$blocks['updated'],
		$menu,
		$footer
	);
}

/**
 * Replaces the theme's demo footer with a small one that links to the archives.
 *
 * Saves a customised "footer" template part for the active theme, exactly
 * as editing it in the Site Editor would, so every template that uses the
 * footer part gets it. A footer already customised in the database is left
 * alone.
 *
 * @return string "created" or "left alone".
 */
function ajs_site_setup_footer(): string {
	$theme    = get_stylesheet();
	$existing = get_block_template( $theme . '//footer', 'wp_template_part' );

	if ( $existing && 'custom' === $existing->source ) {
		return 'left alone';
	}

	$post_id = wp_insert_post(
		array(
			'post_type'    => 'wp_template_part',
			'post_status'  => 'publish',
			'post_name'    => 'footer',
			'post_title'   => 'Footer',
			'post_excerpt' => 'Site title and links to the component and core block archives.',
			'post_content' => ajs_site_footer_content(),
		),
		true
	);

	if ( is_wp_error( $post_id ) ) {
		return 'not created (' . $post_id->get_error_message() . ')';
	}

	wp_set_object_terms( $post_id, $theme, 'wp_theme' );
	wp_set_object_terms( $post_id, 'footer', 'wp_template_part_area' );

	return 'created';
}

/**
 * The footer template part as block markup.
 *
 * @return string Block markup.
 */
function ajs_site_footer_content(): string {
	$links = array(
		esc_url( home_url( '/' ) ) => 'Home',
		esc_url( get_post_type_archive_link( AJS_COMPONENT_POST_TYPE ) ?: home_url( '/components/' ) ) => 'Components',
		esc_url( get_post_type_archive_link( AJS_CORE_BLOCK_POST_TYPE ) ?: home_url( '/core-blocks/' ) ) => 'Core Blocks',
	);

	$anchors = array();
	foreach ( $links as $url => $label ) {
		$anchors[] = '<a href="' . $url . '">' . esc_html( $label ) . '</a>';
	}
	$anchors = implode( ' &middot; ', $anchors );

	return <<<HTML
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}}},"backgroundColor":"base-2","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-2-background-color has-background" style="padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40)">
	<!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
	<div class="wp-block-group alignwide">
		<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|10"}},"layout":{"type":"flex","orientation":"vertical"}} -->
		<div class="wp-block-group">
			<!-- wp:site-title {"level":0,"fontSize":"small"} /-->
			<!-- wp:paragraph {"fontSize":"small","style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast-2"}}}},"textColor":"contrast-2"} -->
			<p class="has-contrast-2-color has-text-color has-link-color has-small-font-size">One test block for every @wordpress component, with a post per component and per core block.</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:group -->

		<!-- wp:paragraph {"fontSize":"small"} -->
		<p class="has-small-font-size">{$anchors}</p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
HTML;
}

/**
 * Creates the Primary navigation menu, or replaces a default page list.
 *
 * The theme's header Navigation block has no `ref`, so it shows the most
 * recent wp_navigation post. The menu is Home, Components, Core Blocks and
 * a Test pages submenu listing every page that uses this plugin's blocks.
 *
 * @return string "created", "updated" or "left alone".
 */
function ajs_site_setup_navigation(): string {
	$content  = ajs_site_navigation_content();
	$existing = get_posts(
		array(
			'post_type'      => 'wp_navigation',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);

	if ( empty( $existing ) ) {
		wp_insert_post(
			array(
				'post_type'    => 'wp_navigation',
				'post_status'  => 'publish',
				'post_title'   => 'Primary',
				'post_name'    => 'primary',
				'post_content' => $content,
			)
		);

		return 'created';
	}

	$menu       = $existing[0];
	$is_default = '' === trim( $menu->post_content ) || false !== strpos( $menu->post_content, 'wp:page-list' );

	if ( ! $is_default || $menu->post_content === $content ) {
		return 'left alone';
	}

	wp_update_post(
		array(
			'ID'           => $menu->ID,
			'post_title'   => 'Primary',
			'post_content' => $content,
		)
	);

	return 'updated';
}

/**
 * The navigation menu as block markup.
 *
 * @return string Navigation link blocks.
 */
function ajs_site_navigation_content(): string {
	$links = array(
		array(
			'label'          => 'Home',
			'url'            => home_url( '/' ),
			'kind'           => 'custom',
			'isTopLevelLink' => true,
		),
		array(
			'label'          => 'Components',
			'type'           => AJS_COMPONENT_POST_TYPE,
			'url'            => get_post_type_archive_link( AJS_COMPONENT_POST_TYPE ) ?: home_url( '/components/' ),
			'kind'           => 'post-type-archive',
			'isTopLevelLink' => true,
		),
		array(
			'label'          => 'Core Blocks',
			'type'           => AJS_CORE_BLOCK_POST_TYPE,
			'url'            => get_post_type_archive_link( AJS_CORE_BLOCK_POST_TYPE ) ?: home_url( '/core-blocks/' ),
			'kind'           => 'post-type-archive',
			'isTopLevelLink' => true,
		),
	);

	$blocks = array();

	foreach ( $links as $link ) {
		$blocks[] = '<!-- wp:navigation-link ' . wp_json_encode( $link ) . ' /-->';
	}

	$pages = array_filter(
		get_pages( array( 'post_status' => 'publish' ) ),
		static function ( WP_Post $page ): bool {
			return false !== strpos( $page->post_content, '<!-- wp:ajs/' );
		}
	);

	if ( $pages ) {
		usort(
			$pages,
			static function ( WP_Post $a, WP_Post $b ): int {
				return strcasecmp( $a->post_title, $b->post_title );
			}
		);

		$first    = reset( $pages );
		$blocks[] = '<!-- wp:navigation-submenu ' . wp_json_encode(
			array(
				'label'          => 'Test pages',
				'url'            => get_permalink( $first ),
				'kind'           => 'custom',
				'isTopLevelItem' => true,
			)
		) . ' -->';

		foreach ( $pages as $page ) {
			$blocks[] = '<!-- wp:navigation-link ' . wp_json_encode(
				array(
					'label' => preg_replace( '/^Kitchen Sink:\s*/', '', $page->post_title ),
					'type'  => 'page',
					'id'    => (int) $page->ID,
					'url'   => get_permalink( $page ),
					'kind'  => 'post-type',
				)
			) . ' /-->';
		}

		$blocks[] = '<!-- /wp:navigation-submenu -->';
	}

	return implode( "\n", $blocks );
}
