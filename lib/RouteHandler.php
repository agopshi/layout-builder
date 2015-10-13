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
	 * @return void        
	 */
	public function dispatch()
	{
		$dataStr = file_get_contents('php://input');
		$data = json_decode($dataStr, false);

		if ($data === false || !is_object($data))
		{
			throw new RouteException('Route data not properly formatted JSON!');
		}

		if (empty($data->action))
		{
			throw new RouteException('No action specified!');;
		}

		$action = $this->_sanitizeIdentifier($data->action);

		$method = 'handle_' . $action;

		if (!method_exists($this, $method))
		{
			throw new RouteException('Action ' . $action . ' does not exist!');
		}

		$this->$method($data);
	}

	public function handle_renderElement(&$data)
	{
		if (empty($data->elementType))
		{
			throw new RouteException('Element type not provided!');
		}

		$elementType = $this->_sanitizeIdentifier($data->elementType);

		$elementData = isset($data->elementData) ? $data->elementData : null;

		$this->_prepareJsonOutput();

		$output = new Output($this->_elementProvider);

		echo $output->renderElement($elementType, $elementData);
	}
}
