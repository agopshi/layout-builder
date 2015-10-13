<?php

namespace LayoutBuilder;

require_once __DIR__ . '/Exception.php';
require_once __DIR__ . '/Output.php';

class RouteHandler
{
	protected $_elementProvider;

	protected function _sanitizeIdentifier($str)
	{
		return preg_replace('#[^a-zA-Z_\-]#', '', $str);
	}

	protected function _prepareJsonOutput()
	{
		header('Content-Type', 'application/json');
	}

	public function __construct($elementProvider)
	{
		$this->_elementProvider = $elementProvider;
	}

	/**
	 * Dispatches a Layout Builder route.
	 * @param  array &$data POSTed data. Typically just $_POST.
	 * @return void        
	 */
	public function dispatch(&$data)
	{
		if (empty($data['action']))
		{
			throw new RouteException('No action specified!');;
		}

		$action = $this->_sanitizeIdentifier($data['action']);

		$method = 'handle_' . $action;

		if (!method_exists($this, $method))
		{
			throw new RouteException('Action ' . $action . ' does not exist!');
		}

		$this->$method($data);
	}

	public function handle_renderElement(&$data)
	{
		if (empty($data['element_type']))
		{
			throw new RouteException('Element type not provided!');
		}

		$elementType = $this->_sanitizeIdentifier($data['element_type']);

		$elementData = null;

		if (!empty($data['element_data']))
		{
			if (!is_string($data['element_data']))
			{
				throw new RouteException('Element data not provided as a JSON string!');
			}

			$elementData = json_decode($data['element_data'], false);

			if ($elementData === false)
			{
				throw new RouteException('Element data not valid JSON!');
			}
		}

		$this->_prepareJsonOutput();

		$output = new Output($this->_elementProvider);

		echo $output->renderElement($elementType, $elementData);
	}
}
