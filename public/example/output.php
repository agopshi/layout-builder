<?php

require_once __DIR__ . '/inc/init.php';
require_once __DIR__ . '/inc/load.php';

require_once LB_LIB . 'Output.php';

$elementProvider = require __DIR__ . '/inc/element_provider.php';

$output = new LayoutBuilder\Output($elementProvider);

$data = load();

$output->render($data->state);
