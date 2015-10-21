<?php

require_once __DIR__ . '/init.php';
require_once LB_LIB . 'Config.php';

$config = new LayoutBuilder\Config();

$config->setBaseUrl('/layout-builder/');
$config->setRouteHandlerUrl('/layout-builder/public/example/route_handler.php');

// add example front-end styles
$config->addStyle($config->getPublicUrl('css/example.css'));

return $config;
