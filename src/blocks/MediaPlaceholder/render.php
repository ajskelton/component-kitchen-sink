<?php
/**
 * Server render for the ajs/media-placeholder block (MediaPlaceholder).
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

$media_url = isset( $attributes['mediaUrl'] ) ? (string) $attributes['mediaUrl'] : '';
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<h3><?php echo esc_html( 'MediaPlaceholder' ); ?></h3>
	<?php if ( '' !== $media_url ) : ?>
		<img src="<?php echo esc_url( $media_url ); ?>" alt="" style="max-width: 100%; height: auto;" />
	<?php endif; ?>
	<pre><?php echo esc_html( (string) wp_json_encode( $attributes, JSON_PRETTY_PRINT ) ); ?></pre>
</div>
