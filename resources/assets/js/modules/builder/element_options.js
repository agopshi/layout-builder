(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder;

	function elementOptionsController($scope, $http, $modalInstance, elem)
	{
		$scope.elem = elem;
		$scope.elementTypes = app.ELEMENT_TYPES;

		elem.fields = null;

		// load the element fields at start and when its type changes
		$scope.$watch('elem.type', loadFields);

		function loadFields()
		{
			$http({
				method: 'POST',
				url: app.ROUTE_URL,
				data: {
					action: 'getElementFields',
					elementType: elem.type
				}
			}).then(function(resp) {
				elem.fields = resp.data;
			}).catch(function(error) {
				alert('Oops, failed to retrieve element fields! Please try again. Error: ' + error);
			});
		}

		$scope.update = function() {
			$modalInstance.close(elem);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

	module.controller('ElementOptionsController', [
		'$scope',
		'$http',
		'$modalInstance',
		'elem',
		elementOptionsController
	]);
})(angular);
