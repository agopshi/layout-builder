<?php

require_once __DIR__ . '/init.php';

require_once LB_LIB . 'DataStorage.php';

/**
 * Perform example data storage.
 */
class ExampleDataStorage extends LayoutBuilder\DataStorage
{
	public function store($id, $data)
	{
		$dir = LB_ROOT . 'public/example/storage';
		@mkdir($dir, 0777, true);

		if ($id === null)
		{
			// terrible algorithm to find next available ID (only for example purposes)
			$files = glob($dir . '/storage_*.json');
			
			if (!$files)
			{
				// no existing storages
				$id = 0;
			}
			else
			{
				// grab all of the ids from the existing files
				$ids = array();

				foreach ($files as $file)
				{
					$matches = array();
					if (preg_match('#storage_([0-9]+)\.json$#', $file, $matches))
					{
						$ids[] = (int)$matches[1];
					}
				}

				// grab the next ID
				$id = max($ids) + 1;
			}
		}

		$json = json_encode($data);

		file_put_contents($dir . '/storage_' . $id . '.json', $json);

		return $id;
	}
}

return new ExampleDataStorage();
