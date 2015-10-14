(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder;

	module.directive('lbLayoutRow', ['$uibModal', function($uibModal) {
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
				row: '=lbLayoutRow',
				remove: '&'
			},
			controller: ['$scope', controller]
		};
	}]);
})(angular);
