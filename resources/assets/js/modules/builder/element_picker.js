(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	function elementPickerController($scope, $modalInstance)
	{
		/**
		 * @todo Abstract out. Element types are provided via application.
		 */
		$scope.elementTypes = [
			{
				label: 'Row',
				code: 'row'
			},
			{
				label: 'Lorem',
				code: 'lorem'
			}
		];

		$scope.elementType = 'row';

		$scope.add = function() {
			$modalInstance.close($scope.elementType);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

	module.controller('ElementPickerController', elementPickerController, [
		'$scope',
		'$modalInstance'
	]);
})(angular);
