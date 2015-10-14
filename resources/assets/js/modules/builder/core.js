(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder = angular.module('lb.builder', [
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

	function mainController($scope, $http)
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

		$scope.id = app.loadId || null;

		$scope.pushState = function() {
			$scope.states.push(angular.copy($scope.state));
		};

		$scope.popState = function() {
			if ($scope.states.length <= 1)
			{
				return;
			}
			$scope.states.pop();
			$scope.state = $scope.states[$scope.states.length - 1];
		};

		$scope.save = function() {
			$http({
				method: 'POST',
				url: app.ROUTE_URL,
				data: {
					action: 'save',
					id: $scope.id,
					state: $scope.state
				}
			}).then(function(resp) {
				$scope.id = resp.data.id;
			}).catch(function(error) {
				alert('Oops, something went wrong! Please try again. Error: ' + error);
			});
		};
	}

	module.controller('MainController', mainController, [
		'$scope',
		'$http'
	]);
})(angular);
