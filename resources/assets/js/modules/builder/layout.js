(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder;

	module.directive('lbLayout', [function() {
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
					
					fluidity: 'fixed',

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
				connectWith: '.lb-rows',
				helper: 'clone'
			};
			
			
			
			$scope.isRoot = !(angular.isDefined($scope.nested) ? $scope.nested : false);
		}

		return {
			templateUrl: '/templates/builder/layout.html',
			scope: {
				rows: '=lbLayout',
				nested: '=lbLayoutIsNested'
			},
			controller: ['$scope', '$uibModal', controller]
		};
	}]);

	module.directive('lbLayoutNested', ['$compile', function($compile) {
		function link(scope, elem, attrs)
		{
			var html = '<div lb-layout="rows" lb-layout-is-nested="true"></div>';
			
			// dynamically compile the HTML so that we don't put Angular into an infinite loop
			$compile(html)(scope, function(innerElem, scope) {
				elem.append(innerElem);
			});
		}

		return {
			link: link,
			scope: {
				rows: '=lbLayoutNested'
			}
		};
	}]);
})(angular);
