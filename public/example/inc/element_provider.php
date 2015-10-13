<?php

require_once __DIR__ . '/init.php';

require_once LB_LIB . 'ElementProvider.php';
require_once LB_LIB . 'RouteHandler.php';

$elementProvider = new LayoutBuilder\ElementProvider();

/**
 * Register some example elements.
 */
$elementProvider->register('lorem', function() {
	return '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque rutrum massa sit amet mi volutpat eleifend. Fusce egestas enim sit amet magna feugiat ultrices. In scelerisque magna risus, ac vehicula erat pellentesque in. Aenean vel purus ut dolor vestibulum semper quis ac augue.</p>';
});

$elementProvider->register('html', function($values) {
	return $values->html;
}, array(
	'html' => array(
		'type' => 'textarea',
		'label' => 'HTML'
	)
));

return $elementProvider;
