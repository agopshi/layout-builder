<?php
$rows = $args['rows'];
$isRoot = $args['isRoot'];
?>
<?php foreach ($rows as $row): ?>
	<?php
	$openWrapper = $closeWrapper = '';
	if ($isRoot)
	{
		/*!
		 * Fluidity
		 * - Fluidity applies only to root elements
		 * - We can group root elements by two: layout element (div.row) and non-layout elements (widgets)
		 * - All root elements can be wrapped by container.
		 *
		 * - Bootstraps containers: div.container and div.container-fluid will always create gutters,
		 *   except we set the gutter to zero, we can't make an element take 100% body width without
		 *   edit/override bootstrap's div.container and div.container-fluid styles.
		 * - To make element take 100% body width, the element must be put outside of bootstrap grid (container/row).
		 *
		 * - Here we added div.container-full as container for 100% body width element. The purpose
		 *   is to keep the bootstrap as intact as possible.
		 *
		 * - Thus we now have three type of containers:
		 *   1. div.container. Centered, with max-width, container.
		 *   2. div.container-fluid. Full width with gutter.
		 *   3. div.container-full. Full width without gutter.
		 */
		$fluid = (isset($row->fluidity) && $row->fluidity == 'fluid') ? true : false;
		
		if (!$fluid)
		{
			$openWrapper = '<div class="container">';
			$closeWrapper = '</div>';
		}
		else
		{
			if ($row->type == 'row')
			{
				$openWrapper = '<div class="container-fluid">';
				$closeWrapper = '</div>';
			}
			else
			{
				$openWrapper = '<div class="container-full">';
				$closeWrapper = '</div>';
			}
		}
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