<?php

require_once __DIR__ . '/inc/init.php';

require_once LB_LIB . 'RouteHandler.php';

$elementProvider = require __DIR__ . '/inc/element_provider.php';
$dataStorage = require __DIR__ . '/inc/data_storage.php';
$fileUploader = require __DIR__ . '/inc/file_uploader.php';

$routeHandler = new LayoutBuilder\RouteHandler(
	$elementProvider,
	$dataStorage,
	$fileUploader
);

$routeHandler->dispatch();
