(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.fields = angular.module('lb.fields', [
			'ui.sortable',
			'localytics.directives',
			'ngCkeditor'
		]);

	module.service('lb.fields.config', function() {
		var config = {
			uploadUrl: '/'
		}
		return config;
	});

	/**
	 * Fields editor directive.
	 */
	module.directive('lbFields', ['lb.fields.config', function(config) {
		function controller($scope, $http)
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

			$scope.upload = function(file, values, code) {
				if (!file)
				{
					values[code] = '';
					return;
				}

				$http({
					method: 'POST',
					url: config.uploadUrl,
					data: {
						action: 'upload',
						file: file
					},
					headers: {
						// delete the Content-Type header to force the browser to set it correctly
						'Content-Type': undefined
					},
					transformRequest: function(data, headersGetter) {
						var formData = new FormData();
						angular.forEach(data, function(value, key) {
							formData.append(key, value);
						});

						return formData;
					}
				}).then(function(resp) {
					values[code] = resp.data.url;
				}).catch(function(error) {
					alert('Oops, something went wrong! Please try again. Error: ' + error);
				})
			};
		}

		return {
			templateUrl: '/templates/fields.html',
			scope: {
				fields: '=lbFields',
				values: '='
			},
			controller: ['$scope', '$http', controller]
		};
	}]);

	/**
	 * Nested fields editor directive. Used to avoid infinite loops within Angular's template system.
	 */
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

	module.directive('lbFieldsUpload', [function() {
		function link(scope, elem, attrs)
		{
			elem.bind('change', function(evt) {
				scope.$apply(function() {
					var files = evt.target.files;

					if (files && files.length === 1)
					{
						scope.upload({
							file: files[0]
						});
					}
					else
					{
						scope.upload({
							file: undefined
						});
					}
				});
			});
		}

		return {
			link: link,
			scope: {
				upload: '&lbFieldsUpload'
			}
		}
	}]);

	module.directive('lbFieldsImgSrc', [function() {
		function link(scope, elem, attrs)
		{
			elem.on('load', function() {
				elem.show();
			});

			elem.on('error', function() {
				elem.hide();
			});

			scope.$watch('src', _.debounce(function(newValue, oldValue) {
				elem[0].src = newValue;
			}, 250));
		}

		return {
			link: link,
			scope: {
				src: '=lbFieldsImgSrc'
			}
		}
	}]);

	module.directive('lbFieldsSelect', [ '$compile', function($compile) {
		function link(scope, elem, attrs)
		{			
			
			var attributes = [];

			if (scope.isChosen)
			{
				attributes.push('chosen');				
			}

			if (scope.isMultiple)
			{
				attributes.push('multiple');
				scope.model = []; 			//Multiple select boxes need an array as the model.
			}
			
			attributes.push('ng-model="model"');
			attributes.push('ng-options="option.value as option.label for option in options"');
			
			html = "<select " + 
							attributes.join(" ") + 
						"></select>";			

			// dynamically compile the HTML so that we don't put Angular into an infinite loop								
			elem.replaceWith($compile(html)(scope));
			
		}

		return {
			link: link,
			scope: {				
				isChosen: '=',
				isMultiple: '=',
				options: '=',
				model: '='
			}
		}
	}]);
})(angular);
