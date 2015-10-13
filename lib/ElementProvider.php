<?php

namespace LayoutBuilder;

require_once __DIR__ . '/Exception.php';

class Element
{
	protected $_code = '';
	protected $_render = null;
	protected $_fields = array();

	public function __construct($code, $render, $fields = null)
	{
		if (!is_callable($render))
		{
			throw new InvalidArgumentException('$render must be callable!');
		}

		$this->_code = $code;
		$this->_render = $render;
		$this->_fields = $fields;
	}

	public function render($values)
	{
		return call_user_func_array($this->_render, array($values));
	}

	public function getFields()
	{
		return $this->_fields;
	}
}

class ElementProvider
{
	protected $_elements = array();

	public function __construct()
	{
	}

	public function register($code, $render, $fields = null)
	{
		$this->_elements[$code] = new Element($code, $render, $fields);
	}

	public function get($code)
	{
		if (!isset($this->_elements[$code]))
		{
			throw new Exception('Element ' . $code . ' not registered!');
		}

		return $this->_elements[$code];
	}
}
