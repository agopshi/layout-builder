<?php

namespace LayoutBuilder;

require_once __DIR__ . '/../app/config.php';
require_once LB_APP . 'views.php';
require_once __DIR__ . '/Element.php';
require_once __DIR__ . '/Exception.php';

class ElementProvider
{
	protected $_elements = array();

	public function __construct()
	{
		/**
		 * Register default row element, which just renders its columns. Note that this is only
		 * used by LayoutBuilder\Output. It is not used by LayoutBuilder\Builder.
		 */
		// workaround for $this not available in PHP 5.3.0
		$elementProvider = $this;
		$this->register('row', function($values, $inst, $language) use ($elementProvider) {
			return view('output/row', array(
				'elementProvider' => $elementProvider,
				'language' => $language,
				'row' => $inst
			));
		});
	}

	/**
	 * Register simple element by code, render function, and extra information.
	 */
	public function register($code, $render, $extra = array())
	{
		$this->registerInstance(new Element($code, $render, $extra));
	}

	/**
	 * Register complex element by class. Class must subclass Element.
	 */
	public function registerClass($class)
	{
		$this->registerInstance(new $class());
	}

	/**
	 * Register complex element by instance. Instance must be a subclass of Element.
	 */
	public function registerInstance(Element $inst)
	{
		$this->_elements[$inst->getCode()] = $inst;
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
