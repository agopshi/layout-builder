<?php
$rows = $args['state']->rows;
?>

<div class="container-fluid">
	<?php
	echo LayoutBuilder\view('output/layout', array(
		'rows' => $rows,
		'elementProvider' => $args['elementProvider']
	));
	?>
</div>
