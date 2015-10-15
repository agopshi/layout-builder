<?php

require_once __DIR__ . '/init.php';

require_once LB_LIB . 'FileUploader.php';

/**
 * Perform example file uploads. This example doesn't check for file name collisions, etc.
 */
class ExampleFileUploader extends LayoutBuilder\FileUploader
{
	public function upload($info)
	{
		$dir = LB_ROOT . 'public/example/uploads';
		@mkdir($dir, 0777, true);

		$fileName = $info['fileName'];
		$tmpFileName = $info['tmpFileName'];

		move_uploaded_file($tmpFileName, $dir . '/' . $fileName);

		return LB_PUBLIC_URL . 'public/example/uploads/' . $fileName;
	}
}

return new ExampleFileUploader();
