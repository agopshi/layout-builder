<?php

namespace LayoutBuilder;

function elem(&$arr, $key, $default = null)
{
	if (array_key_exists($key, $arr))
	{
		return $arr[$key];
	}

	return $default;
}
