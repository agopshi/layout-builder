<?php

namespace LayoutBuilder;

class ElementProvider
{
	protected static $_elements = array();

	public static function register($code, $render, $fields)
	{
		$element = new stdClass();
		$element->render = $render;
		$element->fields = $fields;

		static::$_elements[$code] = $element;
	}

	public static function get($code)
	{
		if (!isset(static::$_elements[$code]))
		{
			throw new \Exception('Element ' . $code . ' not registered!');
		}

		return static::$_elements[$code];
	}

	public static function render($code, $values)
	{
		return static::get($code)->render($values);
	}

	public static function fields($code)
	{
		return static::get($code)->fields;
	}
}
