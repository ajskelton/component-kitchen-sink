<?php
/**
 * Server render for the ajs/component-info block.
 *
 * Prints, for the component the current post describes: where it comes
 * from, when it was added, which core blocks use it, and its changelog
 * history. All of it is read from data/ through includes/data.php.
 *
 * @var array    $attributes Block attributes (none).
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

$ajs_post_id = (int) ( $block->context['postId'] ?? get_the_ID() );
$ajs_data    = $ajs_post_id ? ajs_component_for_post( $ajs_post_id ) : null;

?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php if ( null === $ajs_data ) : ?>
		<p class="ajs-component-info__note">
			<?php
			if ( ! $ajs_post_id || '' === (string) get_post_meta( $ajs_post_id, AJS_COMPONENT_META_EXPORT, true ) ) {
				esc_html_e( 'This post has no component set. Run `wp ajs components sync` or add the ajs_package and ajs_export_name meta.', 'component-kitchen-sink' );
			} else {
				esc_html_e( 'No data for this component yet. Run `npm run data` in the plugin and reload.', 'component-kitchen-sink' );
			}
			?>
		</p>
	<?php else : ?>
		<?php
		$ajs_inventory = $ajs_data['inventory'];
		$ajs_history   = $ajs_data['history'];
		$ajs_package   = '@wordpress/' . $ajs_data['package'];
		?>
		<ul class="ajs-component-info__meta">
			<li><code><?php echo esc_html( $ajs_package ); ?></code></li>
			<li><code><?php echo esc_html( $ajs_data['name'] ); ?></code></li>
			<li><?php echo esc_html( $ajs_inventory['kind'] ?? '' ); ?></li>
			<?php if ( ! empty( $ajs_inventory['blockName'] ) ) : ?>
				<li>
					<?php esc_html_e( 'Test block:', 'component-kitchen-sink' ); ?>
					<code><?php echo esc_html( $ajs_inventory['blockName'] ); ?></code>
				</li>
			<?php endif; ?>
		</ul>

		<h2><?php esc_html_e( 'Added', 'component-kitchen-sink' ); ?></h2>
		<?php if ( empty( $ajs_history ) ) : ?>
			<p class="ajs-component-info__note"><?php esc_html_e( 'No history data. Run `npm run data:history`.', 'component-kitchen-sink' ); ?></p>
		<?php else : ?>
			<dl class="ajs-component-info__facts">
				<dt><?php esc_html_e( 'Package version', 'component-kitchen-sink' ); ?></dt>
				<dd>
					<?php
					echo esc_html( $ajs_package . ' ' . ( $ajs_history['addedVersion'] ?? '?' ) );
					if ( ! empty( $ajs_history['addedDate'] ) ) {
						echo ' (' . esc_html( ajs_component_format_date( $ajs_history['addedDate'] ) ) . ')';
					}
					?>
				</dd>
				<dt><?php esc_html_e( 'First WordPress release', 'component-kitchen-sink' ); ?></dt>
				<dd>
					<?php
					echo empty( $ajs_history['firstWordPress'] )
						? esc_html__( 'Not in a WordPress release yet', 'component-kitchen-sink' )
						: esc_html( 'WordPress ' . $ajs_history['firstWordPress'] );
					?>
				</dd>
				<?php if ( ! empty( $ajs_history['stabilised'] ) ) : ?>
					<dt><?php esc_html_e( 'Stabilised', 'component-kitchen-sink' ); ?></dt>
					<dd>
						<?php
						$ajs_stable = $ajs_history['stabilised'];
						printf(
							/* translators: 1: stable version, 2: date, 3: experimental export name, 4: experimental version. */
							esc_html__( '%1$s (%2$s), after shipping as %3$s since %4$s', 'component-kitchen-sink' ),
							esc_html( $ajs_stable['version'] ?? '?' ),
							esc_html( ajs_component_format_date( $ajs_stable['date'] ?? null ) ),
							'<code>' . esc_html( $ajs_stable['from'] ?? '' ) . '</code>',
							esc_html( $ajs_stable['fromVersion'] ?? '?' )
						);
						?>
					</dd>
				<?php endif; ?>
				<?php if ( ! empty( $ajs_history['deprecation'] ) ) : ?>
					<dt><?php esc_html_e( 'Deprecated', 'component-kitchen-sink' ); ?></dt>
					<dd>
						<?php
						$ajs_dep  = $ajs_history['deprecation'];
						$ajs_bits = array();
						if ( ! empty( $ajs_dep['feature'] ) ) {
							echo '<code>' . esc_html( $ajs_dep['feature'] ) . '</code> ';
						}
						if ( ! empty( $ajs_dep['since'] ) ) {
							/* translators: %s: WordPress version. */
							$ajs_bits[] = sprintf( __( 'since WordPress %s', 'component-kitchen-sink' ), $ajs_dep['since'] );
						}
						if ( ! empty( $ajs_dep['version'] ) ) {
							/* translators: %s: WordPress version. */
							$ajs_bits[] = sprintf( __( 'removal planned for %s', 'component-kitchen-sink' ), $ajs_dep['version'] );
						}
						if ( ! empty( $ajs_dep['alternative'] ) ) {
							/* translators: %s: replacement API name. */
							$ajs_bits[] = sprintf( __( 'use %s instead', 'component-kitchen-sink' ), $ajs_dep['alternative'] );
						}
						echo esc_html( implode( ', ', $ajs_bits ) );
						if ( ! empty( $ajs_dep['hint'] ) ) {
							echo ' ' . esc_html( $ajs_dep['hint'] );
						}
						?>
					</dd>
				<?php endif; ?>
				<?php if ( ! empty( $ajs_history['removedAfter'] ) ) : ?>
					<dt><?php esc_html_e( 'Removed after', 'component-kitchen-sink' ); ?></dt>
					<dd><?php echo esc_html( $ajs_history['removedAfter'] ); ?></dd>
				<?php endif; ?>
			</dl>
		<?php endif; ?>

		<h2><?php esc_html_e( 'Used by core blocks', 'component-kitchen-sink' ); ?></h2>
		<?php if ( empty( $ajs_data['blocks'] ) ) : ?>
			<p class="ajs-component-info__note">
				<?php
				echo null === $ajs_data['blockLibraryVersion']
					? esc_html__( 'No usage data. Run `npm run data:usage`.', 'component-kitchen-sink' )
					: esc_html__( 'No core block imports this component directly.', 'component-kitchen-sink' );
				?>
			</p>
		<?php else : ?>
			<ul class="ajs-component-info__blocks">
				<?php foreach ( $ajs_data['blocks'] as $ajs_block ) : ?>
					<li>
						<?php echo esc_html( $ajs_block['title'] ?? $ajs_block['block'] ); ?>
						<code><?php echo esc_html( $ajs_block['block'] ); ?></code>
					</li>
				<?php endforeach; ?>
			</ul>
		<?php endif; ?>
		<?php if ( ! empty( $ajs_data['shared'] ) ) : ?>
			<p class="ajs-component-info__note">
				<?php esc_html_e( 'Also imported by shared block-library code:', 'component-kitchen-sink' ); ?>
				<?php echo esc_html( implode( ', ', (array) $ajs_data['shared'] ) ); ?>
			</p>
		<?php endif; ?>
		<?php if ( null !== $ajs_data['blockLibraryVersion'] ) : ?>
			<p class="ajs-component-info__note">
				<?php
				/* translators: %s: package version. */
				echo esc_html( sprintf( __( 'Based on the source of @wordpress/block-library %s.', 'component-kitchen-sink' ), $ajs_data['blockLibraryVersion'] ) );
				?>
			</p>
		<?php endif; ?>

		<h2><?php esc_html_e( 'History', 'component-kitchen-sink' ); ?></h2>
		<?php
		$ajs_entries = $ajs_history['changelog'] ?? array();
		if ( empty( $ajs_history ) ) :
			?>
			<p class="ajs-component-info__note"><?php esc_html_e( 'No history data. Run `npm run data:history`.', 'component-kitchen-sink' ); ?></p>
		<?php elseif ( empty( $ajs_entries ) ) : ?>
			<p class="ajs-component-info__note"><?php esc_html_e( 'The package changelog has no entries naming this component.', 'component-kitchen-sink' ); ?></p>
		<?php else : ?>
			<?php
			$ajs_grouped = array();
			foreach ( $ajs_entries as $ajs_entry ) {
				$ajs_grouped[ (string) $ajs_entry['version'] ][] = $ajs_entry;
			}
			foreach ( $ajs_grouped as $ajs_version => $ajs_group ) :
				$ajs_date    = ajs_component_format_date( $ajs_group[0]['date'] ?? null );
				$ajs_release = 'unreleased' === $ajs_version ? null : ajs_component_wordpress_for_version( $ajs_data['package'], $ajs_version );
				?>
				<h3 class="ajs-component-info__version">
					<?php echo esc_html( 'unreleased' === $ajs_version ? __( 'Unreleased', 'component-kitchen-sink' ) : $ajs_version ); ?>
					<?php if ( '' !== $ajs_date ) : ?>
						<span class="ajs-component-info__release"><?php echo esc_html( $ajs_date ); ?></span>
					<?php endif; ?>
					<?php if ( $ajs_release ) : ?>
						<span class="ajs-component-info__release">
							<?php
							/* translators: %s: WordPress version. */
							echo esc_html( sprintf( __( '· WordPress %s', 'component-kitchen-sink' ), $ajs_release ) );
							?>
						</span>
					<?php endif; ?>
				</h3>
				<ul class="ajs-component-info__entries">
					<?php foreach ( $ajs_group as $ajs_entry ) : ?>
						<li>
							<?php if ( ! empty( $ajs_entry['category'] ) ) : ?>
								<span class="ajs-component-info__category"><?php echo esc_html( $ajs_entry['category'] ); ?></span>
							<?php endif; ?>
							<?php echo wp_kses( ajs_component_inline_markdown( (string) $ajs_entry['text'] ), array( 'code' => array(), 'a' => array( 'href' => array() ), 'em' => array(), 'strong' => array() ) ); ?>
							<?php foreach ( (array) ( $ajs_entry['prs'] ?? array() ) as $ajs_pr ) : ?>
								<a href="<?php echo esc_url( $ajs_pr ); ?>">#<?php echo esc_html( basename( $ajs_pr ) ); ?></a>
							<?php endforeach; ?>
						</li>
					<?php endforeach; ?>
				</ul>
			<?php endforeach; ?>
		<?php endif; ?>
	<?php endif; ?>
</div>
