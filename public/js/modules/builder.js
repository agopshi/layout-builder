(function(angular) {
	var app = window.app,
		module = app.modules.builder = angular.module('app.builder', [
			'app.common',
			'ui.bootstrap'
		]);

	function config($httpProvider)
	{
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
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
		 *             elems // list of elements in a column                              |
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

	module.directive('appLayout', [function() {
		function controller($scope)
		{
			function createRow()
			{
				return {
					cols: []
				};
			}

			$scope.addRow = function() {
				$scope.rows.push(createRow());
			};
		}

		return {
			templateUrl: '/builder/templates/layout.html',
			scope: {
				rows: '='
			},
			controller: ['$scope', controller]
		};
	}]);

	module.directive('appLayoutRow', [function() {
		function controller($scope)
		{
			function createCol()
			{
				return {
					bp: 'sm',
					size: 6,
					elems: []
				}
			}

			function createElem()
			{
				return {
					type: 'row',
					data: {},
					cols: []
				}
			};

			$scope.addElement = function(col) {
				col.elems.push(createElem());
			};

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

			$scope.COL_BPS = ['xs', 'sm', 'md', 'lg'];
			$scope.COL_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		}

		return {
			templateUrl: '/builder/templates/row.html',
			scope: {
				row: '='
			},
			controller: ['$scope', controller]
		};
	}]);

	module.directive('appLayoutRowNested', ['$compile', function($compile) {
		function link(scope, elem, attrs)
		{
			var rowHtml = '<div app-layout-row row="row"></div>';

			// dynamically compile the HTML so that we don't put Angular into an infinite loop
			$compile(rowHtml)(scope, function(rowElem, scope) {
				elem.append(rowElem);
			});
		}

		return {
			link: link,
			scope: {
				row: '='
			}
		};
	}]);
})(angular);
