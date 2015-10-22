<?php
$elementProvider = $args['elementProvider'];
$row = $args['row'];

$data = new stdClass();

$languages = array(
	$args['language'],

	/**
	 * @todo How do we define the default language?
	 */
	'en'
);

foreach ($languages as $language)
{
	if (isset($row->data->$language))
	{
		$data = $row->data->$language;
		break;
	}
}

echo $elementProvider->get($row->type)

	// additional arguments are passed for the row renderer
	->render($data, $row, $args['language']);
