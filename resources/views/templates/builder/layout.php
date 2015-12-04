<?php
/*!
 * 2015/01/12
 *     - All elements at root level now have to the fluid/fixed option. This change will cause
 *       non-layout elements in saved Layouts become fixed by default.
 */
?>
<script type="text/ng-template" id="/templates/builder/layout.html">
	<div ui-sortable="rowSortable" ng-model="rows" class="lb-rows">
		<div ng-repeat="row in rows">
			<div ng-attr-class="{{'container'}}" ng-if="isRoot && row.fluidity !== 'fluid'">
				<div lb-layout-row="row" ng-init="row.isRoot = true" remove="removeRow($index)" class="lb-row"></div>
			</div>
			<div ng-attr-class="{{row.type == 'row' ? 'container-fluid' : 'container-full'}}" ng-if="isRoot && row.fluidity === 'fluid'">
				<div lb-layout-row="row" ng-init="row.isRoot = true" remove="removeRow($index)" class="lb-row"></div>
			</div>
			
			<div ng-if="!isRoot	" lb-layout-row="row" remove="removeRow($index)" class="lb-row"></div>
		</div>
	</div>

	<div class="lb-row">
		<div class="lb-addButton" ng-click="addRow()">Add Row or Element</div>
	</div>
</script>