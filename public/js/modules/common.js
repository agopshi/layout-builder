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
