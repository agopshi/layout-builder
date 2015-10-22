<?php
$rows = $args['rows'];

foreach ($rows as $row)
{
	echo LayoutBuilder\view('output/element', array(
		'elementProvider' => $args['elementProvider'],
		'language' => $args['language'],
		'row' => $row
	));
}
