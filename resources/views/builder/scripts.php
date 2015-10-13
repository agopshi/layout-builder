<script>
	window.app = {
		modules: {},

		ROUTE_URL: '<?php echo LB_PUBLIC_URL; ?>example/route_handler.php',

		/**
		 * @todo Abstract these out somewhere
		 */
		COL_BPS: ['xs', 'sm', 'md', 'lg'],
		COL_SIZES: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

		ELEMENT_TYPES: [
			{
				label: 'Row',
				code: 'row'
			},
			{
				label: 'Lorem',
				code: 'lorem'
			}
		]
	};
</script>

<script src="<?php echo LB_PUBLIC_URL; ?>js/vendor.js"></script>

<script src="<?php echo LB_PUBLIC_URL; ?>js/modules/common.js"></script>
<script src="<?php echo LB_PUBLIC_URL; ?>js/modules/builder.js"></script>
