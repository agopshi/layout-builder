<?php

require_once __DIR__ . '/inc/init.php';
require_once __DIR__ . '/inc/load.php';
require_once LB_LIB . 'Builder.php';

$config = require __DIR__ . '/inc/config.php';
$elementProvider = require __DIR__ . '/inc/element_provider.php';

$builder = new LayoutBuilder\Builder($config, $elementProvider);

// load data from example storage
$data = load();

$builder->render($data->id, null, null, $data->state);
