<?php
/**
 * Server render for the ajs/inserter block (Inserter).
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content (the rendered inner blocks).
 * @var WP_Block $block      Block instance.
 */

?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<h3><?php echo esc_html( 'Inserter' ); ?></h3>
	<div class="ajs-inner-blocks-content">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Already-rendered inner blocks. ?>
	</div>
	<pre><?php echo esc_html( (string) wp_json_encode( $attributes, JSON_PRETTY_PRINT ) ); ?></pre>
</div>
