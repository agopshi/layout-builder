<div ng-app="app.builder">
	<?php
	echo LayoutBuilder\view('builder/templates/fields');
	echo LayoutBuilder\view('builder/templates/layout');

	echo LayoutBuilder\view('builder/core');
	?>
</div>

<?php
echo LayoutBuilder\view('builder/scripts');
