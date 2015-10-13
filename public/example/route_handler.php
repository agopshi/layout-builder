<?php

require_once __DIR__ . '/inc/init.php';

require_once LB_LIB . 'RouteHandler.php';

$elementProvider = require __DIR__ . '/inc/element_provider.php';

$routeHandler = new LayoutBuilder\RouteHandler($elementProvider);

$routeHandler->dispatch();
