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
					function() {
						// parse and evaluate the show_if Angular expression, providing
						// the values of the fields as the locals of the expression
						var b = false;
						
						try {
							b = scope.$eval(scope.field.show_if, scope.values);
						} catch (ex) {
							b = false;
						}
						
						return b;
					},
					function(newValue, oldValue) {
						// newValue is the value of the show_if expression
						if (newValue)
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
				if (!angular.isArray(scope.model))
				{
					scope.model = []; 			//Multiple select boxes need an array as the model.
				}
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

(function (root, factory) {
  // AMD
  if (typeof define === 'function' && define.amd) define(['angular'], factory);
  // Global
  else factory(angular);
}(this, function (angular) {

  angular
  .module('ckeditor', [])
  .directive('ckeditor', ['$parse', ckeditorDirective]);

  // Polyfill setImmediate function.
  var setImmediate = window && window.setImmediate ? window.setImmediate : function (fn) {
    setTimeout(fn, 0);
  };

  /**
   * CKEditor directive.
   *
   * @example
   * <div ckeditor="options" ng-model="content" ready="onReady()"></div>
   */

  function ckeditorDirective($parse) {
    return {
      restrict: 'A',
      require: ['ckeditor', 'ngModel'],
      controller: [
        '$scope',
        '$element',
        '$attrs',
        '$parse',
        '$q',
        ckeditorController
      ],
      link: function (scope, element, attrs, ctrls) {
        // get needed controllers
        var controller = ctrls[0]; // our own, see below
        var ngModelController = ctrls[1];

        // Initialize the editor content when it is ready.
        controller.ready().then(function initialize() {
          // Sync view on specific events.
          ['dataReady', 'change', 'blur', 'saveSnapshot'].forEach(function (event) {
            controller.onCKEvent(event, function syncView() {
              ngModelController.$setViewValue(controller.instance.getData() || '');
            });
          });

          controller.instance.setReadOnly(!! attrs.readonly);
          attrs.$observe('readonly', function (readonly) {
            controller.instance.setReadOnly(!! readonly);
          });

          // Defer the ready handler calling to ensure that the editor is
          // completely ready and populated with data.
          setImmediate(function () {
            $parse(attrs.ready)(scope);
          });
        });

        // Set editor data when view data change.
        ngModelController.$render = function syncEditor() {
          controller.ready().then(function () {
            controller.instance.setData(ngModelController.$viewValue || '');
          });
        };
      }
    };
  }

  /**
   * CKEditor controller.
   */

  function ckeditorController($scope, $element, $attrs, $parse, $q) {
    var config = $parse($attrs.ckeditor)($scope) || {};
    var editorElement = $element[0];
    var instance;
    var readyDeferred = $q.defer(); // a deferred to be resolved when the editor is ready

    // Create editor instance.
    if (editorElement.hasAttribute('contenteditable') &&
        editorElement.getAttribute('contenteditable').toLowerCase() == 'true') {
      instance = this.instance = CKEDITOR.inline(editorElement, config);
    }
    else {
      instance = this.instance = CKEDITOR.replace(editorElement, config);
    }

    /**
     * Listen on events of a given type.
     * This make all event asynchronous and wrapped in $scope.$apply.
     *
     * @param {String} event
     * @param {Function} listener
     * @returns {Function} Deregistration function for this listener.
     */

    this.onCKEvent = function (event, listener) {
      instance.on(event, asyncListener);

      function asyncListener() {
        var args = arguments;
        setImmediate(function () {
          applyListener.apply(null, args);
        });
      }

      function applyListener() {
        var args = arguments;
        $scope.$apply(function () {
          listener.apply(null, args);
        });
      }

      // Return the deregistration function
      return function $off() {
        instance.removeListener(event, applyListener);
      };
    };

    this.onCKEvent('instanceReady', function() {
      readyDeferred.resolve(true);
    });

    /**
     * Check if the editor if ready.
     *
     * @returns {Promise}
     */
    this.ready = function ready() {
      return readyDeferred.promise;
    };

    // Destroy editor when the scope is destroyed.
    $scope.$on('$destroy', function onDestroy() {
      // do not delete too fast or pending events will throw errors
      readyDeferred.promise.then(function() {
        instance.destroy(false);
      });
    });
  }
}));
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
