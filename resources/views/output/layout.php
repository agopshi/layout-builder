<?php
$rows = $args['rows'];

foreach ($rows as $row)
{
	echo LayoutBuilder\view('output/row', array(
		'row' => $row,
		'elementProvider' => $args['elementProvider']
	));
}
