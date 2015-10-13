<?php

namespace LayoutBuilder;

function elem($arr, $key, $default = null)
{
	if (!is_array($arr))
	{
		$arr = (array)$arr;
	}
	
	if (array_key_exists($key, $arr))
	{
		return $arr[$key];
	}

	return $default;
}
