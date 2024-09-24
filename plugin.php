<?php
/**
 * Plugin Name:       Component Kitchen Sink
 * Description:       Exploring all the component tooling available for blocks
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Anthony Skelton
 * Website:           https://www.anthonyskelton.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       component-kitchen-sink
 *
 * @package           ajs
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

function ajs_component_kitchen_sink_block_init(): void {

	$build_dir = plugin_dir_path( __FILE__ ) . 'build/blocks';

	$blocks = [
		'AlignmentMatrixControl',
	];

	foreach ( $blocks as $block ) {

		$block_location = $build_dir . '/' . $block;
		if ( ! is_dir( $block_location ) ) {
			continue;
		}
		register_block_type( $block_location );
	}
}

add_action( 'init', 'ajs_component_kitchen_sink_block_init' );
