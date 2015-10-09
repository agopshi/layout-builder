(function(angular) {
	var app = window.app,
		module = app.modules.common = angular.module('app.common', []);

	/**
	 * Klass utility
	 */
	module.factory('klass', [function() {
		var klass = {};

		/**
		 * Wraps the new operator to allow calling a constructor using an arguments array.
		 * 
		 * For example, the two instantiations below are equivalent:
		 * 	var obj1 = new SomeClass(arg1, arg2),
		 *  	obj2 = klass.construct(SomeClass, [arg1, arg2])
		 */
		klass.construct = function(constructor, args) {
			function Wrapper()
			{
				// call the original constructor on this object
				return constructor.apply(this, args);
			}

			// give the wrapper the same prototype as the original constructor
			Wrapper.prototype = constructor.prototype;

			// instantiate the wrapper
			return new Wrapper();
		};

		/**
		 * Wraps the parent class constructor so that it is not called during prototype assignment.
		 * 
		 * For example, this would call the parent class constructor twice:
		 * 	function Child() { Parent.call(this); }
		 * 	Child.prototype = new Parent();
		 * 	
		 * However, this would call the parent class constructor only once:
		 * 	function Child() { Parent.call(this); }
		 * 	Child.prototype = klass.inherit(Parent);
		 */
		klass.inherit = function(parentClass) {
			function Wrapper()
			{
			}

			Wrapper.prototype = parentClass.prototype;

			return new Wrapper();
		};

		return klass;
	}]);

	/**
	 * Property editor directive
	 */
	module.directive('appPropertyEditor', ['$filter', '$sce', function($filter, $sce) {
		return {
			templateUrl: '/templates/property-editor.html',
			scope: {
				properties: '=',
				meta: '=?',
				context: '=?',
				filter: '=?',
				listener: '=?'
			},
			controller: ['$scope', function($scope) {
				if (typeof $scope.context === 'undefined')
				{
					$scope.context = $scope;
				}

				if (typeof $scope.filter !== 'function')
				{
					$scope.filter = function() {
						return true;
					};
				}
				else
				{
					// wrap the filter function to use the provided context
					$scope.filter = $scope.filter.bind($scope.context);
				}

				// meta data about the fields
				$scope.meta = $scope.meta || {};

				// this is a map defining which nested editors to show or hide
				$scope.show = {};

				// this is a map defining which descriptions to show
				//$scope.showDesc = {};

				// this defines whether we're currently adding a property
				$scope.addingProperty = false;

				$scope.newProperty = function() {
					this.addingProperty = true;
				};

				$scope.addProperty = function() {
					// check for numeric properties
					if (!isNaN(this.propertyValue))
					{
						this.propertyValue = parseFloat(this.propertyValue);
					}

					switch (this.propertyValue)
					{
						// check for objects
						case '{}': this.propertyValue = {}; break;

						// check for arrays
						case '[]': this.propertyValue = []; break;

						// check for booleans
						case 'true': this.propertyValue = true; break;
						case 'false': this.propertyValue = false; break;
					}

					// add the property
					this.properties[this.propertyCode] = this.propertyValue;

					this.propertyCode = '';
					this.propertyValue = '';
					this.addingProperty = false;
				};

				/**
				 * Returns the deduced type of a given object. If meta data is present, tries to use it first.
				 */
				$scope.type = function(key, obj) {
					// check if there is an explicit type defined for the field
					if (this.m(key).type)
					{
						return this.m(key).type;
					}

					// check if it's an array
					if (Array.isArray(obj))
					{
						return 'array';
					}

					// check if it's a primitive type
					var type = typeof obj;

					if (type === 'string')
					{
						// check if it's a color
						if (/^#[0-9a-fA-F]{6}$/.test(obj))
						{
							return 'color';
						}

						// check if it's a number
						if (!isNaN(parseFloat(obj)))
						{
							/**
							 * @todo Fix exception in Angular due to string being passed into number input
							 */
							return 'number';
						}
					}

					// check if it's undefined
					if (type === 'undefined')
					{
						return 'string';
					}

					return type;
				};

				/**
				 * Returns an English label based on a snake case field key. If meta data is present, uses it first.
				 */
				$scope.label = function(key) {
					// check if there is an explicit label provided for the field
					if (this.m(key).label)
					{
						return this.m(key).label;
					}

					return $filter('words')(key);
				};

				/**
				 * Returns the meta data for a given field or an empty object if it does not exist.
				 */
				$scope.m = function(key) {
					return this.meta[key] || {};
				};

				/**
				 * If a listener was provided, watch the properties for changes and call the listener.
				 */
				if (typeof $scope.listener === 'function')
				{
					$scope.$watch('properties', function(current, prev) {
						if (current === prev)
						{
							return;
						}

						$scope.listener.apply($scope.context);
					}, true);
				}
			}]
		};
	}]);

	module.directive('appPropertyEditorNested', ['$compile', function($compile) {
		function link(scope, elem, attrs)
		{
			if (typeof scope.properties !== 'object')
			{
				// not a nested object, nothing to do here
				return;
			}

			var editorHtml = '<div class="editor_nested" app-property-editor properties="properties" meta="meta"></div>';

			// dynamically compile the editor HTML so that we don't put Angular into an infinite loop
			$compile(editorHtml)(scope, function(editorElem, scope) {
				elem.append(editorElem);
			});
		}

		return {
			link: link,
			scope: {
				properties: '=',
				meta: '=?'
			}
		};
	}]);

	module.directive('appPropertyEditorLabel', [function() {
		return {
			templateUrl: '/templates/property-editor-label.html',
			replace: true
		};
	}]);

	/**
	 * Unsafe HTML filter
	 */
	module.filter('unsafe', ['$sce', function($sce) {
		return $sce.trustAsHtml;
	}]);

	/**
	 * Util
	 */
	module.factory('util', [function() {
		var util = {};

		util.deepClone = function(obj) {
			return $.extend(true, {}, obj);
		};

		util.deepExtend = function(target, obj) {
			return $.extend(true, {}, target, obj);
		};

		return util;
	}]);
})(angular);
