<?php
$rows = $args['state']->rows;
?>
<?php
echo LayoutBuilder\view('output/layout', array(
	'elementProvider' => $args['elementProvider'],
	'language' => $args['language'],
	'rows' => $rows,
	'isRoot' => true
));
?>