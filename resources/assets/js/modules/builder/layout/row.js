(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	module.directive('appLayoutRow', [function() {
		function controller($scope)
		{
			function createCol()
			{
				return {
					bp: 'sm',
					size: 6,
					rows: []
				}
			}

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

			/**
			 * @todo Abstract these out. Grids should be configurable.
			 */
			$scope.colBps = ['xs', 'sm', 'md', 'lg'];
			$scope.colSizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
