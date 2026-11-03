<?php
/**
 * Server render for the ajs/core-block-info block.
 *
 * Prints, for the core block the current post describes: its block.json
 * metadata and every @wordpress/components and @wordpress/block-editor
 * export it imports, each linked to its Component post when one exists.
 * Read from data/usage.json through includes/data.php.
 *
 * @var array    $attributes Block attributes (variant).
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

$ajs_post_id = (int) ( $block->context['postId'] ?? get_the_ID() );
$ajs_data    = $ajs_post_id ? ajs_core_block_for_post( $ajs_post_id ) : null;
$ajs_variant = ( $attributes['variant'] ?? 'full' ) === 'summary' ? 'summary' : 'full';

$ajs_groups = array(
	'components'   => array(),
	'block-editor' => array(),
);

if ( null !== $ajs_data ) {
	foreach ( $ajs_data['components'] as $ajs_key => $ajs_files ) {
		list( $ajs_pkg, $ajs_export ) = explode( ':', $ajs_key, 2 );
		$ajs_groups[ $ajs_pkg ][]      = array(
			'key'    => $ajs_key,
			'export' => $ajs_export,
			'files'  => (array) $ajs_files,
		);
	}
}

$ajs_total = null === $ajs_data ? 0 : count( $ajs_data['components'] );

if ( 'summary' === $ajs_variant ) :
	$ajs_summary = array();

	if ( null !== $ajs_data ) {
		if ( ! empty( $ajs_data['category'] ) ) {
			$ajs_summary[] = '<span class="ajs-info__badge">' . esc_html( $ajs_data['category'] ) . '</span>';
		}
		$ajs_summary[] = '<span>' . esc_html(
			$ajs_total
				/* translators: %d: number of components. */
				? sprintf( _n( 'Uses %d component', 'Uses %d components', $ajs_total, 'component-kitchen-sink' ), $ajs_total )
				: __( 'Uses no components directly', 'component-kitchen-sink' )
		) . '</span>';
		foreach ( $ajs_groups as $ajs_pkg => $ajs_items ) {
			if ( $ajs_items ) {
				/* translators: 1: package short name, 2: number of imports. */
				$ajs_summary[] = '<span class="ajs-info__badge ajs-info__badge--' . esc_attr( $ajs_pkg ) . '">' . esc_html( sprintf( __( '%1$s · %2$d', 'component-kitchen-sink' ), $ajs_pkg, count( $ajs_items ) ) ) . '</span>';
			}
		}
	}
	?>
	<div <?php echo get_block_wrapper_attributes( array( 'class' => 'is-variant-summary' ) ); ?>>
		<?php echo implode( "\n", $ajs_summary ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built from escaped parts above. ?>
	</div>
	<?php
	return;
endif;

?>
<div <?php echo get_block_wrapper_attributes( array( 'class' => 'is-variant-full' ) ); ?>>
	<?php if ( null === $ajs_data ) : ?>
		<p class="ajs-info__note">
			<?php
			if ( ! $ajs_post_id || '' === (string) get_post_meta( $ajs_post_id, AJS_CORE_BLOCK_META_NAME, true ) ) {
				esc_html_e( 'This post has no core block set. Run `wp ajs core-blocks sync` or add the ajs_block_name meta.', 'component-kitchen-sink' );
			} else {
				esc_html_e( 'No data for this block yet. Run `npm run data:usage` in the plugin and reload.', 'component-kitchen-sink' );
			}
			?>
		</p>
	<?php else : ?>
		<ul class="ajs-info__meta">
			<li><code><?php echo esc_html( $ajs_data['name'] ); ?></code></li>
			<?php if ( ! empty( $ajs_data['category'] ) ) : ?>
				<li><span class="ajs-info__badge"><?php echo esc_html( $ajs_data['category'] ); ?></span></li>
			<?php endif; ?>
			<?php if ( ! empty( $ajs_data['keywords'] ) ) : ?>
				<li>
					<?php esc_html_e( 'Keywords:', 'component-kitchen-sink' ); ?>
					<?php echo esc_html( implode( ', ', (array) $ajs_data['keywords'] ) ); ?>
				</li>
			<?php endif; ?>
			<?php foreach ( array( 'parent', 'ancestor' ) as $ajs_relation ) : ?>
				<?php if ( ! empty( $ajs_data[ $ajs_relation ] ) ) : ?>
					<li>
						<?php echo esc_html( ucfirst( $ajs_relation ) . ':' ); ?>
						<code><?php echo esc_html( implode( ', ', (array) $ajs_data[ $ajs_relation ] ) ); ?></code>
					</li>
				<?php endif; ?>
			<?php endforeach; ?>
		</ul>

		<?php if ( ! empty( $ajs_data['description'] ) ) : ?>
			<p><?php echo esc_html( $ajs_data['description'] ); ?></p>
		<?php endif; ?>

		<h2><?php esc_html_e( 'Components used', 'component-kitchen-sink' ); ?></h2>
		<?php if ( ! $ajs_total ) : ?>
			<p class="ajs-info__note"><?php esc_html_e( 'This block imports nothing from @wordpress/components or @wordpress/block-editor directly.', 'component-kitchen-sink' ); ?></p>
		<?php else : ?>
			<?php foreach ( $ajs_groups as $ajs_pkg => $ajs_items ) : ?>
				<?php if ( ! $ajs_items ) : continue; endif; ?>
				<h3 class="ajs-info__group-title">
					<code><?php echo esc_html( '@wordpress/' . $ajs_pkg ); ?></code>
					<span class="ajs-info__release"><?php echo esc_html( (string) count( $ajs_items ) ); ?></span>
				</h3>
				<?php
				// Exports with a Component post are chips; the rest (store, utilities,
				// privateApis) are listed in one line.
				$ajs_linked = array();
				$ajs_other  = array();
				foreach ( $ajs_items as $ajs_item ) {
					$ajs_item['link'] = ajs_component_post_link( $ajs_item['key'] );
					if ( $ajs_item['link'] ) {
						$ajs_linked[] = $ajs_item;
					} else {
						$ajs_other[] = $ajs_item['export'];
					}
				}
				?>
				<?php if ( $ajs_linked ) : ?>
					<ul class="ajs-info__chips">
						<?php foreach ( $ajs_linked as $ajs_item ) : ?>
							<li class="ajs-info__chip" title="<?php echo esc_attr( implode( ', ', $ajs_item['files'] ) ); ?>">
								<a class="ajs-info__chip-title" href="<?php echo esc_url( $ajs_item['link'] ); ?>"><?php echo esc_html( $ajs_item['export'] ); ?></a>
								<small><?php echo esc_html( implode( ', ', $ajs_item['files'] ) ); ?></small>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
				<?php if ( $ajs_other ) : ?>
					<p class="ajs-info__note">
						<?php esc_html_e( 'Other imports without a component post:', 'component-kitchen-sink' ); ?>
						<?php echo implode( ', ', array_map( static fn( $ajs_name ) => '<code>' . esc_html( $ajs_name ) . '</code>', $ajs_other ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in the map. ?>
					</p>
				<?php endif; ?>
			<?php endforeach; ?>
		<?php endif; ?>

		<?php if ( null !== $ajs_data['blockLibraryVersion'] ) : ?>
			<p class="ajs-info__note">
				<?php
				/* translators: %s: package version. */
				echo esc_html( sprintf( __( 'Based on the source of @wordpress/block-library %s. Components reached through privateApis or shared helpers are not listed.', 'component-kitchen-sink' ), $ajs_data['blockLibraryVersion'] ) );
				?>
			</p>
		<?php endif; ?>
	<?php endif; ?>
</div>
