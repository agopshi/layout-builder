<?php

namespace LayoutBuilder;

class Output
{
	protected $_elementProvider;

	public function __construct($elementProvider)
	{
		$this->_elementProvider = $elementProvider;
	}

	public function renderElement($type, $data = null)
	{
		if ($data === null)
		{
			$data = new \stdClass();
		}

		return $this->_elementProvider->get($type)->render($data);
	}
}
