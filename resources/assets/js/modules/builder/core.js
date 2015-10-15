(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder = angular.module('lb.builder', [
			'ui.bootstrap',
			'ui.sortable',
			'lb.fields'
		]);

	function mainController($scope, $http, locale)
	{
		$scope.id = app.loadId || null;

		$scope.languages = locale.getLanguages();
		$scope.language = locale.getCurrentLanguage();

		$scope.$watch('language', function(newValue, oldValue) {
			if (newValue !== oldValue)
			{
				locale.setCurrentLanguage(newValue);
			}
		});

		/**
		 * $scope.state // state stack for undo/redo
		 *   state 3
		 *   state 2
		 *   state 1
		 *   state 0 i.e. current state // data for current stat
		 *     rows // list of rows OR elements
		 *       row/elem 0
		 *       row/elem 1  <-----------------------------------------------------------+
		 *         cols // list of columns                                               |
		 *           col 0                                                               |
		 *           col 1                                                               |
		 *             rows // list of rows OR elements in a column                      |
		 *               row/elem 1                                                      |
		 *               row/elem 2 // a row would have the same structure as above   >--+
		 *               row/elem 3
		 *                 type // "row" or "<element_type>", where <element_type> is the actual element type
		 *                 data // data mapped by language
		 *                   en
		 *                   es
		 *                   de
		 *                     foo // data value in particular language
		 *                     bar
		 *                     baz
		 *                   ...
		 */
		var initialState = app.loadState || {
			rows: []
		};

		// stack of states in newest to oldest order
		$scope.states = [initialState];
		$scope.state = initialState;

		$scope.pushState = function() {
			// push a copy of the current state one behind the current state
			$scope.states.splice(1, 0, angular.copy($scope.state));
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
		'$http',
		'locale'
	]);
})(angular);
