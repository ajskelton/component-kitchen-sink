<?php
/**
 * Render callback for the AlignmentMatrixControl block
 *
 * @var array $attributes
 * @var string $content
 * @var WP_Block $block
 */

$alignment_matrix = $attributes['alignmentMatrix'] ?? '';

?>
<p <?php echo get_block_wrapper_attributes(); ?>>
	<?php echo sprintf( 'The value of the alignmentMatrix attribute is: %s', $alignment_matrix ) ?>
</p>
