(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder;

	/**
	 * Property editor directive
	 */
	module.directive('lbFields', [function() {
		function controller($scope)
		{
			$scope.addItem = function(values, code) {
				// create the list of items if it doesn't already exist
				var items = values[code] = values[code] || [];

				// add an item
				// note that we don't care about the item's properties, the field group will define them
				items.push({});
			};

			$scope.removeItem = function(items, idx) {
				items.splice(idx, 1);
			};
		}

		return {
			templateUrl: '/builder/templates/fields.html',
			scope: {
				fields: '=lbFields',
				values: '='
			},
			controller: ['$scope', controller]
		};
	}]);

	module.directive('lbFieldsNested', ['$compile', function($compile) {
		function link(scope, elem, attrs)
		{
			var html = '<div lb-fields="fields" values="values"></div>';

			// dynamically compile the HTML so that we don't put Angular into an infinite loop
			$compile(html)(scope, function(innerElem, scope) {
				elem.append(innerElem);
			});
		}

		return {
			link: link,
			scope: {
				fields: '=lbFieldsNested',
				values: '='
			}
		};
	}]);
})(angular);
