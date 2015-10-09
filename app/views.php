<?php

namespace LayoutBuilder;

function view($name, $args = array())
{
	$name = preg_replace('#[^a-zA-Z0-9_\-/]#', '', $name);

	$fileName = stream_resolve_include_path(LB_VIEWS . $name . '.php');

	if ($fileName === false)
	{
		throw new \Exception('Could not load view: ' . $name);
	}

	ob_start();

	require $fileName;

	return ob_get_clean();
}
