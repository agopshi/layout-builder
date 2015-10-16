<div ng-app="lb.builder">
	<?php
	echo LayoutBuilder\view('templates/fields');
	
	echo LayoutBuilder\view('templates/builder/layout');
	echo LayoutBuilder\view('templates/builder/layout/row');
	echo LayoutBuilder\view('templates/builder/element_picker');
	echo LayoutBuilder\view('templates/builder/element_options');

	echo LayoutBuilder\view('builder/core');
	?>
</div>

<?php
echo LayoutBuilder\view('builder/scripts', array(
	'config' => $args['config'],
	'elementProvider' => $args['elementProvider'],
	'id' => $args['id'],
	'state' => $args['state']
));
