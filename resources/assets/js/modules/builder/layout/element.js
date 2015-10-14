(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	module.directive('lbLayoutElement', ['$http', function($http) {
		function render(elem, domElem)
		{
			$http({
				method: 'POST',
				url: app.ROUTE_URL,
				data: {
					action: 'renderElement',
					elementType: elem.type,
					elementData: elem.data
				}
			}).then(function(resp) {
				domElem.html(resp.data);
			}).catch(function(error) {
				// TODO
			});
		}

		function link(scope, elem, attrs)
		{
			// render the element whenever its data changes
			scope.$watch('elem', function(oldValue, newValue) {
				// note that this will be called the first time without any changes
				render(scope.elem, elem);
			}, true);
		}

		return {
			scope: {
				elem: '=lbLayoutElement',
			},
			link: link
		};
	}]);
})(angular);
