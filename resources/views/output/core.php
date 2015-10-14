<?php
$rows = $args['state']->rows;
?>

<div class="container-fluid">
	<?php
	echo LayoutBuilder\view('output/layout', array(
		'elementProvider' => $args['elementProvider'],
		'language' => $args['language'],
		'rows' => $rows
	));
	?>
</div>
