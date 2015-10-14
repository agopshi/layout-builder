<?php
$rows = $args['rows'];

foreach ($rows as $row)
{
	echo LayoutBuilder\view('output/row', array(
		'elementProvider' => $args['elementProvider'],
		'language' => $args['language'],
		'row' => $row
	));
}
