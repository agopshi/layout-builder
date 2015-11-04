(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.fields = angular.module('lb.fields', [
			'ui.sortable',
			'localytics.directives'
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
})(angular);

// Generated by CoffeeScript 1.8.0
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module('localytics.directives', []);

  angular.module('localytics.directives').directive('chosen', [
    '$timeout', function($timeout) {
      var CHOSEN_OPTION_WHITELIST, NG_OPTIONS_REGEXP, isEmpty, snakeCase;
      NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
      CHOSEN_OPTION_WHITELIST = ['noResultsText', 'allowSingleDeselect', 'disableSearchThreshold', 'disableSearch', 'enableSplitWordSearch', 'inheritSelectClasses', 'maxSelectedOptions', 'placeholderTextMultiple', 'placeholderTextSingle', 'searchContains', 'singleBackstrokeDelete', 'displayDisabledOptions', 'displaySelectedOptions', 'width'];
      snakeCase = function(input) {
        return input.replace(/[A-Z]/g, function($1) {
          return "_" + ($1.toLowerCase());
        });
      };
      isEmpty = function(value) {
        var key;
        if (angular.isArray(value)) {
          return value.length === 0;
        } else if (angular.isObject(value)) {
          for (key in value) {
            if (value.hasOwnProperty(key)) {
              return false;
            }
          }
        }
        return true;
      };
      return {
        restrict: 'A',
        require: '?ngModel',
        terminal: true,
        link: function(scope, element, attr, ngModel) {
          var chosen, defaultText, disableWithMessage, empty, initOrUpdate, match, options, origRender, removeEmptyMessage, startLoading, stopLoading, valuesExpr, viewWatch;
          element.addClass('localytics-chosen');
          options = scope.$eval(attr.chosen) || {};
          angular.forEach(attr, function(value, key) {
            if (__indexOf.call(CHOSEN_OPTION_WHITELIST, key) >= 0) {
              return options[snakeCase(key)] = scope.$eval(value);
            }
          });
          startLoading = function() {
            return element.addClass('loading').attr('disabled', true).trigger('chosen:updated');
          };
          stopLoading = function() {
            return element.removeClass('loading').attr('disabled', false).trigger('chosen:updated');
          };
          chosen = null;
          defaultText = null;
          empty = false;
          initOrUpdate = function() {
            if (chosen) {
              return element.trigger('chosen:updated');
            } else {
              chosen = element.chosen(options).data('chosen');
              return defaultText = chosen.default_text;
            }
          };
          removeEmptyMessage = function() {
            empty = false;
            return element.attr('data-placeholder', defaultText);
          };
          disableWithMessage = function() {
            empty = true;
            return element.attr('data-placeholder', chosen.results_none_found).attr('disabled', true).trigger('chosen:updated');
          };
          if (ngModel) {
            origRender = ngModel.$render;
            ngModel.$render = function() {
              origRender();
              return initOrUpdate();
            };
            if (attr.multiple) {
              viewWatch = function() {
                return ngModel.$viewValue;
              };
              scope.$watch(viewWatch, ngModel.$render, true);
            }
          } else {
            initOrUpdate();
          }
          attr.$observe('disabled', function() {
            return element.trigger('chosen:updated');
          });
          if (attr.ngOptions && ngModel) {
            match = attr.ngOptions.match(NG_OPTIONS_REGEXP);
            valuesExpr = match[7];
            scope.$watchCollection(valuesExpr, function(newVal, oldVal) {
              var timer;
              return timer = $timeout(function() {
                if (angular.isUndefined(newVal)) {
                  return startLoading();
                } else {
                  if (empty) {
                    removeEmptyMessage();
                  }
                  stopLoading();
                  if (isEmpty(newVal)) {
                    return disableWithMessage();
                  }
                }
              });
            });
            return scope.$on('$destroy', function(event) {
              if (typeof timer !== "undefined" && timer !== null) {
                return $timeout.cancel(timer);
              }
            });
          }
        }
      };
    }
  ]);

}).call(this);
