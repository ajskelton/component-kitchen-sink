<?php
/**
 * Server render for the ajs/height-control block (HeightControl).
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<h3><?php echo esc_html( 'HeightControl' ); ?></h3>
	<pre><?php echo esc_html( (string) wp_json_encode( $attributes, JSON_PRETTY_PRINT ) ); ?></pre>
</div>
