<script type="text/ng-template" id="/builder/templates/row.html">
	<div class="lb-meta">
		<div class="lb-meta-left">
			Element: {{row.type}}
		</div>
		<div class="lb-meta-right">
			<button ng-click="remove()">-</button>
		</div>
	</div>

	<div ng-switch="row.type">
		<div ng-switch-when="row">
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
		</div>

		<div ng-switch-default>
			<div app-layout-element="row"></div>
		</div>
	</div>
</script>
