<?php

namespace LayoutBuilder;

class Config
{
	protected $_baseUrl = '/';
	protected $_routeHandlerUrl = '/';
	protected $_styles = array();
	protected $_scripts = array();
	protected $_languages = array(
		array(
			'label' => 'English',
			'code' => 'en'
		)
	);

	public function __construct()
	{
	}

	public function setBaseUrl($baseUrl)
	{
		// ensure base URL always ends with a trailing slash
		$this->_baseUrl = rtrim($baseUrl, '/') . '/';
	}

	public function getBaseUrl()
	{
		return $this->_baseUrl;
	}

	public function getPublicUrl($path = '')
	{
		return $this->getBaseUrl() . 'public/' . $path;
	}

	public function setRouteHandlerUrl($routeHandlerUrl)
	{
		$this->_routeHandlerUrl = $routeHandlerUrl;
	}

	public function getRouteHandlerUrl()
	{
		return $this->_routeHandlerUrl;
	}

	public function addStyle($style)
	{
		$this->_styles[] = $style;
	}

	public function addScript($script)
	{
		$this->_scripts[] = $script;
	}

	public function getStyles()
	{
		return $this->_styles;
	}

	public function getScripts()
	{
		return $this->_scripts;
	}
	
	public function setLanguages($languages)
	{
		$this->_languages = $languages;
	}
	
	public function getLanguages()
	{
		return $this->_languages;
	}
	
	public function getLanguagesJson()
	{
		return json_encode($this->getLanguages());
	}
}
