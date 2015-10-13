<div ng-app="app.builder">
	<?php
	echo LayoutBuilder\view('builder/templates/fields');
	echo LayoutBuilder\view('builder/templates/layout');
	echo LayoutBuilder\view('builder/templates/layout/row');
	echo LayoutBuilder\view('builder/templates/element_picker');
	echo LayoutBuilder\view('builder/templates/element_options');

	echo LayoutBuilder\view('builder/core');
	?>
</div>

<?php
echo LayoutBuilder\view('builder/scripts', array(
	'elementProvider' => $args['elementProvider']
));
