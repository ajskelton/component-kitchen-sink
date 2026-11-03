<?php
/**
 * Search, filtering and ordering for the Component and Core Block archives.
 *
 * The ajs/archive-tools block renders a GET form on the archive templates.
 * Its fields map to query vars handled here: `ajs_q` searches (kept apart
 * from WordPress's `s` so the archive template, not the search template,
 * renders the results), `ajs_orderby` picks one of the orderings below, and
 * the taxonomy fields use the taxonomies' own query vars. Orderings other
 * than name rely on meta written by `wp ajs components sync` and
 * `wp ajs core-blocks sync`: ajs_sort_name, ajs_added_date,
 * ajs_usage_count and ajs_component_count.
 *
 * @package ajs
 */

defined( 'ABSPATH' ) || exit;

/** Query var carrying the archive search text. */
const AJS_ARCHIVE_QUERY_SEARCH = 'ajs_q';

/** Query var carrying the archive ordering key. */
const AJS_ARCHIVE_QUERY_ORDER = 'ajs_orderby';

/** Meta key: the ISO date a component was first exported, for ordering. */
const AJS_COMPONENT_META_ADDED = 'ajs_added_date';

/** Meta key: how many core blocks import a component. */
const AJS_COMPONENT_META_USAGE = 'ajs_usage_count';

/** Meta key: how many components a core block imports. */
const AJS_CORE_BLOCK_META_COMPONENTS = 'ajs_component_count';

/** Posts shown per archive page. */
const AJS_COMPONENT_ARCHIVE_PER_PAGE = 24;

/**
 * Registers the search and ordering query vars.
 *
 * @param string[] $vars Public query vars.
 * @return string[] Query vars including ours.
 */
function ajs_archive_query_vars( array $vars ): array {
	$vars[] = AJS_ARCHIVE_QUERY_SEARCH;
	$vars[] = AJS_ARCHIVE_QUERY_ORDER;

	return $vars;
}

add_filter( 'query_vars', 'ajs_archive_query_vars' );

/**
 * The orderings available for a post type.
 *
 * Each ordering is a label plus the WP_Query arguments that produce it.
 * The first one is the default.
 *
 * @param string $post_type Post type.
 * @return array<string, array{label: string, args: array}> Ordering key => definition.
 */
function ajs_archive_orderings( string $post_type ): array {
	if ( AJS_COMPONENT_POST_TYPE === $post_type ) {
		return array(
			'name'       => array(
				'label' => __( 'Name, A to Z', 'component-kitchen-sink' ),
				'args'  => array(
					'meta_key' => AJS_COMPONENT_META_SORT,
					'orderby'  => array(
						'meta_value' => 'ASC',
						'title'      => 'ASC',
					),
				),
			),
			'newest'     => array(
				'label' => __( 'Newest first', 'component-kitchen-sink' ),
				'args'  => array(
					'meta_key' => AJS_COMPONENT_META_ADDED,
					'orderby'  => array(
						'meta_value' => 'DESC',
						'title'      => 'ASC',
					),
				),
			),
			'oldest'     => array(
				'label' => __( 'Oldest first', 'component-kitchen-sink' ),
				'args'  => array(
					'meta_key' => AJS_COMPONENT_META_ADDED,
					'orderby'  => array(
						'meta_value' => 'ASC',
						'title'      => 'ASC',
					),
				),
			),
			'most-used'  => array(
				'label' => __( 'Most used by core blocks', 'component-kitchen-sink' ),
				'args'  => array(
					'meta_key' => AJS_COMPONENT_META_USAGE,
					'orderby'  => array(
						'meta_value_num' => 'DESC',
						'title'          => 'ASC',
					),
				),
			),
			'least-used' => array(
				'label' => __( 'Least used by core blocks', 'component-kitchen-sink' ),
				'args'  => array(
					'meta_key' => AJS_COMPONENT_META_USAGE,
					'orderby'  => array(
						'meta_value_num' => 'ASC',
						'title'          => 'ASC',
					),
				),
			),
		);
	}

	return array(
		'name'            => array(
			'label' => __( 'Name, A to Z', 'component-kitchen-sink' ),
			'args'  => array(
				'orderby' => 'title',
				'order'   => 'ASC',
			),
		),
		'most-components' => array(
			'label' => __( 'Most components used', 'component-kitchen-sink' ),
			'args'  => array(
				'meta_key' => AJS_CORE_BLOCK_META_COMPONENTS,
				'orderby'  => array(
					'meta_value_num' => 'DESC',
					'title'          => 'ASC',
				),
			),
		),
		'fewest-components' => array(
			'label' => __( 'Fewest components used', 'component-kitchen-sink' ),
			'args'  => array(
				'meta_key' => AJS_CORE_BLOCK_META_COMPONENTS,
				'orderby'  => array(
					'meta_value_num' => 'ASC',
					'title'          => 'ASC',
				),
			),
		),
	);
}

/**
 * The post type a query is an archive of, or null for other queries.
 *
 * @param WP_Query $query The query.
 * @return string|null ajs_component, ajs_core_block or null.
 */
function ajs_archive_post_type( WP_Query $query ): ?string {
	if ( $query->is_post_type_archive( AJS_COMPONENT_POST_TYPE ) || $query->is_tax( array( AJS_COMPONENT_TAX_PACKAGE, AJS_COMPONENT_TAX_KIND ) ) ) {
		return AJS_COMPONENT_POST_TYPE;
	}

	if ( $query->is_post_type_archive( AJS_CORE_BLOCK_POST_TYPE ) || $query->is_tax( AJS_CORE_BLOCK_TAX_CATEGORY ) ) {
		return AJS_CORE_BLOCK_POST_TYPE;
	}

	return null;
}

/**
 * The ordering key in effect for a query, falling back to the default.
 *
 * @param string   $post_type Post type.
 * @param WP_Query $query     The query.
 * @return string Ordering key.
 */
function ajs_archive_current_ordering( string $post_type, WP_Query $query ): string {
	$orderings = ajs_archive_orderings( $post_type );
	$requested = sanitize_key( (string) $query->get( AJS_ARCHIVE_QUERY_ORDER ) );

	return isset( $orderings[ $requested ] ) ? $requested : (string) array_key_first( $orderings );
}

/**
 * Applies page size, search and ordering to the archive main queries.
 *
 * @param WP_Query $query The query being run.
 */
function ajs_archive_pre_get_posts( WP_Query $query ): void {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}

	$post_type = ajs_archive_post_type( $query );

	if ( null === $post_type ) {
		return;
	}

	$query->set( 'posts_per_page', AJS_COMPONENT_ARCHIVE_PER_PAGE );

	$search = trim( (string) $query->get( AJS_ARCHIVE_QUERY_SEARCH ) );
	if ( '' !== $search ) {
		$query->set( 's', $search );
	}

	$ordering = ajs_archive_orderings( $post_type )[ ajs_archive_current_ordering( $post_type, $query ) ];

	foreach ( $ordering['args'] as $key => $value ) {
		$query->set( $key, $value ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- A few hundred posts, indexed meta.
	}
}

add_action( 'pre_get_posts', 'ajs_archive_pre_get_posts' );
