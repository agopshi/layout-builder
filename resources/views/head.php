<?php $config = $args['config']; ?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">

		<?php $styles = $config->getStyles(); ?>
		<?php foreach ($styles as $style): ?>
			<link rel="stylesheet" href="<?php echo $style; ?>" />
		<?php endforeach; ?>

		<link rel="stylesheet" href="<?php echo $config->getPublicUrl('css/main.css'); ?>" />
	</head>

	<body>
		