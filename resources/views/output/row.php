<?php
$elementProvider = $args['elementProvider'];
$row = $args['row'];
?>

<?php if ($row->type === 'row'): ?>
	<div class="row">
		<?php foreach ($row->cols as $col): ?>
			<div class="col-<?php echo $col->bp;?>-<?php echo $col->size; ?>">
				<?php
				echo LayoutBuilder\view('output/layout', array(
					'rows' => $col->rows,
					'elementProvider' => $args['elementProvider']
				));
				?>
			</div>
		<?php endforeach; ?>
	</div>
<?php else: ?>
	<?php echo $elementProvider->get($row->type)->render($row->data->en); ?>
<?php endif;
