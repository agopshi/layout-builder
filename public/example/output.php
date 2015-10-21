<?php

require_once __DIR__ . '/inc/init.php';
require_once __DIR__ . '/inc/load.php';
require_once LB_LIB . 'Output.php';

$config = require __DIR__ . '/inc/config.php';
$elementProvider = require __DIR__ . '/inc/element_provider.php';

$output = new LayoutBuilder\Output($elementProvider);

// load data from example storage
$data = load();

// provide an example language switcher via ?lang=
$lang = isset($_GET['lang']) ? $_GET['lang'] : 'en';

// normally, this would be the front-end's header, but we're going to load the layout builder's header in the example
// this is important so that we load the example stylesheet, which contains the grid styles
echo LayoutBuilder\view('header', array(
	'config' => $config
));

$output->render($data->state, $lang);

echo LayoutBuilder\view('footer');
