<?php
$elementProvider = $args['elementProvider'];
$elementTypesJson = $elementProvider->getTypesJson();

$loadId = $args['id'];
$loadState = $args['state'];
?>

<script>
	window.layoutBuilder = {
		modules: {},

		ROUTE_URL: '<?php echo LB_PUBLIC_URL; ?>example/route_handler.php',

		/**
		 * @todo Abstract these out somewhere
		 */
		COL_BPS: ['xs', 'sm', 'md', 'lg'],
		COL_SIZES: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

		ELEMENT_TYPES: <?php echo $elementTypesJson; ?>,

		/**
		 * @todo Abstract these out somewhere
		 */
		LANGUAGES: [
			{
				label: 'English',
				code: 'en'
			},
			{
				label: 'Spanish',
				code: 'es'
			}
		],

		loadId: <?php echo json_encode($loadId); ?>,
		loadState: <?php echo json_encode($loadState); ?>
	};
</script>

<script src="<?php echo LB_PUBLIC_URL; ?>js/vendor.js"></script>
<script src="<?php echo LB_PUBLIC_URL; ?>js/modules/builder.js"></script>
