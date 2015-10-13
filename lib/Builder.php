<?php

namespace LayoutBuilder;

require_once __DIR__ . '/../app/config.php';

require_once LB_APP . 'views.php';

class Builder
{
	protected $_elementProvider;

	public function __construct($elementProvider)
	{
		$this->_elementProvider = $elementProvider;
	}

	public function render()
	{
		echo view('header');

		echo view('builder', array(
			'elementProvider' => $this->_elementProvider
		));

		echo view('footer');
	}
}
