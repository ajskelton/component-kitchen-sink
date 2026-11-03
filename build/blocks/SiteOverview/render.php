<?php
/**
 * Server render for the ajs/site-overview block.
 *
 * Two cards linking to the Component and Core Block archives with live
 * counts and their taxonomy filters, then the list of test pages (pages
 * whose content uses this plugin's blocks).
 *
 * @var array    $attributes Block attributes (none).
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

$ajs_cards = array(
	array(
		'post_type'   => AJS_COMPONENT_POST_TYPE,
		'title'       => __( 'Components', 'component-kitchen-sink' ),
		'description' => __( 'One post per @wordpress/components and @wordpress/block-editor export: when it was added, which core blocks use it, its changelog history, and a test block that exercises it.', 'component-kitchen-sink' ),
		'taxonomies'  => array(
			AJS_COMPONENT_TAX_PACKAGE => __( 'By package', 'component-kitchen-sink' ),
			AJS_COMPONENT_TAX_KIND    => __( 'By kind', 'component-kitchen-sink' ),
		),
	),
	array(
		'post_type'   => AJS_CORE_BLOCK_POST_TYPE,
		'title'       => __( 'Core Blocks', 'component-kitchen-sink' ),
		'description' => __( 'One post per WordPress core block, listing every component it imports with links to their posts.', 'component-kitchen-sink' ),
		'taxonomies'  => array(
			AJS_CORE_BLOCK_TAX_CATEGORY => __( 'By category', 'component-kitchen-sink' ),
		),
	),
);

$ajs_pages = array();

foreach ( get_pages( array( 'post_status' => 'publish' ) ) as $ajs_page ) {
	$ajs_blocks = substr_count( $ajs_page->post_content, '<!-- wp:ajs/' );
	if ( $ajs_blocks > 0 ) {
		$ajs_pages[] = array(
			'title'    => $ajs_page->post_title,
			'url'      => get_permalink( $ajs_page ),
			'edit_url' => current_user_can( 'edit_post', $ajs_page->ID ) ? get_edit_post_link( $ajs_page->ID ) : '',
			'count'    => $ajs_blocks,
		);
	}
}

usort(
	$ajs_pages,
	static function ( array $a, array $b ): int {
		return strcasecmp( $a['title'], $b['title'] );
	}
);

?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<ul class="ajs-overview__cards">
		<?php foreach ( $ajs_cards as $ajs_card ) : ?>
			<?php
			$ajs_count = (int) ( wp_count_posts( $ajs_card['post_type'] )->publish ?? 0 );
			$ajs_url   = get_post_type_archive_link( $ajs_card['post_type'] );
			?>
			<li class="ajs-overview__card">
				<h2 class="ajs-overview__card-title"><a href="<?php echo esc_url( $ajs_url ); ?>"><?php echo esc_html( $ajs_card['title'] ); ?></a></h2>
				<span class="ajs-overview__count"><?php echo esc_html( number_format_i18n( $ajs_count ) ); ?></span>
				<p><?php echo esc_html( $ajs_card['description'] ); ?></p>
				<?php foreach ( $ajs_card['taxonomies'] as $ajs_taxonomy => $ajs_label ) : ?>
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
					<ul class="ajs-overview__filters">
						<li><?php echo esc_html( $ajs_label ); ?></li>
						<?php foreach ( $ajs_terms as $ajs_term ) : ?>
							<li>
								<a href="<?php echo esc_url( get_term_link( $ajs_term ) ); ?>">
									<?php echo esc_html( $ajs_term->name ); ?>
									<small><?php echo esc_html( number_format_i18n( $ajs_term->count ) ); ?></small>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endforeach; ?>
				<p class="ajs-overview__more">
					<a href="<?php echo esc_url( $ajs_url ); ?>">
						<?php
						/* translators: %s: archive name. */
						echo esc_html( sprintf( __( 'Browse all %s →', 'component-kitchen-sink' ), strtolower( $ajs_card['title'] ) ) );
						?>
					</a>
				</p>
			</li>
		<?php endforeach; ?>
	</ul>

	<?php if ( $ajs_pages ) : ?>
		<h2><?php esc_html_e( 'Test pages', 'component-kitchen-sink' ); ?></h2>
		<div class="ajs-overview__howto">
			<p><?php esc_html_e( 'Each test page puts a whole family of test blocks on one screen: form controls, overlays and menus, colour and layout tools, block editor controls, and so on. The front end of a page only prints each block\'s saved attributes; the components themselves live in the editor.', 'component-kitchen-sink' ); ?></p>
			<p><?php esc_html_e( 'To try a component, open one of these pages in the editor and select a block. Its sidebar lists every prop the block exercises as a control: change the variant, size or label of a Button, type into a ComboboxControl, drag a RangeControl, open a Modal or a Popover. The component on the canvas updates as you go, and the JSON under it shows the attributes the block would save. At the bottom of the sidebar, the Component post panel links to the component\'s own page with its history and the core blocks that use it.', 'component-kitchen-sink' ); ?></p>
			<p><?php esc_html_e( 'Some blocks keep a copy of their demo in the sidebar as well, for components that bind keys or trap focus inside the canvas. Nothing here needs saving: close the page without saving and it is back to how it was.', 'component-kitchen-sink' ); ?></p>
		</div>
		<ul class="ajs-overview__pages">
			<?php foreach ( $ajs_pages as $ajs_page ) : ?>
				<li>
					<a href="<?php echo esc_url( $ajs_page['url'] ); ?>"><?php echo esc_html( $ajs_page['title'] ); ?></a>
					<small>
						<?php
						/* translators: %d: number of test blocks. */
						echo esc_html( sprintf( _n( '%d block', '%d blocks', $ajs_page['count'], 'component-kitchen-sink' ), $ajs_page['count'] ) );
						if ( $ajs_page['edit_url'] ) {
							echo ' &middot; <a href="' . esc_url( $ajs_page['edit_url'] ) . '">' . esc_html__( 'Edit', 'component-kitchen-sink' ) . '</a>';
						}
						?>
					</small>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
</div>
