<?php

namespace LayoutBuilder;

require_once __DIR__ . '/../app/config.php';

require_once LB_APP . 'views.php';

class Builder
{
	protected $_config;
	protected $_elementProvider;

	public function __construct($config, $elementProvider)
	{
		$this->_config = $config;
		$this->_elementProvider = $elementProvider;
	}

	public function render($id, $meta, $metaFields, $state)
	{
		echo view('header', array(
			'config' => $this->_config
		));

		echo view('builder', array(
			'config' => $this->_config,
			'elementProvider' => $this->_elementProvider,
			'id' => $id,
			'meta' => $meta,
			'metaFields' => $metaFields,
			'state' => $state
		));

		echo view('footer');
	}
}
