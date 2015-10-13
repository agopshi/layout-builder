(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	module.directive('appLayoutRow', [function() {
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

			$scope.editElement = function() {

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
