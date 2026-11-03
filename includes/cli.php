<?php
/**
 * WP-CLI command that creates one Component post per test block.
 *
 *     wp ajs components sync [--reset] [--dry-run]
 *
 * Reads data/inventory.json (written by scripts/inventory.mjs) and creates
 * or updates an ajs_component post for every row whose status is "done",
 * that is every component that has a test block. Existing posts are found
 * by their package and export-name meta, so titles can change without
 * creating duplicates. Content is written for new posts only unless --reset
 * is given, so edits made in the editor survive a re-sync.
 *
 * @package ajs
 */

defined( 'ABSPATH' ) || exit;

if ( ! ( defined( 'WP_CLI' ) && WP_CLI ) ) {
	return;
}

/**
 * Manages the Component posts.
 */
class AJS_Components_Command {

	/**
	 * Creates or updates one Component post per component that has a test block.
	 *
	 * ## OPTIONS
	 *
	 * [--reset]
	 * : Rewrite the content of existing posts too, discarding editor changes.
	 *
	 * [--dry-run]
	 * : Report what would change without writing anything.
	 *
	 * ## EXAMPLES
	 *
	 *     wp ajs components sync
	 *     wp ajs components sync --reset
	 *
	 * @param array $args       Positional arguments (unused).
	 * @param array $assoc_args Named arguments.
	 */
	public function sync( array $args, array $assoc_args ): void {
		$reset   = ! empty( $assoc_args['reset'] );
		$dry_run = ! empty( $assoc_args['dry-run'] );

		$rows = ajs_component_data_file( 'inventory' );

		if ( empty( $rows ) ) {
			WP_CLI::error( 'data/inventory.json is missing or empty. Run `npm run inventory` first.' );
		}

		$existing = $this->existing_posts();
		$counts   = array(
			'created'   => 0,
			'updated'   => 0,
			'unchanged' => 0,
			'skipped'   => 0,
		);

		foreach ( $rows as $row ) {
			if ( ( $row['status'] ?? '' ) !== 'done' || empty( $row['blockName'] ) ) {
				++$counts['skipped'];
				continue;
			}

			$key     = ajs_component_key( $row['package'], $row['name'] );
			$post_id = $existing[ $key ] ?? 0;
			$fields  = $this->post_fields( $row );

			if ( $post_id ) {
				$changed = $this->update_post( $post_id, $row, $fields, $reset, $dry_run );
				++$counts[ $changed ? 'updated' : 'unchanged' ];
				continue;
			}

			if ( ! $dry_run ) {
				$post_id = wp_insert_post( $fields, true );
				if ( is_wp_error( $post_id ) ) {
					WP_CLI::warning( sprintf( '%s: %s', $key, $post_id->get_error_message() ) );
					continue;
				}
				$this->write_meta_and_terms( $post_id, $row );
			}

			WP_CLI::log( sprintf( 'Created %s', $key ) );
			++$counts['created'];
		}

		WP_CLI::success(
			sprintf(
				'%s%d created, %d updated, %d unchanged, %d inventory rows skipped (no test block).',
				$dry_run ? '[dry run] ' : '',
				$counts['created'],
				$counts['updated'],
				$counts['unchanged'],
				$counts['skipped']
			)
		);
	}

	/**
	 * Existing Component posts keyed by component key.
	 *
	 * @return array<string, int> Key => post ID.
	 */
	private function existing_posts(): array {
		$posts = get_posts(
			array(
				'post_type'      => AJS_COMPONENT_POST_TYPE,
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
			)
		);

		$map = array();

		foreach ( $posts as $post_id ) {
			$package = (string) get_post_meta( $post_id, AJS_COMPONENT_META_PACKAGE, true );
			$name    = (string) get_post_meta( $post_id, AJS_COMPONENT_META_EXPORT, true );
			if ( '' !== $package && '' !== $name ) {
				$map[ ajs_component_key( $package, $name ) ] = (int) $post_id;
			}
		}

		return $map;
	}

	/**
	 * The post fields an inventory row maps to.
	 *
	 * @param array $row Inventory row.
	 * @return array Arguments for wp_insert_post().
	 */
	private function post_fields( array $row ): array {
		$slug = preg_replace( '/^ajs\//', '', (string) $row['blockName'] );

		return array(
			'post_type'    => AJS_COMPONENT_POST_TYPE,
			'post_status'  => 'publish',
			'post_title'   => (string) ( $row['blockTitle'] ?: $row['name'] ),
			'post_name'    => $slug,
			'post_excerpt' => (string) ( $row['blockDescription'] ?? '' ),
			'post_author'  => $this->author_id(),
			'post_content' => $this->content( (string) $row['blockName'] ),
			'meta_input'   => array(
				AJS_COMPONENT_META_PACKAGE => $row['package'],
				AJS_COMPONENT_META_EXPORT  => $row['name'],
				AJS_COMPONENT_META_SORT    => $this->sort_name( $row ),
				AJS_COMPONENT_META_ADDED   => $this->added_date( $row ),
				AJS_COMPONENT_META_USAGE   => $this->usage_count( $row ),
			),
		);
	}

	/**
	 * The ISO date the component was first exported, from data/history.json.
	 *
	 * @param array $row Inventory row.
	 * @return string YYYY-MM-DD, or an empty string without history data.
	 */
	private function added_date( array $row ): string {
		$data = ajs_component_data( $row['package'], $row['name'] );

		return (string) ( $data['history']['addedDate'] ?? '' );
	}

	/**
	 * How many core blocks import the component, from data/usage.json.
	 *
	 * @param array $row Inventory row.
	 * @return int Count.
	 */
	private function usage_count( array $row ): int {
		$data = ajs_component_data( $row['package'], $row['name'] );

		return count( $data['blocks'] ?? array() );
	}

	/**
	 * The lower-cased base name, so archives sort experimental exports with their stable peers.
	 *
	 * @param array $row Inventory row.
	 * @return string Sort key.
	 */
	private function sort_name( array $row ): string {
		return strtolower( (string) ( $row['base'] ?? $row['name'] ) );
	}

	/**
	 * The first administrator, so posts have an author on the front end.
	 *
	 * @return int User ID, or 0 when the site has no administrator.
	 */
	private function author_id(): int {
		static $author = null;

		if ( null === $author ) {
			$admins = get_users(
				array(
					'role'    => 'administrator',
					'orderby' => 'ID',
					'number'  => 1,
					'fields'  => 'ID',
				)
			);
			$author = empty( $admins ) ? 0 : (int) $admins[0];
		}

		return $author;
	}

	/**
	 * The seeded content: the info block, a heading, then the test block.
	 *
	 * @param string $block_name Test block name, for example ajs/button.
	 * @return string Serialized blocks.
	 */
	private function content( string $block_name ): string {
		return implode(
			"\n\n",
			array(
				'<!-- wp:ajs/component-info /-->',
				'<!-- wp:heading {"level":2} -->' . "\n" . '<h2 class="wp-block-heading">Demo</h2>' . "\n" . '<!-- /wp:heading -->',
				sprintf( '<!-- wp:%s /-->', $block_name ),
			)
		);
	}

	/**
	 * Updates an existing post's title, slug, excerpt, terms and, with --reset, content.
	 *
	 * @param int   $post_id Post ID.
	 * @param array $row     Inventory row.
	 * @param array $fields  Fields from post_fields().
	 * @param bool  $reset   Whether to rewrite the content.
	 * @param bool  $dry_run Whether to skip writes.
	 * @return bool Whether anything changed.
	 */
	private function update_post( int $post_id, array $row, array $fields, bool $reset, bool $dry_run ): bool {
		$post    = get_post( $post_id );
		$compare = array( 'post_title', 'post_name', 'post_excerpt', 'post_status', 'post_author' );

		if ( $reset ) {
			$compare[] = 'post_content';
		}

		$update = array();

		foreach ( $compare as $field ) {
			if ( (string) $post->$field !== (string) $fields[ $field ] ) {
				$update[ $field ] = $fields[ $field ];
			}
		}

		$terms_changed = $this->terms_differ( $post_id, $row );
		$meta_changed  = (string) get_post_meta( $post_id, AJS_COMPONENT_META_SORT, true ) !== $this->sort_name( $row )
			|| (string) get_post_meta( $post_id, AJS_COMPONENT_META_ADDED, true ) !== $this->added_date( $row )
			|| (int) get_post_meta( $post_id, AJS_COMPONENT_META_USAGE, true ) !== $this->usage_count( $row );

		if ( empty( $update ) && ! $terms_changed && ! $meta_changed ) {
			return false;
		}

		if ( ! $dry_run ) {
			if ( ! empty( $update ) ) {
				$update['ID'] = $post_id;
				$result       = wp_update_post( $update, true );
				if ( is_wp_error( $result ) ) {
					WP_CLI::warning( sprintf( '%s: %s', $row['name'], $result->get_error_message() ) );
					return false;
				}
			}
			$this->write_meta_and_terms( $post_id, $row );
		}

		WP_CLI::log( sprintf( 'Updated %s (%s)', ajs_component_key( $row['package'], $row['name'] ), implode( ', ', array_merge( array_keys( $update ), $terms_changed ? array( 'terms' ) : array() ) ) ) );

		return true;
	}

	/**
	 * Whether the post's package or kind terms differ from the inventory row.
	 *
	 * @param int   $post_id Post ID.
	 * @param array $row     Inventory row.
	 * @return bool True when a term needs updating.
	 */
	private function terms_differ( int $post_id, array $row ): bool {
		foreach ( $this->terms( $row ) as $taxonomy => $slug ) {
			$current = wp_get_object_terms( $post_id, $taxonomy, array( 'fields' => 'slugs' ) );
			if ( is_wp_error( $current ) || array( $slug ) !== $current ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * The taxonomy terms an inventory row maps to.
	 *
	 * @param array $row Inventory row.
	 * @return array<string, string> Taxonomy => term slug.
	 */
	private function terms( array $row ): array {
		return array(
			AJS_COMPONENT_TAX_PACKAGE => (string) $row['package'],
			AJS_COMPONENT_TAX_KIND    => (string) ( $row['kind'] ?? 'stable' ),
		);
	}

	/**
	 * Writes the meta and terms for a post.
	 *
	 * Terms are set with wp_set_object_terms() rather than tax_input, which
	 * is ignored when no user is logged in, as is the case in WP-CLI.
	 *
	 * @param int   $post_id Post ID.
	 * @param array $row     Inventory row.
	 */
	private function write_meta_and_terms( int $post_id, array $row ): void {
		update_post_meta( $post_id, AJS_COMPONENT_META_PACKAGE, $row['package'] );
		update_post_meta( $post_id, AJS_COMPONENT_META_EXPORT, $row['name'] );
		update_post_meta( $post_id, AJS_COMPONENT_META_SORT, $this->sort_name( $row ) );
		update_post_meta( $post_id, AJS_COMPONENT_META_ADDED, $this->added_date( $row ) );
		update_post_meta( $post_id, AJS_COMPONENT_META_USAGE, $this->usage_count( $row ) );

		foreach ( $this->terms( $row ) as $taxonomy => $slug ) {
			if ( ! term_exists( $slug, $taxonomy ) ) {
				wp_insert_term( $slug, $taxonomy, array( 'slug' => $slug ) );
			}
			wp_set_object_terms( $post_id, $slug, $taxonomy );
		}
	}
}

WP_CLI::add_command( 'ajs components', 'AJS_Components_Command' );

/**
 * Manages the Core Block posts.
 */
class AJS_Core_Blocks_Command {

	/**
	 * Creates or updates one Core Block post per block in data/usage.json.
	 *
	 * ## OPTIONS
	 *
	 * [--reset]
	 * : Rewrite the content of existing posts too, discarding editor changes.
	 *
	 * [--dry-run]
	 * : Report what would change without writing anything.
	 *
	 * ## EXAMPLES
	 *
	 *     wp ajs core-blocks sync
	 *
	 * @param array $args       Positional arguments (unused).
	 * @param array $assoc_args Named arguments.
	 */
	public function sync( array $args, array $assoc_args ): void {
		$reset   = ! empty( $assoc_args['reset'] );
		$dry_run = ! empty( $assoc_args['dry-run'] );

		$usage = ajs_component_data_file( 'usage' );

		if ( empty( $usage['blocks'] ) ) {
			WP_CLI::error( 'data/usage.json has no blocks section. Run `npm run data:usage` first.' );
		}

		$existing = ajs_post_ids_by_meta( AJS_CORE_BLOCK_POST_TYPE, AJS_CORE_BLOCK_META_NAME );
		$counts   = array(
			'created'   => 0,
			'updated'   => 0,
			'unchanged' => 0,
		);

		foreach ( $usage['blocks'] as $name => $data ) {
			$fields  = $this->post_fields( $name, $data );
			$post_id = $existing[ $name ] ?? 0;

			if ( $post_id ) {
				$changed = $this->update_post( $post_id, $name, $data, $fields, $reset, $dry_run );
				++$counts[ $changed ? 'updated' : 'unchanged' ];
				continue;
			}

			if ( ! $dry_run ) {
				$post_id = wp_insert_post( $fields, true );
				if ( is_wp_error( $post_id ) ) {
					WP_CLI::warning( sprintf( '%s: %s', $name, $post_id->get_error_message() ) );
					continue;
				}
				$this->write_meta_and_terms( $post_id, $name, $data );
			}

			WP_CLI::log( sprintf( 'Created %s', $name ) );
			++$counts['created'];
		}

		WP_CLI::success(
			sprintf(
				'%s%d created, %d updated, %d unchanged.',
				$dry_run ? '[dry run] ' : '',
				$counts['created'],
				$counts['updated'],
				$counts['unchanged']
			)
		);
	}

	/**
	 * The post fields a block maps to.
	 *
	 * @param string $name Block name.
	 * @param array  $data Block data from usage.json.
	 * @return array Arguments for wp_insert_post().
	 */
	private function post_fields( string $name, array $data ): array {
		return array(
			'post_type'    => AJS_CORE_BLOCK_POST_TYPE,
			'post_status'  => 'publish',
			'post_title'   => (string) ( $data['title'] ?: $name ),
			'post_name'    => $this->slug( $name ),
			'post_excerpt' => (string) ( $data['description'] ?? '' ),
			'post_content' => '<!-- wp:ajs/core-block-info /-->',
			'post_author'  => $this->author_id(),
			'meta_input'   => array(
				AJS_CORE_BLOCK_META_NAME       => $name,
				AJS_CORE_BLOCK_META_COMPONENTS => count( $data['components'] ?? array() ),
			),
		);
	}

	/**
	 * Updates an existing post's title, slug, excerpt, author, terms and, with --reset, content.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $name    Block name.
	 * @param array  $data    Block data.
	 * @param array  $fields  Fields from post_fields().
	 * @param bool   $reset   Whether to rewrite the content.
	 * @param bool   $dry_run Whether to skip writes.
	 * @return bool Whether anything changed.
	 */
	private function update_post( int $post_id, string $name, array $data, array $fields, bool $reset, bool $dry_run ): bool {
		$post    = get_post( $post_id );
		$compare = array( 'post_title', 'post_name', 'post_excerpt', 'post_status', 'post_author' );

		if ( $reset ) {
			$compare[] = 'post_content';
		}

		$update = array();

		foreach ( $compare as $field ) {
			if ( (string) $post->$field !== (string) $fields[ $field ] ) {
				$update[ $field ] = $fields[ $field ];
			}
		}

		$current_terms = wp_get_object_terms( $post_id, AJS_CORE_BLOCK_TAX_CATEGORY, array( 'fields' => 'slugs' ) );
		$terms_changed = is_wp_error( $current_terms ) || $this->category_terms( $data ) !== $current_terms;
		$meta_changed  = (int) get_post_meta( $post_id, AJS_CORE_BLOCK_META_COMPONENTS, true ) !== count( $data['components'] ?? array() );

		if ( empty( $update ) && ! $terms_changed && ! $meta_changed ) {
			return false;
		}

		if ( ! $dry_run ) {
			if ( ! empty( $update ) ) {
				$update['ID'] = $post_id;
				$result       = wp_update_post( $update, true );
				if ( is_wp_error( $result ) ) {
					WP_CLI::warning( sprintf( '%s: %s', $name, $result->get_error_message() ) );
					return false;
				}
			}
			$this->write_meta_and_terms( $post_id, $name, $data );
		}

		WP_CLI::log( sprintf( 'Updated %s (%s)', $name, implode( ', ', array_merge( array_keys( $update ), $terms_changed ? array( 'terms' ) : array() ) ) ) );

		return true;
	}

	/**
	 * The post slug for a block: its name without "core/", avoiding slugs that
	 * WordPress reserves for feeds and oEmbed (rss, atom, embed, ...), which
	 * wp_unique_post_slug() would otherwise suffix with "-2" on every sync.
	 *
	 * @param string $name Block name.
	 * @return string Slug.
	 */
	private function slug( string $name ): string {
		$slug     = sanitize_title( preg_replace( '/^core\//', '', $name ) );
		$reserved = array_merge( (array) ( $GLOBALS['wp_rewrite']->feeds ?? array( 'feed', 'rdf', 'rss', 'rss2', 'atom' ) ), array( 'embed' ) );

		return in_array( $slug, $reserved, true ) ? $slug . '-block' : $slug;
	}

	/**
	 * The category term slugs for a block (one, or none when block.json has no category).
	 *
	 * @param array $data Block data.
	 * @return string[] Term slugs.
	 */
	private function category_terms( array $data ): array {
		return empty( $data['category'] ) ? array() : array( sanitize_title( (string) $data['category'] ) );
	}

	/**
	 * Writes the meta and category term for a post.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $name    Block name.
	 * @param array  $data    Block data.
	 */
	private function write_meta_and_terms( int $post_id, string $name, array $data ): void {
		update_post_meta( $post_id, AJS_CORE_BLOCK_META_NAME, $name );
		update_post_meta( $post_id, AJS_CORE_BLOCK_META_COMPONENTS, count( $data['components'] ?? array() ) );

		foreach ( $this->category_terms( $data ) as $slug ) {
			if ( ! term_exists( $slug, AJS_CORE_BLOCK_TAX_CATEGORY ) ) {
				wp_insert_term( $slug, AJS_CORE_BLOCK_TAX_CATEGORY, array( 'slug' => $slug ) );
			}
		}

		wp_set_object_terms( $post_id, $this->category_terms( $data ), AJS_CORE_BLOCK_TAX_CATEGORY );
	}

	/**
	 * The first administrator, so posts have an author on the front end.
	 *
	 * @return int User ID, or 0 when the site has no administrator.
	 */
	private function author_id(): int {
		static $author = null;

		if ( null === $author ) {
			$admins = get_users(
				array(
					'role'    => 'administrator',
					'orderby' => 'ID',
					'number'  => 1,
					'fields'  => 'ID',
				)
			);
			$author = empty( $admins ) ? 0 : (int) $admins[0];
		}

		return $author;
	}
}

WP_CLI::add_command( 'ajs core-blocks', 'AJS_Core_Blocks_Command' );
