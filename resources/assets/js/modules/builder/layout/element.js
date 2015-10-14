(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder;

	module.directive('lbLayoutElement', ['$http', 'locale', function($http, locale) {
		function render(elem, domElem, lang)
		{
			$http({
				method: 'POST',
				url: app.ROUTE_URL,
				data: {
					action: 'renderElement',
					elementType: elem.type,
					elementData: elem.data[lang]
				}
			}).then(function(resp) {
				domElem.html(resp.data);
			}).catch(function(error) {
				alert('Oops, failed to update element HTML! Please try again. Error: ' + error);
			});
		}

		function link(scope, elem, attrs)
		{
			// render the element whenever its data changes
			scope.$watch('elem', function(oldValue, newValue) {
				// note that this will be called the first time without any changes
				render(scope.elem, elem, locale.getCurrentLanguage());
			}, true);

			// render the element whenever the language is changed
			scope.$on('setCurrentLanguage', function(evt, lang) {
				render(scope.elem, elem, lang);	
			});
		}

		return {
			scope: {
				elem: '=lbLayoutElement',
			},
			link: link
		};
	}]);
})(angular);
