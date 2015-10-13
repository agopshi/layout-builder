(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	function elementOptionsController($scope, $modalInstance, elem)
	{
		$scope.elementTypes = app.ELEMENT_TYPES;
		
		$scope.elem = elem;

		$scope.elem.fields = {};

		$scope.update = function() {
			$modalInstance.close($scope.elem);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

	module.controller('ElementOptionsController', [
		'$scope',
		'$modalInstance',
		'elem',
		elementOptionsController
	]);
})(angular);
