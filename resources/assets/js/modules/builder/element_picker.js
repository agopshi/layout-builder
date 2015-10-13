(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	function elementPickerController($scope, $modalInstance)
	{
		$scope.elementTypes = app.ELEMENT_TYPES;
		$scope.elementType = 'row';

		$scope.add = function() {
			$modalInstance.close($scope.elementType);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

	module.controller('ElementPickerController', [
		'$scope',
		'$modalInstance',
		elementPickerController	
	]);
})(angular);
