(function(angular) {
	var app = window.app,
		module = app.modules.layout = angular.module('app.layout', [
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
		function createRow()
		{
			return {
				cols: []
			};
		}

		function createCol()
		{
			return {
				elems: []
			}
		}

		function createElem()
		{
			return {
				data: {}
			}
		};

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

		$scope.addElement = function(col) {
			col.elems.push(createElem());
		};

		$scope.addColumn = function(row) {
			row.cols.push(createCol());
		};

		$scope.addRow = function() {
			$scope.state.rows.push(createRow());
		};
	}

	module.controller('MainController', mainController, [
		'$scope',
		'util'
	]);
})(angular);
