<script type="text/ng-template" id="/builder/templates/layout.html">
	<div ng-repeat="row in rows">
		<div app-layout-row row="row"></div>
	</div>

	<div class="row">
		<div class="addButton" ng-click="addRow()">Add Row</div>
	</div>
</script>

<script type="text/ng-template" id="/builder/templates/row.html">
	<div class="row hoverIntent">
		<div class="meta">
			<div class="meta-left">
				Row
			</div>
			<div class="meta-right">
			</div>
		</div>

		<div ng-repeat="col in row.cols" class="col col-{{col.bp}}-{{col.size}} hoverIntent">
			<div class="col-inner">
				<div class="meta">
					<div class="meta-left">
						<button ng-click="addColumn($index)">+</button>
						Col {{ $index }}
						<button ng-click="removeColumn($index)">-</button>
					</div>
					<div class="meta-right">
						<select ng-model="col.bp" ng-options="bp for bp in COL_BPS"></select>
						<select ng-model="col.size" ng-options="size for size in COL_SIZES"></select>
						<button ng-click="addColumn()">+</button>
					</div>
				</div>

				<div ng-repeat="elem in col.elems" class="elem">
					<div ng-switch="elem.type">
						<div ng-switch-when="row">
							<div app-layout-row-nested row="elem"></div>
						</div>
					</div>
				</div>

				<div class="addButton" ng-click="addElement(col)">Add Element</div>
			</div>
		</div>

		<div class="col col-sm-6">
			<div class="col-inner">
				<div class="addButton" ng-click="addColumn()" ng-if="row.cols.length === 0">Add Column</div>
			</div>
		</div>
	</div>
</script>
