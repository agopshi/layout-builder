<script type="text/ng-template" id="/templates/builder/layout.html">
	<div ui-sortable="rowSortable" ng-model="rows" class="lb-rows">
		<div ng-repeat="row in rows">
			<ng-switch on="isRoot">
				<div ng-switch-when="true">
					<div ng-attr-class="{{row.fluidity == 'fluid' && 'container-fluid' || 'container'}}">
						<div lb-layout-row="row" lb-layout-is-root="isRoot" remove="removeRow($index)" class="lb-row"></div>
					</div>
				</div>
				<div ng-switch-when="false">
					<div lb-layout-row="row" lb-layout-is-root="isRoot" remove="removeRow($index)" class="lb-row"></div>
				</div>
			</ng-switch>
		</div>
	</div>

	<div class="lb-row">
		<div class="lb-addButton" ng-click="addRow()">Add Row or Element</div>
	</div>
</script>
