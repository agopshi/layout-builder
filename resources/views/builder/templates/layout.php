<script type="text/ng-template" id="/builder/templates/layout.html">
	<div ui-sortable="rowSortable" ng-model="rows" class="lb-rows">
		<div ng-repeat="row in rows">
			<div app-layout-row="row" remove="removeRow($index)" class="row"></div>
		</div>
	</div>

	<div class="row">
		<div class="lb-addButton" ng-click="addRow()">Add Row or Element</div>
	</div>
</script>

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

<script type="text/ng-template" id="/templates/builder/element_picker.html">
	<div class="modal-header">
		<h3 class="modal-title">Choose an Element Type</h3>
	</div>
	<div class="modal-body">
		<p>What type of element would you like to add?</p>
		<select ng-model="elementType" ng-options="type.code as type.label for type in elementTypes"></select>
	</div>
	<div class="modal-footer">
		<button class="btn btn-primary" type="button" ng-click="add()">Add</button>
		<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>
	</div>
</script>
