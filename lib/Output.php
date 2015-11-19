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

	public function render($state, $language)
	{
		echo view('output', array(
			'elementProvider' => $this->_elementProvider,
			'state' => $state,
			'language' => $language
		));
	}

	public function renderElement($type, $data = null, $editMode = false)
	{
		if ($data === null)
		{
			$data = new \stdClass();
		}
		
		$data->_edit_mode = $editMode;

		return $this->_elementProvider->get($type)->render($data);
	}
}
