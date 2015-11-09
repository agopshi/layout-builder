<script type="text/ng-template" id="/templates/builder/layout.html">
	<div ui-sortable="rowSortable" ng-model="rows" class="lb-rows" style="min-height:10px;">
		<div ng-repeat="row in rows">
			<div ng-attr-class="{{row.fluidity == 'fluid' ? 'container-fluid' : 'container'}}" ng-if="isRoot && row.type == 'row'">
				<div lb-layout-row="row" lb-layout-is-root="isRoot" remove="removeRow($index)" class="lb-row"></div>
			</div>
			
			<div ng-if="!isRoot || row.type !== 'row'" lb-layout-row="row" remove="removeRow($index)" class="lb-row"></div>
		</div>
	</div>

	<div class="lb-row">
		<div class="lb-addButton" ng-click="addRow()">Add Row or Element</div>
	</div>
</script>
