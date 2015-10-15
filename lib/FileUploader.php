<?php

namespace LayoutBuilder;

abstract class FileUploader
{
	public function __construct()
	{
	}

	abstract public function upload($info);
}
