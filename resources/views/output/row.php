<?php
$elementProvider = $args['elementProvider'];
$language = $args['language'];
$row = $args['row'];
?>

<div class="row">
	<?php foreach ($row->cols as $col): ?>
		<?php
		// default
		$class = 'col-sm-12';
		// old data version is using both 'bp' and 'size' that define a single breakpoint class.
		// new data version is using 'bps' to define multiple breakpoints in a space delimited string.
		if (isset($col->bps))
		{
			// new version
			$bps = array_filter(preg_split('/\s+/', trim($col->bps)));
			$bps = $col->bps;
			
			if (preg_match_all('/(?:xs|sm|md|lg)\-(?:[0-9]+)/', $bps, $matches, PREG_SET_ORDER))
			{
				$bps = array();
				foreach ($matches as $m)
				{
					$bps[] = $m[0];
				}
				
				if (count($bps))
				{
					$class = 'col-' . implode(' col-', $bps);
				}
			}
			
		}
		elseif (isset($col->bp) && isset($col->size))
		{
			// old version
		}
		?>
		<div class="<?php echo $class; ?>">
			<?php
			echo LayoutBuilder\view('output/layout', array(
				'elementProvider' => $elementProvider,
				'language' => $language,
				'rows' => $col->rows,
				'isRoot' => false
			));
			?>
		</div>
	<?php endforeach; ?>
</div>
