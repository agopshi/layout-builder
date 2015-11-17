<?php
$elementProvider = $args['elementProvider'];
$language = $args['language'];
$row = $args['row'];
?>

<div class="row">
	<?php foreach ($row->cols as $col): ?>
		<div class="col-<?php echo $col->bp;?>-<?php echo $col->size; ?>">
			<?php
			echo LayoutBuilder\view('output/layout', array(
				'elementProvider' => $elementProvider,
				'language' => $language,
				'rows' => $col->rows,
				'isRoot' => false
			));
			?>
		</div>
	<?php endforeach; ?>
</div>
