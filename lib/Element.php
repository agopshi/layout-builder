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

	/**
	 * Render the element.
	 * @param  object $values Object containing all of the values of this element instance.
	 * @param  object $inst   Optional, may contain the actual element instance, or may be null.
	 * @return string         Rendered HTML.
	 */
	public function render($values, $inst = null, $language = null)
	{
		return call_user_func_array($this->_render, array($values, $inst, $language));
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
