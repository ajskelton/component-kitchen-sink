<?php
/**
 * Server render for the ajs/archive-tools block.
 *
 * A GET form that submits to the post type archive: search text, one select
 * per taxonomy with term counts, an ordering select, and the result count
 * of the current archive query when the block is on one.
 *
 * @var array    $attributes Block attributes (postType).
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

global $wp_query;

$ajs_types     = ajs_templated_post_types();
$ajs_post_type = isset( $ajs_types[ $attributes['postType'] ?? '' ] ) ? $attributes['postType'] : AJS_COMPONENT_POST_TYPE;
$ajs_config    = $ajs_types[ $ajs_post_type ];
$ajs_on_arch   = $wp_query instanceof WP_Query && ajs_archive_post_type( $wp_query ) === $ajs_post_type;
$ajs_query     = $ajs_on_arch ? $wp_query : new WP_Query();
$ajs_action    = get_post_type_archive_link( $ajs_post_type ) ?: home_url( '/' );
$ajs_search    = $ajs_on_arch ? trim( (string) get_query_var( AJS_ARCHIVE_QUERY_SEARCH ) ) : '';
$ajs_ordering  = ajs_archive_current_ordering( $ajs_post_type, $ajs_query );
$ajs_orderings = ajs_archive_orderings( $ajs_post_type );
$ajs_default   = (string) array_key_first( $ajs_orderings );
$ajs_selected  = array();
$ajs_active    = '' !== $ajs_search || $ajs_ordering !== $ajs_default;

foreach ( $ajs_config['taxonomies'] as $ajs_taxonomy => $ajs_label ) {
	$ajs_value = '';
	if ( $ajs_on_arch ) {
		$ajs_object = $wp_query->get_queried_object();
		if ( $ajs_object instanceof WP_Term && $ajs_object->taxonomy === $ajs_taxonomy ) {
			$ajs_value = $ajs_object->slug;
		} else {
			$ajs_value = sanitize_title( (string) get_query_var( $ajs_taxonomy ) );
		}
	}
	$ajs_selected[ $ajs_taxonomy ] = $ajs_value;
	$ajs_active                    = $ajs_active || '' !== $ajs_value;
}

$ajs_id = wp_unique_id( 'ajs-tools-' );

?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<form class="ajs-tools__form" method="get" action="<?php echo esc_url( $ajs_action ); ?>" role="search">
		<div class="ajs-tools__field ajs-tools__field--search">
			<label for="<?php echo esc_attr( $ajs_id . '-q' ); ?>"><?php esc_html_e( 'Search', 'component-kitchen-sink' ); ?></label>
			<input
				type="search"
				id="<?php echo esc_attr( $ajs_id . '-q' ); ?>"
				name="<?php echo esc_attr( AJS_ARCHIVE_QUERY_SEARCH ); ?>"
				value="<?php echo esc_attr( $ajs_search ); ?>"
				placeholder="<?php echo esc_attr( AJS_COMPONENT_POST_TYPE === $ajs_post_type ? __( 'Component name…', 'component-kitchen-sink' ) : __( 'Block name…', 'component-kitchen-sink' ) ); ?>"
			/>
		</div>

		<?php foreach ( $ajs_config['taxonomies'] as $ajs_taxonomy => $ajs_label ) : ?>
			<?php
			$ajs_terms = get_terms(
				array(
					'taxonomy'   => $ajs_taxonomy,
					'hide_empty' => true,
					'orderby'    => 'count',
					'order'      => 'DESC',
				)
			);
			if ( is_wp_error( $ajs_terms ) || empty( $ajs_terms ) ) {
				continue;
			}
			?>
			<div class="ajs-tools__field">
				<label for="<?php echo esc_attr( $ajs_id . '-' . $ajs_taxonomy ); ?>"><?php echo esc_html( $ajs_label ); ?></label>
				<select id="<?php echo esc_attr( $ajs_id . '-' . $ajs_taxonomy ); ?>" name="<?php echo esc_attr( $ajs_taxonomy ); ?>">
					<option value=""><?php esc_html_e( 'All', 'component-kitchen-sink' ); ?></option>
					<?php foreach ( $ajs_terms as $ajs_term ) : ?>
						<option value="<?php echo esc_attr( $ajs_term->slug ); ?>" <?php selected( $ajs_selected[ $ajs_taxonomy ], $ajs_term->slug ); ?>>
							<?php echo esc_html( sprintf( '%s (%s)', $ajs_term->name, number_format_i18n( $ajs_term->count ) ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>
		<?php endforeach; ?>

		<div class="ajs-tools__field">
			<label for="<?php echo esc_attr( $ajs_id . '-order' ); ?>"><?php esc_html_e( 'Order', 'component-kitchen-sink' ); ?></label>
			<select id="<?php echo esc_attr( $ajs_id . '-order' ); ?>" name="<?php echo esc_attr( AJS_ARCHIVE_QUERY_ORDER ); ?>">
				<?php foreach ( $ajs_orderings as $ajs_key => $ajs_definition ) : ?>
					<option value="<?php echo esc_attr( $ajs_key ); ?>" <?php selected( $ajs_ordering, $ajs_key ); ?>><?php echo esc_html( $ajs_definition['label'] ); ?></option>
				<?php endforeach; ?>
			</select>
		</div>

		<button type="submit" class="ajs-tools__submit"><?php esc_html_e( 'Apply', 'component-kitchen-sink' ); ?></button>
	</form>

	<?php if ( $ajs_on_arch ) : ?>
		<p class="ajs-tools__results">
			<?php
			$ajs_found = (int) $wp_query->found_posts;
			if ( '' !== $ajs_search ) {
				/* translators: 1: number of results, 2: search text. */
				echo esc_html( sprintf( _n( '%1$s result for “%2$s”', '%1$s results for “%2$s”', $ajs_found, 'component-kitchen-sink' ), number_format_i18n( $ajs_found ), $ajs_search ) );
			} elseif ( AJS_COMPONENT_POST_TYPE === $ajs_post_type ) {
				/* translators: %s: number of components. */
				echo esc_html( sprintf( _n( '%s component', '%s components', $ajs_found, 'component-kitchen-sink' ), number_format_i18n( $ajs_found ) ) );
			} else {
				/* translators: %s: number of core blocks. */
				echo esc_html( sprintf( _n( '%s core block', '%s core blocks', $ajs_found, 'component-kitchen-sink' ), number_format_i18n( $ajs_found ) ) );
			}
			if ( $ajs_active ) {
				echo ' <a href="' . esc_url( $ajs_action ) . '">' . esc_html__( 'Clear', 'component-kitchen-sink' ) . '</a>';
			}
			?>
		</p>
	<?php endif; ?>
</div>
