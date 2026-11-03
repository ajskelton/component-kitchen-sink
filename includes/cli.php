<?php
/**
 * WP-CLI commands that create one post per component and per core block.
 *
 *     wp ajs components sync [--reset] [--dry-run]
 *     wp ajs core-blocks sync [--reset] [--dry-run]
 *     wp ajs setup
 *
 * The work is done by the classes in includes/sync.php and by
 * ajs_site_setup() in includes/setup.php.
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
		$dry_run = ! empty( $assoc_args['dry-run'] );

		try {
			$counts = ( new AJS_Component_Sync( 'WP_CLI::log' ) )->run( ! empty( $assoc_args['reset'] ), $dry_run );
		} catch ( RuntimeException $e ) {
			WP_CLI::error( $e->getMessage() );
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
		$dry_run = ! empty( $assoc_args['dry-run'] );

		try {
			$counts = ( new AJS_Core_Block_Sync( 'WP_CLI::log' ) )->run( ! empty( $assoc_args['reset'] ), $dry_run );
		} catch ( RuntimeException $e ) {
			WP_CLI::error( $e->getMessage() );
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
}

WP_CLI::add_command( 'ajs core-blocks', 'AJS_Core_Blocks_Command' );

/**
 * Seeds every post, the navigation menu and the rewrite rules in one go.
 *
 * ## EXAMPLES
 *
 *     wp ajs setup
 */
WP_CLI::add_command(
	'ajs setup',
	static function (): void {
		try {
			$report = ajs_site_setup( 'WP_CLI::log' );
		} catch ( RuntimeException $e ) {
			WP_CLI::error( $e->getMessage() );
		}

		WP_CLI::success( $report );
	}
);
