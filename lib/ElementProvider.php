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

class ElementProvider
{
	protected $_elements = array();

	public function __construct()
	{
		$this->register('row', function() {
			// rows are rendered manually, this only serves as a placeholder
		});
	}

	public function register($code, $render, $extra = array())
	{
		$this->_elements[$code] = new Element($code, $render, $extra);
	}

	public function get($code)
	{
		if (!isset($this->_elements[$code]))
		{
			throw new Exception('Element ' . $code . ' not registered!');
		}

		return $this->_elements[$code];
	}

	public function getTypes()
	{
		$types = array();

		foreach ($this->_elements as $element)
		{
			$types[] = array(
				'code' => $element->getCode(),
				'label' => $element->getLabel()
			);
		}

		return $types;
	}

	public function getTypesJson()
	{
		return json_encode($this->getTypes());
	}
}
