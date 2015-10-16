<?php

require_once __DIR__ . '/init.php';

require_once LB_LIB . 'Config.php';

$config = new \LayoutBuilder\Config();

$adminUrl = 'admin.php?page=layout_builder';

$config->setBaseUrl('/layout-builder');
$config->setRouteHandlerUrl('/layout-builder/public/example/route_handler.php');

return $config;
