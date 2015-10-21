<?php

require_once __DIR__ . '/inc/init.php';
require_once __DIR__ . '/inc/data_storage.php';
require_once __DIR__ . '/inc/file_uploader.php';
require_once LB_LIB . 'RouteHandler.php';

$config = require __DIR__ . '/inc/config.php';
$elementProvider = require __DIR__ . '/inc/element_provider.php';

$dataStorage = new ExampleDataStorage();
$fileUploader = new ExampleFileUploader($config);

$routeHandler = new LayoutBuilder\RouteHandler(
	$elementProvider,
	$dataStorage,
	$fileUploader
);

$routeHandler->dispatch();
