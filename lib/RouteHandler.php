<?php

namespace LayoutBuilder;

require_once __DIR__ . '/Exception.php';
require_once __DIR__ . '/Output.php';

class RouteHandler
{
	protected $_elementProvider;
	protected $_dataStorage;

	protected function _sanitizeIdentifier($str)
	{
		return preg_replace('#[^a-zA-Z_\-]#', '', $str);
	}

	protected function _prepareJsonOutput()
	{
		header('Content-Type', 'application/json');
	}

	public function __construct($elementProvider, $dataStorage)
	{
		$this->_elementProvider = $elementProvider;
		$this->_dataStorage = $dataStorage;
	}

	/**
	 * Dispatches a Layout Builder route. Expects input to be provided as JSON in the POST body.
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

	/**
	 * Given an element type and element data, returns the rendered HTML for that element.
	 * @param  object $data Request data (element type and data).
	 * @return void       
	 */
	public function handle_renderElement($data)
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

	/**
	 * Given an element type, returns the fields definition for that element.
	 * @param  object $data Request data (element type).
	 * @return void       
	 */
	public function handle_getElementFields($data)
	{
		if (empty($data->elementType))
		{
			throw new RouteException('Element type not provided!');
		}

		$elementType = $this->_sanitizeIdentifier($data->elementType);

		$this->_prepareJsonOutput();

		$fields = $this->_elementProvider->get($elementType)->getFields();
		echo json_encode($fields);
	}

	/**
	 * Given an identifier and a save state, stores that save state.
	 * @param  object $data Request data (id and save state).
	 * @return void       
	 */
	public function handle_save($data)
	{
		if (empty($data->state))
		{
			throw new RouteException('Save state not provided!');
		}

		$id = isset($data->id) ? $data->id : null;

		$this->_prepareJsonOutput();

		$newId = $this->_dataStorage->store($id, $data->state);
		
		echo json_encode(array(
			'status' => 'success',
			'id' => $newId
		));
	}
}
