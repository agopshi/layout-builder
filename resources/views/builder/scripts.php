<?php
$config = $args['config'];
$elementProvider = $args['elementProvider'];
$elementTypesJson = $elementProvider->getTypesJson();

$id = $args['id'];
$meta = $args['meta'];
$metaFields = $args['metaFields'];
$state = $args['state'];
?>

<script>
	window.layoutBuilder = {
		modules: {},

		ROUTE_URL: '<?php echo $config->getRouteHandlerUrl(); ?>',

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

		load: {
			id: <?php echo json_encode($id); ?>,
			meta: <?php echo json_encode($meta); ?>,
			metaFields: <?php echo json_encode($metaFields); ?>,
			state: <?php echo json_encode($state); ?>
		}
	};
</script>

<script>
    var CKEDITOR_BASEPATH = '<?php echo $config->getPublicUrl('ckeditor/'); ?>';
</script>
<script src="<?php echo $config->getPublicUrl('js/vendor.js'); ?>"></script>
<script src="<?php echo $config->getPublicUrl('js/modules/fields.js'); ?>"></script>
<script src="<?php echo $config->getPublicUrl('js/modules/builder.js'); ?>"></script>
