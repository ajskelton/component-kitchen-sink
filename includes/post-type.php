<?php
/**
 * The "Component" post type: one post per @wordpress component.
 *
 * Each post stores only which component it describes (package and export
 * name, see includes/data.php). Its content holds the ajs/component-info
 * block, which renders usage and history from data/, followed by the
 * component's test block. Posts are created by `wp ajs components sync`
 * (includes/cli.php).
 *
 * @package ajs
 */

defined( 'ABSPATH' ) || exit;

/** Post type slug. */
const AJS_COMPONENT_POST_TYPE = 'ajs_component';

/** Taxonomy holding the package short name. */
const AJS_COMPONENT_TAX_PACKAGE = 'ajs_package';

/** Taxonomy holding the export kind: stable, experimental, unstable or hook-or-hoc. */
const AJS_COMPONENT_TAX_KIND = 'ajs_component_kind';

/**
 * Registers the post type, its taxonomies and its meta.
 */
function ajs_component_register_post_type(): void {
	// Taxonomies first, so their components/package/<term> rules outrank the post type's attachment rule.
	register_taxonomy(
		AJS_COMPONENT_TAX_PACKAGE,
		AJS_COMPONENT_POST_TYPE,
		array(
			'labels'            => array(
				'name'          => __( 'Packages', 'component-kitchen-sink' ),
				'singular_name' => __( 'Package', 'component-kitchen-sink' ),
				'all_items'     => __( 'All packages', 'component-kitchen-sink' ),
			),
			'public'            => true,
			'hierarchical'      => false,
			'show_in_rest'      => true,
			'show_admin_column' => true,
			'rewrite'           => array( 'slug' => 'components/package' ),
		)
	);

	register_taxonomy(
		AJS_COMPONENT_TAX_KIND,
		AJS_COMPONENT_POST_TYPE,
		array(
			'labels'            => array(
				'name'          => __( 'Kinds', 'component-kitchen-sink' ),
				'singular_name' => __( 'Kind', 'component-kitchen-sink' ),
				'all_items'     => __( 'All kinds', 'component-kitchen-sink' ),
			),
			'public'            => true,
			'hierarchical'      => false,
			'show_in_rest'      => true,
			'show_admin_column' => true,
			'rewrite'           => array( 'slug' => 'components/kind' ),
		)
	);

	register_post_type(
		AJS_COMPONENT_POST_TYPE,
		array(
			'labels'       => array(
				'name'               => __( 'Components', 'component-kitchen-sink' ),
				'singular_name'      => __( 'Component', 'component-kitchen-sink' ),
				'add_new_item'       => __( 'Add New Component', 'component-kitchen-sink' ),
				'edit_item'          => __( 'Edit Component', 'component-kitchen-sink' ),
				'view_item'          => __( 'View Component', 'component-kitchen-sink' ),
				'search_items'       => __( 'Search Components', 'component-kitchen-sink' ),
				'not_found'          => __( 'No components found.', 'component-kitchen-sink' ),
				'all_items'          => __( 'All Components', 'component-kitchen-sink' ),
				'archives'           => __( 'Component Archives', 'component-kitchen-sink' ),
				'item_published'     => __( 'Component published.', 'component-kitchen-sink' ),
				'item_updated'       => __( 'Component updated.', 'component-kitchen-sink' ),
				'filter_items_list'  => __( 'Filter components list', 'component-kitchen-sink' ),
				'items_list'         => __( 'Components list', 'component-kitchen-sink' ),
			),
			'description'  => __( 'One post per @wordpress/components and @wordpress/block-editor export.', 'component-kitchen-sink' ),
			'public'       => true,
			'show_in_rest' => true,
			'has_archive'  => 'components',
			'rewrite'      => array(
				'slug'       => 'components',
				'with_front' => false,
			),
			'menu_icon'    => 'dashicons-screenoptions',
			'menu_position' => 21,
			'supports'     => array( 'title', 'editor', 'excerpt', 'author', 'custom-fields', 'revisions' ),
			'template'     => array(
				array( 'ajs/component-info' ),
			),
		)
	);

	foreach ( array( AJS_COMPONENT_META_PACKAGE, AJS_COMPONENT_META_EXPORT, AJS_COMPONENT_META_SORT ) as $meta_key ) {
		register_post_meta(
			AJS_COMPONENT_POST_TYPE,
			$meta_key,
			array(
				'type'              => 'string',
				'single'            => true,
				'default'           => '',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback'     => static function (): bool {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}

add_action( 'init', 'ajs_component_register_post_type' );

/**
 * Adds Export, Added and Core blocks columns to the Components list table.
 *
 * @param string[] $columns Column id => heading.
 * @return string[] Columns with the component columns after the title.
 */
function ajs_component_admin_columns( array $columns ): array {
	$extra = array(
		'ajs_export'      => __( 'Export', 'component-kitchen-sink' ),
		'ajs_added'       => __( 'Added', 'component-kitchen-sink' ),
		'ajs_core_blocks' => __( 'Core blocks', 'component-kitchen-sink' ),
	);

	$result = array();

	foreach ( $columns as $id => $heading ) {
		$result[ $id ] = $heading;
		if ( 'title' === $id ) {
			$result += $extra;
		}
	}

	return $result + $extra;
}

add_filter( 'manage_' . AJS_COMPONENT_POST_TYPE . '_posts_columns', 'ajs_component_admin_columns' );

/**
 * Prints the component columns in the Components list table.
 *
 * @param string $column  Column id.
 * @param int    $post_id Post ID.
 */
function ajs_component_admin_column( string $column, int $post_id ): void {
	if ( ! in_array( $column, array( 'ajs_export', 'ajs_added', 'ajs_core_blocks' ), true ) ) {
		return;
	}

	$data = ajs_component_for_post( $post_id );

	if ( null === $data ) {
		echo '&mdash;';
		return;
	}

	switch ( $column ) {
		case 'ajs_export':
			echo '<code>' . esc_html( $data['name'] ) . '</code>';
			break;

		case 'ajs_added':
			$version = $data['history']['addedVersion'] ?? '';
			$wp      = $data['history']['firstWordPress'] ?? '';
			if ( '' === $version ) {
				echo '&mdash;';
				break;
			}
			echo esc_html( $version );
			if ( '' !== $wp ) {
				/* translators: %s: WordPress version. */
				echo '<br><span class="description">' . esc_html( sprintf( __( 'WordPress %s', 'component-kitchen-sink' ), $wp ) ) . '</span>';
			}
			break;

		case 'ajs_core_blocks':
			echo esc_html( (string) count( $data['blocks'] ) );
			break;
	}
}

add_action( 'manage_' . AJS_COMPONENT_POST_TYPE . '_posts_custom_column', 'ajs_component_admin_column', 10, 2 );

/**
 * Adds package and kind dropdown filters above the Components list table.
 *
 * @param string $post_type The list table's post type.
 */
function ajs_component_admin_filters( string $post_type ): void {
	if ( AJS_COMPONENT_POST_TYPE !== $post_type ) {
		return;
	}

	foreach ( array( AJS_COMPONENT_TAX_PACKAGE, AJS_COMPONENT_TAX_KIND ) as $taxonomy ) {
		$object = get_taxonomy( $taxonomy );
		if ( ! $object ) {
			continue;
		}

		wp_dropdown_categories(
			array(
				'taxonomy'        => $taxonomy,
				'name'            => $taxonomy,
				'value_field'     => 'slug',
				// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only list filter.
				'selected'        => isset( $_GET[ $taxonomy ] ) ? sanitize_key( wp_unslash( $_GET[ $taxonomy ] ) ) : '',
				'show_option_all' => $object->labels->all_items,
				'hide_empty'      => false,
				'hierarchical'    => false,
			)
		);
	}
}

add_action( 'restrict_manage_posts', 'ajs_component_admin_filters' );

/**
 * Flushes rewrite rules once so /components/ resolves.
 */
function ajs_component_flush_rewrites(): void {
	ajs_component_register_post_type();
	flush_rewrite_rules();
}
