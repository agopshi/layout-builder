<script type="text/ng-template" id="/builder/templates/layout.html">
	<div ui-sortable="rowSortable" ng-model="rows" class="lb-rows">
		<div ng-repeat="row in rows">
			<div ng-switch="row.type">
				<div ng-switch-when="row">
					<div app-layout-row="row" class="row"></div>
				</div>
				<div ng-switch-when="lorem">
					<p>Lorem ipsum dolor</p>
				</div>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="lb-addButton" ng-click="addRow()">Add Row or Element</div>
	</div>
</script>

<script type="text/ng-template" id="/builder/templates/row.html">
	<div class="lb-meta">
		<div class="lb-meta-left">
			Row
		</div>
		<div class="lb-meta-right">
		</div>
	</div>

	<div ui-sortable="colSortable" ng-model="row.cols" class="lb-cols">
		<div ng-repeat="col in row.cols" class="col col-{{col.bp}}-{{col.size}}">
			<div class="lb-meta">
				<div class="lb-meta-left">
					<button ng-click="addColumn($index)">+</button>
					Column
					<button ng-click="removeColumn($index)">-</button>
				</div>
				<div class="lb-meta-right">
					<select ng-model="col.bp" ng-options="bp for bp in colBps"></select>
					<select ng-model="col.size" ng-options="size for size in colSizes"></select>
					<button ng-click="addColumn()">+</button>
				</div>
			</div>

			<div app-layout-nested="col.rows"></div>
		</div>
	</div>

	<div class="col col-sm-6" ng-if="row.cols.length === 0">
		<div class="lb-addButton" ng-click="addColumn()" >Add Column</div>
	</div>
</script>
