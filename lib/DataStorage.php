<?php

namespace LayoutBuilder;

abstract class DataStorage
{
	public function __construct()
	{
	}

	abstract public function store($id, $data);
}
