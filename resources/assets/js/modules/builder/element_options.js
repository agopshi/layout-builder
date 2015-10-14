(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder;

	function elementOptionsController($scope, $http, $modalInstance, elem, locale)
	{
		$scope.elementTypes = app.ELEMENT_TYPES;
		$scope.elem = elem;

		$scope.languages = locale.getLanguages();
		$scope.language = locale.getCurrentLanguage();

		// ensure that the element has a data object for each language
		locale.prepareData(elem.data);

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
		'locale',
		elementOptionsController
	]);
})(angular);
