(function(angular) {
	var app = window.app,
		module = app.modules.builder = angular.module('app.builder', [
			'app.common',
			'ui.bootstrap',
			'ui.sortable'
		]);

	function config($httpProvider)
	{
		var headers = $httpProvider.defaults.headers;

		// send AJAX indicator
		headers.common['X-Requested-With'] = 'XMLHttpRequest';
	}

	module.config([
		'$httpProvider',
		config
	]);

	function mainController($scope, util)
	{
		/**
		 * $scope.state // state stack for undo/redo
		 *   state 0
		 *   state 1
		 *   state 2
		 *   current state // data for current state
		 *     rows // list of rows
		 *       row 0
		 *       row 1  <-----------------------------------------------------------------+
		 *         cols // list of columns                                                |
		 *           col 0                                                                |
		 *           col 1                                                                |
		 *             rows // list of rows OR elements in a column                       |
		 *               elem 1                                                           |
		 *               elem 2 // an element could also be a row, which would repeat  }--+
		 *               elem 3
		 *                 type
		 *                 data // data mapped by language
		 *                   en
		 *                   es
		 *                   de
		 *                     foo // data value in particular language
		 *                     bar
		 *                     baz
		 *                   
		 */
		$scope.states = [
			{
				rows: []
			}
		];

		$scope.state = $scope.states[0];

		$scope.pushState = function() {
			$scope.states.push(util.deepClone($scope.state));
		};

		$scope.popState = function() {
			if ($scope.states.length <= 1)
			{
				return;
			}
			$scope.states.pop();
			$scope.state = $scope.states[$scope.states.length - 1];
		};
	}

	module.controller('MainController', mainController, [
		'$scope',
		'util'
	]);
})(angular);

(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	function elementOptionsController($scope, $modalInstance, elem)
	{
		$scope.elementTypes = app.ELEMENT_TYPES;
		
		$scope.elem = elem;

		$scope.elem.fields = {};

		$scope.update = function() {
			$modalInstance.close($scope.elem);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

	module.controller('ElementOptionsController', [
		'$scope',
		'$modalInstance',
		'elem',
		elementOptionsController
	]);
})(angular);

(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	function elementPickerController($scope, $modalInstance)
	{
		$scope.elementTypes = app.ELEMENT_TYPES;
		$scope.elementType = 'row';

		$scope.add = function() {
			$modalInstance.close($scope.elementType);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

	module.controller('ElementPickerController', [
		'$scope',
		'$modalInstance',
		elementPickerController	
	]);
})(angular);

(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	/**
	 * Property editor directive
	 */
	module.directive('appFields', [function() {
		function controller($scope)
		{
		}

		return {
			templateUrl: '/builder/templates/fields.html',
			scope: {
				fields: '=appFields',
				values: '='
			},
			controller: ['$scope', controller]
		};
	}]);

	module.directive('appFieldsNested', ['$compile', function($compile) {
		function link(scope, elem, attrs)
		{
			var html = '<div app-fields="fields" values="values"></div>';

			// dynamically compile the HTML so that we don't put Angular into an infinite loop
			$compile(html)(scope, function(innerElem, scope) {
				elem.append(innerElem);
			});
		}

		return {
			link: link,
			scope: {
				fields: '=appFieldsNested',
				values: '='
			}
		};
	}]);
})(angular);

(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	module.directive('appLayout', [function() {
		function controller($scope, $uibModal)
		{
			function createRow(type)
			{
				if (typeof type !== 'string')
				{
					type = 'row';
				}

				return {
					type: type,

					// for rows
					cols: [],

					// for element types other than row
					data: {}
				};
			}

			$scope.addRow = function() {
				var modal = $uibModal.open({
					animation: false,
					templateUrl: '/templates/builder/element_picker.html',
					controller: 'ElementPickerController',
					resolve: {
						// parameters to controller as functions
					}
				});

				modal.result
					.then(function(result) {
						$scope.rows.push(createRow(result));
					})
					.catch(function(reason) {
						// element picker was canceled
					});
			};

			$scope.removeRow = function(idx) {
				$scope.rows.splice(idx, 1);
			};

			$scope.rowSortable = {
				handle: '.lb-meta',
				connectWith: '.lb-rows'
			};
		}

		return {
			templateUrl: '/builder/templates/layout.html',
			scope: {
				rows: '=appLayout'
			},
			controller: ['$scope', '$uibModal', controller]
		};
	}]);

	module.directive('appLayoutNested', ['$compile', function($compile) {
		function link(scope, elem, attrs)
		{
			var html = '<div app-layout="rows"></div>';

			// dynamically compile the HTML so that we don't put Angular into an infinite loop
			$compile(html)(scope, function(innerElem, scope) {
				elem.append(innerElem);
			});
		}

		return {
			link: link,
			scope: {
				rows: '=appLayoutNested'
			}
		};
	}]);
})(angular);

(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	module.directive('appLayoutElement', ['$http', function($http) {
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
			scope.$watch(scope.elem, function(oldValue, newValue) {
				// note that this will be called the first time without any changes
				render(scope.elem, elem);
			}, true);
		}

		return {
			scope: {
				elem: '=appLayoutElement',
			},
			link: link
		};
	}]);
})(angular);

(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	module.directive('appLayoutRow', ['$uibModal', function($uibModal) {
		function createCol()
		{
			return {
				bp: 'sm',
				size: 6,
				rows: []
			}
		}

		function controller($scope)
		{
			$scope.addColumn = function(idx) {
				var cols = $scope.row.cols,
					col = createCol();

				if (typeof idx === 'number')
				{
					cols.splice(idx, 0, col);
				}
				else
				{
					cols.push(col);
				}
			};

			$scope.removeColumn = function(idx) {
				$scope.row.cols.splice(idx, 1);
			};

			$scope.edit = function() {
				var modal = $uibModal.open({
					animation: false,
					templateUrl: '/templates/builder/element_options.html',
					controller: 'ElementOptionsController',
					resolve: {
						elem: function() {
							// edit a copy of the element in case the user wants to cancel
							return angular.copy($scope.row);
						}
					}
				});

				modal.result
					.then(function(elem) {
						// on success, copy over the updated values
						$scope.row.type = elem.type;
						$scope.row.data = elem.data;
					})
					.catch(function(reason) {
						// element options dialog was canceled
					});
			};

			$scope.colBps = app.COL_BPS;
			$scope.colSizes = app.COL_SIZES;

			$scope.colSortable = {
				handle: '.lb-meta',
				connectWith: '.lb-cols'
			};
		}

		return {
			templateUrl: '/builder/templates/row.html',
			scope: {
				row: '=appLayoutRow',
				remove: '&'
			},
			controller: ['$scope', controller]
		};
	}]);
})(angular);
