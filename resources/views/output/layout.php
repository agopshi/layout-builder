<?php
$rows = $args['rows'];
$isRoot = $args['isRoot'];
?>
<?php foreach ($rows as $row): ?>
	<?php
	$openWrapper = $closeWrapper = '';
	if ($isRoot)
	{
		$openWrapper = '<div class="'. ((isset($row->fluidity) && $row->fluidity == 'fluid') ? 'container-fluid' : 'container') .'">';
		$closeWrapper = '</div>';
	}
	?>
	<?php echo $openWrapper; ?>
	<?php
	echo LayoutBuilder\view('output/element', array(
		'elementProvider' => $args['elementProvider'],
		'language' => $args['language'],
		'row' => $row
	));
	?>
	<?php echo $closeWrapper; ?>
<?php endforeach; ?>