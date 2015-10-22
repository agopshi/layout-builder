<?php

namespace LayoutBuilder;

require_once __DIR__ . '/Exception.php';

class Element
{
	protected $_code = '';
	protected $_render = null;
	protected $_extra = array();

	public function __construct($code, $render, $extra = array())
	{
		if (!is_callable($render))
		{
			throw new InvalidArgumentException('$render must be callable!');
		}

		$this->_code = $code;
		$this->_render = $render;
		$this->_extra = $extra;
	}

	public function render($values)
	{
		return call_user_func_array($this->_render, array($values));
	}

	public function getFields()
	{
		if (isset($this->_extra['fields']))
		{
			return $this->_extra['fields'];
		}

		return array();
	}

	public function getCode()
	{
		return $this->_code;
	}

	public function getLabel()
	{
		if (isset($this->_extra['label']))
		{
			return $this->_extra['label'];
		}

		return ucfirst($this->_code);
	}
}
