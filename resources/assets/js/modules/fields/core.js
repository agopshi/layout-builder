(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.fields = angular.module('lb.fields', [
			'ui.sortable',
			'localytics.directives',
			'ckeditor'
		]);

	module.service('lb.fields.config', function() {
		var config = {
			uploadUrl: '/'
		}
		return config;
	});
	
	/**
	 * Field directive.
	 */
	module.directive('lbField', ['lb.fields.config', function(config) {
		function link(scope, elem, attr)
		{
			if (typeof scope.field.show_if !== 'undefined')
			{
				scope.$watch(
					'values', 
					function(newValue, oldValue) {
						var b = false;
						
						try {
							b = scope.$eval(scope.field.show_if, scope.values);
						} catch (ex) {
							b = false;
						}
						
						if (b)
						{
							scope.show();
						}
						else
						{
							scope.hide();
						}
					},
					true
				);
			}
		}
		
		function controller($scope, $element)
		{
			$scope.hide = function() {
				$element.hide();
				$element.find('input, textarea, select').val();
				delete $scope.values[$scope.field.code];
			}
			
			$scope.show = function() {
				$element.show();
			}
		}
		
		return {
			link: link,
			scope: {
				field: '=lbField',
				values: '='
			},
			controller: ['$scope', '$element', controller]
		};
	}]);

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
			
			var html = "<select " + 
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

	module.directive('lbFieldsRadio', [ '$compile', '$sce', function($compile, $sce) {
		function link(scope, elem, attrs)
		{
			
			var hexRegex = new RegExp("#[0-9A-F]{3,6}", "i");
			var extras = false;
			for (x in scope.options) 
			{
				scope.options[x].title =  scope.options[x].label + ': ' + scope.options[x].value;

				var hexColor = hexRegex.test(scope.options[x].value.trim());				
				if (hexColor)
				{				
					extras = true;
					scope.options[x].label =  $sce.trustAsHtml('<span style="background-color: '+scope.options[x].value+'"></span>');
				}
				else
				{
					scope.options[x].label =  $sce.trustAsHtml(scope.options[x].value);
				}
			}

			if (extras)
			{
				var y = scope.options.length;
				scope.options[y] = {} ;
				scope.options[y].title =  'No Color';
				scope.options[y].label =  $sce.trustAsHtml('No Color');
				scope.options[y].value =  '';
				
			}

			var html = '<span ng-repeat="option in options" >' +
							'<input ng-model="$parent.model" type="radio" name="{{code}}" id="{{code + $index}}" ng-value="option.value" title="{{option.title}}" />' +
							'<label for="{{code + $index}}" ng-bind-html="option.label" title="{{option.title}}"></label>' +
						'</span>';

			// dynamically compile the HTML so that we don't put Angular into an infinite loop
			elem.replaceWith($compile(html)(scope));
		}

		return {
			link: link,
			scope: {
				options: '=',
				code: '=',
				model: '='
			}
		}
	}]);

})(angular);
