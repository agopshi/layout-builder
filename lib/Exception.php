<?php

namespace LayoutBuilder;

class Exception extends \Exception
{
	public function __construct($message)
	{
		parent::__construct($message);
	}
}

class InvalidArgumentException extends Exception
{
	public function __construct($message)
	{
		parent::__construct($message);
	}
}

class RouteException extends Exception
{
	public function __construct($message)
	{
		parent::__construct($message);
	}
}
