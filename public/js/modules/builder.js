(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder = angular.module('lb.builder', [
			'ui.bootstrap',
			'ui.sortable',
			'lb.fields'
		]);

	module.run(['lb.fields.config', function(lbFieldsConfig) {
		lbFieldsConfig.uploadUrl = app.ROUTE_URL;
	}]);
	
	
	// custom filter to convert breakpoints string to html column classes.
	module.filter('bpClass', function() {
		return function(bps) {
			var
				r = new RegExp("(?:"+ app.COL_BPS.join('|') +")\-(?:[0-9]+)", "g")
				m = bps ? bps.match(r) : null;
				
			if (m && m.length)
			{
				return 'col-' + m.join(' col-');
			}
			
			// invalid breakpoints given, default to col-sm-12 class.
			return 'col-sm-12';
		};
	});

	function mainController($scope, $http, locale)
	{
		$scope.id = app.load.id;
		$scope.meta = app.load.meta || {};
		$scope.metaFields = app.load.metaFields || [];

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
		var initialState = app.load.state;

		if (!initialState ||
			typeof initialState !== 'object' ||
			Object.prototype.toString.call(initialState.rows) !== '[object Array]')
		{
			initialState = {
				rows: []
			};
		}
		
		// 2015/12/01
		//     - The column breakpoint configuration is updated to a single text field (from
		//       two dropdowns) to allow multiple breakpoint classes. 
		(function(state) {
			var _updateBreakpoints = function(rows) {
				for (var i = 0, n = rows.length; i < n; i++)
				{
					var cols = rows[i].cols || [], 
						col, 
						bp, 
						size,
						new_bp;
					
					for (var j = 0, m = cols.length; j < m; j++)
					{
						col = cols[j];
						
						// check and convert old 'bp' and 'size' data to new breakpoint format
						if (typeof col.bp !== 'undefined' && typeof col.size !== 'undefined')
						{
							bp = col.bp || '';
							size = parseInt(col.size || '', 10) || 0;
							// default
							new_bp = 'sm-6';
							
							if (bp && jQuery.inArray(bp, app.COL_BPS) >= 0 && size && jQuery.inArray(size, app.COL_SIZES))
							{
								new_bp = bp + '-' + size;
							}
							
							delete col.size;
							delete col.bp;
							
							col.bps = new_bp;
							
							if (col.rows)
							{
								_updateBreakpoints(col.rows);
							}
						}
					}
				}
			};
			
			_updateBreakpoints(state.rows);
		})(initialState);
		

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
			$scope.saving = true;

			$http({
				method: 'POST',
				url: app.ROUTE_URL,
				data: {
					action: 'save',
					id: $scope.id,
					meta: $scope.meta,
					state: $scope.state
				}
			}).then(function(resp) {
				$scope.id = resp.data.id;
			}).catch(function(error) {
				alert('Oops, something went wrong! Please try again. Error: ' + error);
			}).finally(function() {
				$scope.saving = false;
			});
		};
	}

	module.controller('MainController', mainController, [
		'$scope',
		'$http',
		'locale'
	]);
})(angular);

(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder;

	function elementOptionsController($scope, $http, $modalInstance, elem, locale)
	{
		$scope.elementTypes = app.ELEMENT_TYPES;
		$scope.elem = elem;

		$scope.languages = locale.getLanguages();
		$scope.language = locale.getCurrentLanguage();

		// ensure that the element has a data object for each language
		locale.prepareData(elem.data);

		elem.fields = null;

		// load the element fields at start and when its type changes
		$scope.$watch('elem.type', loadFields);

		function loadFields()
		{
			$http({
				method: 'POST',
				url: app.ROUTE_URL,
				data: {
					action: 'getElementFields',
					elementType: elem.type
				}
			}).then(function(resp) {
				elem.fields = resp.data;
			}).catch(function(error) {
				alert('Oops, failed to retrieve element fields! Please try again. Error: ' + error);
			});
		}

		$scope.update = function() {
			$modalInstance.close(elem);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

	module.controller('ElementOptionsController', [
		'$scope',
		'$http',
		'$modalInstance',
		'elem',
		'locale',
		elementOptionsController
	]);
})(angular);

(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder;

	function elementPickerController($scope, $modalInstance)
	{
		$scope.elementTypes = app.ELEMENT_TYPES;
		$scope.elementType = 'row';

		$scope.add = function() {
			$modalInstance.close($scope.elementType);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

	module.controller('ElementPickerController', [
		'$scope',
		'$modalInstance',
		elementPickerController	
	]);
})(angular);

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

(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder;

	module.service('locale', ['$rootScope', function($rootScope) {
		var languages = app.LANGUAGES,
			currentLanguage = languages[0].code;

		var locale = {
			getCurrentLanguage: function() {
				return currentLanguage;
			},

			setCurrentLanguage: function(lang) {
				currentLanguage = lang;

				$rootScope.$broadcast('setCurrentLanguage', currentLanguage);
			},

			getLanguages: function() {
				return languages;
			},

			prepareData: function(data) {
				for (var i = 0; i < languages.length; ++i)
				{
					var lang = languages[i].code;
					data[lang] = data[lang] || {};
				}
			}
		};

		return locale;
	}]);
})(angular);

(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder;

	module.directive('lbLayoutElement', ['$http', 'locale', function($http, locale) {
		function render(elem, domElem, lang)
		{
			$http({
				method: 'POST',
				url: app.ROUTE_URL,
				data: {
					action: 'renderElement',
					elementType: elem.type,
					elementData: elem.data[lang]
				}
			}).then(function(resp) {
				domElem.html(resp.data);
			}).catch(function(error) {
				alert('Oops, failed to update element HTML! Please try again. Error: ' + error);
			});
		}

		function link(scope, elem, attrs)
		{
			// render the element whenever its data changes
			scope.$watch('elem', function(oldValue, newValue) {
				// note that this will be called the first time without any changes
				render(scope.elem, elem, locale.getCurrentLanguage());
			}, true);

			// render the element whenever the language is changed
			scope.$on('setCurrentLanguage', function(evt, lang) {
				render(scope.elem, elem, lang);	
			});
		}

		return {
			scope: {
				elem: '=lbLayoutElement',
			},
			link: link
		};
	}]);
})(angular);

(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder;

	module.directive('lbLayoutRow', ['$uibModal', function($uibModal) {
		function createCol()
		{
			return {
				//bp: 'sm',
				//size: 6,
				// columns now can have multiple breakpoints (space delimiter).
				bps: 'sm-6',
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

			// columns now can have multiple breakpoints (space delimiter).
			// $scope.colBps = app.COL_BPS;
			// $scope.colSizes = app.COL_SIZES;
			
			$scope.rowFluidities = app.ROW_FLUIDITIES;

			$scope.colSortable = {
				handle: '.lb-meta',
				connectWith: '.lb-cols',
				helper: 'clone'
			};
		}

		return {
			templateUrl: '/templates/builder/layout/row.html',
			scope: {
				row: '=lbLayoutRow',
				remove: '&'
			},
			controller: ['$scope', controller]
		};
	}]);
})(angular);
