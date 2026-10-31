<?php
/**
 * Plugin Name:       Component Kitchen Sink
 * Description:       Exploring all the component tooling available for blocks
 * Requires at least: 7.0
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            Anthony Skelton
 * Website:           https://www.anthonyskelton.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       component-kitchen-sink
 *
 * @package           ajs
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers every block found in build/blocks/<Name>/block.json.
 *
 * Each block directory is registered from its block.json metadata, which also
 * registers the block's scripts and styles so they can be enqueued in the
 * editor and on the front end. Directories are registered in name order.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function ajs_component_kitchen_sink_block_init(): void {
	$manifests = glob( __DIR__ . '/build/blocks/*/block.json' );

	if ( empty( $manifests ) ) {
		return;
	}

	sort( $manifests, SORT_STRING | SORT_FLAG_CASE );

	foreach ( $manifests as $manifest ) {
		register_block_type( dirname( $manifest ) );
	}
}

add_action( 'init', 'ajs_component_kitchen_sink_block_init' );

/**
 * Adds the "Component Kitchen Sink" category that every test block uses.
 *
 * @param array[] $categories Registered block categories.
 * @return array[] Block categories including ajs-kitchen-sink.
 */
function ajs_component_kitchen_sink_block_categories( array $categories ): array {
	foreach ( $categories as $category ) {
		if ( isset( $category['slug'] ) && 'ajs-kitchen-sink' === $category['slug'] ) {
			return $categories;
		}
	}

	$categories[] = array(
		'slug'  => 'ajs-kitchen-sink',
		'title' => __( 'Component Kitchen Sink', 'component-kitchen-sink' ),
		'icon'  => null,
	);

	return $categories;
}

add_filter( 'block_categories_all', 'ajs_component_kitchen_sink_block_categories' );
