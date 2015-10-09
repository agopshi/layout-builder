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
