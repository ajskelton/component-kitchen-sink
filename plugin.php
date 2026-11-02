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

require_once __DIR__ . '/includes/data.php';
require_once __DIR__ . '/includes/post-type.php';

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once __DIR__ . '/includes/cli.php';
}

register_activation_hook( __FILE__, 'ajs_component_flush_rewrites' );

/** Handle of the stylesheet combining every block's editor.scss output. */
const AJS_COMPONENT_KITCHEN_SINK_EDITOR_STYLE = 'ajs-component-kitchen-sink-editor';

/** Handle of the stylesheet combining every block's style.scss output. */
const AJS_COMPONENT_KITCHEN_SINK_STYLE = 'ajs-component-kitchen-sink-style';

/**
 * Registers the two shared block stylesheets written by scripts/combine-styles.mjs.
 *
 * With 300+ blocks, one editor and one front-end stylesheet per block meant
 * two requests per block on every editor load, and every block-preview iframe
 * requested the whole editor list again, which exhausted the browser's
 * request budget (ERR_INSUFFICIENT_RESOURCES). The build concatenates the
 * per-block files into build/editor.css and build/style.css instead, and
 * ajs_component_kitchen_sink_use_shared_styles() points each block at them.
 *
 * A handle is only registered when its combined file exists, so a build that
 * skipped the script (for example `npm start`) falls back to per-block files.
 *
 * @return string[] Field name => registered shared handle.
 */
function ajs_component_kitchen_sink_register_shared_styles(): array {
	$shared = array(
		'editorStyle' => array( AJS_COMPONENT_KITCHEN_SINK_EDITOR_STYLE, 'editor.css' ),
		'style'       => array( AJS_COMPONENT_KITCHEN_SINK_STYLE, 'style.css' ),
	);
	$handles = array();

	foreach ( $shared as $field => list( $handle, $file ) ) {
		$path = __DIR__ . '/build/' . $file;

		if ( ! is_readable( $path ) ) {
			continue;
		}

		wp_register_style(
			$handle,
			plugins_url( 'build/' . $file, __FILE__ ),
			array(),
			(string) filemtime( $path )
		);
		wp_style_add_data( $handle, 'path', $path );

		if ( is_readable( str_replace( '.css', '-rtl.css', $path ) ) ) {
			wp_style_add_data( $handle, 'rtl', 'replace' );
		}

		$handles[ $field ] = $handle;
	}

	return $handles;
}

/**
 * Swaps a block's per-file editorStyle and style for the shared handles.
 *
 * Only blocks registered from this plugin's build/blocks directory are
 * touched, and only for fields whose shared stylesheet was registered. The
 * block.json files keep their file: entries so scripts/inventory.mjs and the
 * block contract in docs/BLOCK-TEMPLATE.md are unchanged.
 *
 * @param array $metadata Block metadata read from block.json, with its path in 'file'.
 * @return array Metadata with shared style handles where available.
 */
function ajs_component_kitchen_sink_use_shared_styles( array $metadata ): array {
	static $blocks_dir = null;
	static $handles    = null;

	if ( null === $blocks_dir ) {
		$blocks_dir = wp_normalize_path( realpath( __DIR__ . '/build/blocks' ) ) . '/';
		$handles    = ajs_component_kitchen_sink_register_shared_styles();
	}

	if ( empty( $metadata['file'] ) || ! str_starts_with( $metadata['file'], $blocks_dir ) ) {
		return $metadata;
	}

	foreach ( $handles as $field => $handle ) {
		$metadata[ $field ] = $handle;
	}

	return $metadata;
}

/**
 * Registers every block found in build/blocks/<Name>/block.json.
 *
 * Each block directory is registered from its block.json metadata, which also
 * registers the block's scripts and styles so they can be enqueued in the
 * editor and on the front end. Directories are registered in name order.
 * Styles come from the shared stylesheets, see
 * ajs_component_kitchen_sink_register_shared_styles().
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function ajs_component_kitchen_sink_block_init(): void {
	$manifests = glob( __DIR__ . '/build/blocks/*/block.json' );

	if ( empty( $manifests ) ) {
		return;
	}

	sort( $manifests, SORT_STRING | SORT_FLAG_CASE );

	add_filter( 'block_type_metadata', 'ajs_component_kitchen_sink_use_shared_styles' );

	foreach ( $manifests as $manifest ) {
		register_block_type( dirname( $manifest ) );
	}

	remove_filter( 'block_type_metadata', 'ajs_component_kitchen_sink_use_shared_styles' );
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
