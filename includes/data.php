<?php
/**
 * Read access to the generated component data under data/.
 *
 * The JSON files are written by the scripts in scripts/ (see
 * docs/COMPONENT-POSTS.md) and are the single source of truth for what a
 * component post shows. Posts only store the package and export name; every
 * lookup here is keyed by "<package>:<export name>", for example
 * "components:Button" or "block-editor:__experimentalLinkControl".
 *
 * @package ajs
 */

defined( 'ABSPATH' ) || exit;

/** Meta key holding the package short name (components | block-editor). */
const AJS_COMPONENT_META_PACKAGE = 'ajs_package';

/** Meta key holding the export name exactly as the package exports it. */
const AJS_COMPONENT_META_EXPORT = 'ajs_export_name';

/** Meta key holding the export name without its __experimental/__unstable prefix, lower-cased, for sorting. */
const AJS_COMPONENT_META_SORT = 'ajs_sort_name';

/**
 * Loads one data/<name>.json file once per request.
 *
 * @param string $name File name without extension: inventory, usage, history or wordpress-releases.
 * @return array|null Decoded JSON, or null when the file is missing or invalid.
 */
function ajs_component_data_file( string $name ): ?array {
	static $cache = array();

	if ( array_key_exists( $name, $cache ) ) {
		return $cache[ $name ];
	}

	$path = dirname( __DIR__ ) . '/data/' . $name . '.json';
	$data = null;

	if ( is_readable( $path ) ) {
		$decoded = json_decode( (string) file_get_contents( $path ), true );
		if ( is_array( $decoded ) ) {
			$data = $decoded;
		}
	}

	$cache[ $name ] = $data;

	return $data;
}

/**
 * Builds the lookup key for a component.
 *
 * @param string $package Package short name.
 * @param string $name    Export name.
 * @return string Key in the form "<package>:<name>".
 */
function ajs_component_key( string $package, string $name ): string {
	return $package . ':' . $name;
}

/**
 * Inventory rows keyed by component key.
 *
 * @return array<string, array> Rows from data/inventory.json.
 */
function ajs_component_inventory(): array {
	static $rows = null;

	if ( null !== $rows ) {
		return $rows;
	}

	$rows = array();

	foreach ( (array) ajs_component_data_file( 'inventory' ) as $row ) {
		if ( isset( $row['package'], $row['name'] ) ) {
			$rows[ ajs_component_key( $row['package'], $row['name'] ) ] = $row;
		}
	}

	return $rows;
}

/**
 * WordPress releases with the package versions each one shipped.
 *
 * @return array[] Ascending rows of { wordpress, components, blockEditor, blockLibrary }.
 */
function ajs_component_wordpress_releases(): array {
	return (array) ajs_component_data_file( 'wordpress-releases' );
}

/**
 * The first WordPress release that shipped at least the given package version.
 *
 * Compares major.minor only, because WordPress pins patch releases of a minor.
 *
 * @param string $package Package short name (components | block-editor).
 * @param string $version Package version, for example "26.0.0".
 * @return string|null WordPress version such as "6.5", or null when no release has it yet.
 */
function ajs_component_wordpress_for_version( string $package, string $version ): ?string {
	$field = 'block-editor' === $package ? 'blockEditor' : $package;

	foreach ( ajs_component_wordpress_releases() as $release ) {
		if ( empty( $release[ $field ] ) ) {
			continue;
		}

		if ( ajs_component_compare_minor( $release[ $field ], $version ) >= 0 ) {
			return (string) $release['wordpress'];
		}
	}

	return null;
}

/**
 * Compares two versions on major.minor only.
 *
 * @param string $a First version.
 * @param string $b Second version.
 * @return int -1, 0 or 1 as version_compare() returns.
 */
function ajs_component_compare_minor( string $a, string $b ): int {
	$trim = static function ( string $version ): string {
		$parts = explode( '.', $version );
		return implode( '.', array_slice( $parts, 0, 2 ) );
	};

	return version_compare( $trim( $a ), $trim( $b ) );
}

/**
 * Everything known about one component, merged from the data files.
 *
 * @param string $package Package short name.
 * @param string $name    Export name.
 * @return array|null Merged data, or null when the inventory has no such component.
 */
function ajs_component_data( string $package, string $name ): ?array {
	$key       = ajs_component_key( $package, $name );
	$inventory = ajs_component_inventory();

	if ( ! isset( $inventory[ $key ] ) ) {
		return null;
	}

	$usage   = ajs_component_data_file( 'usage' );
	$history = ajs_component_data_file( 'history' );

	return array(
		'key'                 => $key,
		'package'             => $package,
		'name'                => $name,
		'inventory'           => $inventory[ $key ],
		'blocks'              => $usage['components'][ $key ] ?? array(),
		'shared'              => $usage['shared'][ $key ] ?? array(),
		'blockLibraryVersion' => $usage['blockLibraryVersion'] ?? null,
		'history'             => $history['components'][ $key ] ?? null,
		'historyMeta'         => $history['packages'][ $package ] ?? null,
	);
}

/**
 * The component a post describes, from its meta.
 *
 * @param int $post_id Post ID.
 * @return array|null Merged data from ajs_component_data(), or null.
 */
function ajs_component_for_post( int $post_id ): ?array {
	$package = (string) get_post_meta( $post_id, AJS_COMPONENT_META_PACKAGE, true );
	$name    = (string) get_post_meta( $post_id, AJS_COMPONENT_META_EXPORT, true );

	if ( '' === $package || '' === $name ) {
		return null;
	}

	return ajs_component_data( $package, $name );
}

/**
 * Formats an ISO date (YYYY-MM-DD) with the site's date format.
 *
 * @param string|null $date ISO date.
 * @return string Formatted date, or an empty string.
 */
function ajs_component_format_date( ?string $date ): string {
	if ( empty( $date ) ) {
		return '';
	}

	$timestamp = strtotime( $date . ' 12:00:00 UTC' );

	return false === $timestamp ? $date : (string) wp_date( get_option( 'date_format' ), $timestamp );
}

/**
 * Turns the inline Markdown used in changelog entries into escaped HTML.
 *
 * Supports `code`, [text](url), **strong** and _em_; everything else is
 * escaped. Callers still pass the result through wp_kses().
 *
 * @param string $text Changelog entry text.
 * @return string HTML.
 */
function ajs_component_inline_markdown( string $text ): string {
	$html = esc_html( $text );

	$html = (string) preg_replace( '/`([^`]+)`/', '<code>$1</code>', $html );
	$html = (string) preg_replace_callback(
		'/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/',
		static function ( array $m ): string {
			return '<a href="' . esc_url( html_entity_decode( $m[2], ENT_QUOTES ) ) . '">' . $m[1] . '</a>';
		},
		$html
	);
	$html = (string) preg_replace( '/\*\*([^*]+)\*\*/', '<strong>$1</strong>', $html );
	$html = (string) preg_replace( '/(?<![\w])_([^_]+)_(?![\w])/', '<em>$1</em>', $html );

	return $html;
}

/** Meta key holding a core block's name, for example core/paragraph. */
const AJS_CORE_BLOCK_META_NAME = 'ajs_block_name';

/**
 * Everything known about one core block from data/usage.json.
 *
 * @param string $block_name Block name, for example core/paragraph.
 * @return array|null Block metadata with its `components` map, or null.
 */
function ajs_core_block_data( string $block_name ): ?array {
	$usage = ajs_component_data_file( 'usage' );

	if ( empty( $usage['blocks'][ $block_name ] ) ) {
		return null;
	}

	return array_merge(
		$usage['blocks'][ $block_name ],
		array(
			'name'                => $block_name,
			'blockLibraryVersion' => $usage['blockLibraryVersion'] ?? null,
		)
	);
}

/**
 * The core block a post describes, from its meta.
 *
 * @param int $post_id Post ID.
 * @return array|null Data from ajs_core_block_data(), or null.
 */
function ajs_core_block_for_post( int $post_id ): ?array {
	$name = (string) get_post_meta( $post_id, AJS_CORE_BLOCK_META_NAME, true );

	return '' === $name ? null : ajs_core_block_data( $name );
}

/**
 * Published post IDs of a post type keyed by a meta value, loaded once per request.
 *
 * @param string $post_type Post type.
 * @param string $meta_key  Meta key whose value becomes the array key.
 * @param array  $key_parts For components, the meta keys whose values are joined with ":".
 * @return array<string, int> Key => post ID.
 */
function ajs_post_ids_by_meta( string $post_type, string $meta_key, array $key_parts = array() ): array {
	static $cache = array();

	if ( isset( $cache[ $post_type ] ) ) {
		return $cache[ $post_type ];
	}

	$ids = get_posts(
		array(
			'post_type'              => $post_type,
			'post_status'            => 'publish',
			'posts_per_page'         => -1,
			'fields'                 => 'ids',
			'no_found_rows'          => true,
			'update_post_term_cache' => false,
		)
	);

	update_meta_cache( 'post', $ids );

	$map = array();

	foreach ( $ids as $id ) {
		if ( $key_parts ) {
			$values = array();
			foreach ( $key_parts as $part ) {
				$values[] = (string) get_post_meta( $id, $part, true );
			}
			$key = implode( ':', $values );
		} else {
			$key = (string) get_post_meta( $id, $meta_key, true );
		}

		if ( '' !== trim( $key, ':' ) ) {
			$map[ $key ] = (int) $id;
		}
	}

	$cache[ $post_type ] = $map;

	return $map;
}

/**
 * Permalink of the Component post for a component key, if one exists.
 *
 * @param string $key "<package>:<export name>".
 * @return string|null URL or null.
 */
function ajs_component_post_link( string $key ): ?string {
	$ids = ajs_post_ids_by_meta( 'ajs_component', '', array( AJS_COMPONENT_META_PACKAGE, AJS_COMPONENT_META_EXPORT ) );

	return isset( $ids[ $key ] ) ? (string) get_permalink( $ids[ $key ] ) : null;
}

/**
 * Permalink of the Core Block post for a block name, if one exists.
 *
 * @param string $block_name Block name, for example core/paragraph.
 * @return string|null URL or null.
 */
function ajs_core_block_post_link( string $block_name ): ?string {
	$ids = ajs_post_ids_by_meta( 'ajs_core_block', AJS_CORE_BLOCK_META_NAME );

	return isset( $ids[ $block_name ] ) ? (string) get_permalink( $ids[ $block_name ] ) : null;
}
