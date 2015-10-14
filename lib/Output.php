<?php

namespace LayoutBuilder;

require_once __DIR__ . '/../app/config.php';

require_once LB_APP . 'views.php';

class Output
{
	protected $_elementProvider;

	public function __construct($elementProvider)
	{
		$this->_elementProvider = $elementProvider;
	}

	public function render($state)
	{
		echo view('header');

		echo view('output', array(
			'elementProvider' => $this->_elementProvider,
			'state' => $state
		));

		echo view('footer');
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
