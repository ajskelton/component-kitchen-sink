<?php
/**
 * Links every test block to the Component post it exercises.
 *
 * On the front end the block's heading becomes a link to the post. In the
 * editor, assets/component-links.js adds a "Component post" panel to the
 * inspector of every ajs/* test block, using the map printed by
 * ajs_component_links_data(). Neither needs a change to the blocks.
 *
 * @package ajs
 */

defined( 'ABSPATH' ) || exit;

/**
 * Test block name => Component post, for every block that has a post.
 *
 * Built from data/inventory.json, so a block covering several exports (an
 * alias and its stable name) links to the post of the row that has one.
 *
 * @return array<string, array{post_id: int, title: string, key: string}> Keyed by block name.
 */
function ajs_component_links_map(): array {
	static $map = null;

	if ( null !== $map ) {
		return $map;
	}

	$map = array();
	$ids = ajs_post_ids_by_meta( AJS_COMPONENT_POST_TYPE, '', array( AJS_COMPONENT_META_PACKAGE, AJS_COMPONENT_META_EXPORT ) );

	foreach ( ajs_component_inventory() as $key => $row ) {
		if ( empty( $row['blockName'] ) || isset( $map[ $row['blockName'] ] ) || ! isset( $ids[ $key ] ) ) {
			continue;
		}

		$map[ $row['blockName'] ] = array(
			'post_id' => $ids[ $key ],
			'title'   => (string) ( $row['blockTitle'] ?: $row['name'] ),
			'key'     => $key,
		);
	}

	return $map;
}

/**
 * The map the editor script reads: block name => urls and title.
 *
 * @return array<string, array{title: string, url: string, editUrl: string}> Keyed by block name.
 */
function ajs_component_links_data(): array {
	$data = array();

	foreach ( ajs_component_links_map() as $block_name => $link ) {
		$data[ $block_name ] = array(
			'title'   => $link['title'],
			'url'     => (string) get_permalink( $link['post_id'] ),
			'editUrl' => current_user_can( 'edit_post', $link['post_id'] ) ? (string) get_edit_post_link( $link['post_id'], 'raw' ) : '',
		);
	}

	return $data;
}

/**
 * Turns a test block's heading into a link to its Component post.
 *
 * Skipped on the Component post itself, where the block already sits under
 * the post's own usage and history.
 *
 * @param string $content Rendered block HTML.
 * @param array  $block   Parsed block, with blockName.
 * @return string Block HTML with a linked heading.
 */
function ajs_component_link_block_heading( string $content, array $block ): string {
	$name = (string) ( $block['blockName'] ?? '' );

	if ( ! str_starts_with( $name, 'ajs/' ) ) {
		return $content;
	}

	$link = ajs_component_links_map()[ $name ] ?? null;

	if ( null === $link || get_queried_object_id() === $link['post_id'] ) {
		return $content;
	}

	$url   = esc_url( get_permalink( $link['post_id'] ) );
	$title = esc_attr__( 'Usage, history and test block for this component', 'component-kitchen-sink' );

	// Only the first heading: the block's own title printed by render.php.
	$linked = (string) preg_replace_callback(
		'/<h3([^>]*)>(.*?)<\/h3>/s',
		static function ( array $m ) use ( $url, $title ): string {
			return '<h3' . $m[1] . '><a class="ajs-component-link" href="' . $url . '" title="' . $title . '">' . $m[2] . '</a></h3>';
		},
		$content,
		1,
		$count
	);

	if ( $count > 0 ) {
		return $linked;
	}

	// No heading (the block renders a bare wrapper): add a link before the wrapper closes.
	$anchor = ' <a class="ajs-component-link" href="' . $url . '" title="' . $title . '">' . esc_html( $link['title'] ) . ' &rarr;</a>';

	return (string) preg_replace( '/(<\/(?:div|p)>\s*)$/', $anchor . '$1', $content, 1 );
}

add_filter( 'render_block', 'ajs_component_link_block_heading', 10, 2 );

/**
 * Loads the editor script that adds the "Component post" inspector panel.
 */
function ajs_component_links_editor_assets(): void {
	$path = dirname( __DIR__ ) . '/assets/component-links.js';

	if ( ! is_readable( $path ) ) {
		return;
	}

	wp_enqueue_script(
		'ajs-component-links',
		plugins_url( 'assets/component-links.js', dirname( __DIR__ ) . '/plugin.php' ),
		array( 'wp-hooks', 'wp-compose', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
		(string) filemtime( $path ),
		true
	);

	wp_add_inline_script(
		'ajs-component-links',
		'window.ajsComponentLinks = ' . wp_json_encode( ajs_component_links_data() ) . ';',
		'before'
	);
}

add_action( 'enqueue_block_editor_assets', 'ajs_component_links_editor_assets' );
