(function(angular) {
	var app = window.app,
		module = app.modules.builder;

	module.directive('appLayout', [function() {
		function controller($scope)
		{
			function createRow()
			{
				return {
					type: 'row',
					cols: [],

					// for element types other than row
					data: {}
				};
			}

			$scope.addRow = function() {
				$scope.rows.push(createRow());
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
			controller: ['$scope', controller]
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
				row: '=appLayoutRow'
			},
			controller: ['$scope', controller]
		};
	}]);
})(angular);
