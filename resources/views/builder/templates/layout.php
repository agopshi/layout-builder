<script type="text/ng-template" id="/builder/templates/layout.html">
	<div ui-sortable="rowSortable" ng-model="rows" class="lb-rows">
		<div ng-repeat="row in rows">
			<div lb-layout-row="row" remove="removeRow($index)" class="row"></div>
		</div>
	</div>

	<div class="row">
		<div class="lb-addButton" ng-click="addRow()">Add Row or Element</div>
	</div>
</script>
