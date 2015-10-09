<div ng-app="app.layout">
	<div ng-controller="MainController" class="container">
		<div ng-repeat="row in state.rows" class="row">
			<div class="meta">
				<div class="meta-left">
					Row
				</div>
				<div class="meta-right">
				</div>
			</div>

			<div ng-repeat="col in row.cols" class="col col-sm-3">
				<div class="col-inner">
					<div class="meta">
						<div class="meta-left">
							Col {{ $index }}
						</div>
						<div class="meta-right">
						</div>
					</div>

					<div ng-repeat="elem in col.elems" class="elem">
					</div>

					<div class="addButton" ng-click="addElement(col)">Add Element</div>
				</div>
			</div>

			<div class="col col-sm-3">
				<div class="col-inner">
					<div class="addButton" ng-click="addColumn(row)">Add Column</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="addButton" ng-click="addRow()">Add Row</div>
		</div>
	</div>
</div>
