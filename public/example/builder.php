<?php

require_once __DIR__ . '/inc/init.php';

require_once LB_LIB . 'Builder.php';

$elementProvider = require __DIR__ . '/inc/element_provider.php';

$builder = new LayoutBuilder\Builder($elementProvider);

$builder->render();
