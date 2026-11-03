<?php
/**
 * Server render for the ajs/rich-text block (RichText).
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

$allowed_tags = array( 'p', 'h2', 'h3', 'div', 'blockquote' );
$tag_name     = in_array( $attributes['tagName'] ?? 'p', $allowed_tags, true ) ? $attributes['tagName'] : 'p';
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<h3><?php echo esc_html( 'RichText' ); ?></h3>
	<<?php echo tag_escape( $tag_name ); ?>><?php echo wp_kses_post( $attributes['content'] ?? '' ); ?></<?php echo tag_escape( $tag_name ); ?>>
	<pre><?php echo esc_html( (string) wp_json_encode( $attributes, JSON_PRETTY_PRINT ) ); ?></pre>
</div>
