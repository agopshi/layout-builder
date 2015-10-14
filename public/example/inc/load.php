<?php

require_once __DIR__ . '/init.php';

/**
 * Perform example data loading.
 */
function load($id = null)
{
	$ret = new stdClass();
	$ret->id = null;
	$ret->state = null;

	if ($id === null)
	{
		$id = isset($_GET['id']) ? (int)$_GET['id'] : null;
	}
	
	if ($id !== null)
	{
		$fileName = LB_ROOT . 'public/example/storage/storage_' . $id . '.json';
		if (file_exists($fileName))
		{
			$ret->id = $id;
			$ret->state = json_decode(file_get_contents($fileName));
		}
	}

	return $ret;
}
