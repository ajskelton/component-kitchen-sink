<?php
/**
 * One-call site setup: seeds the posts, the navigation menu and the
 * rewrite rules.
 *
 * Used by `wp ajs setup` and by the WordPress Playground blueprint in
 * playground/blueprint.json, which calls ajs_site_setup() after importing
 * the test pages. Safe to run again: posts are matched by meta, and an
 * existing navigation menu is only replaced while it is still the default
 * page list.
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

	flush_rewrite_rules();

	return sprintf(
		'Components: %d created, %d updated. Core blocks: %d created, %d updated. Navigation menu %s. Rewrite rules flushed.',
		$components['created'],
		$components['updated'],
		$blocks['created'],
		$blocks['updated'],
		$menu
	);
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
