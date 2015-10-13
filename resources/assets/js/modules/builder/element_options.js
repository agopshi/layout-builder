(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	function elementOptionsController($scope, $modalInstance)
	{
		$scope.update = function() {
			$modalInstance.close();
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

	module.controller('ElementOptionsController', elementOptionsController, [
		'$scope',
		'$modalInstance'
	]);
})(angular);
