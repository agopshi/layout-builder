<script type="text/ng-template" id="/templates/builder/element_options.html">
	<div class="modal-header">
		<h3 class="modal-title">Element Options</h3>
	</div>
	<div class="modal-body">
		<p>Element type:</p>
		<p><select ng-model="elem.type" ng-options="type.code as type.label for type in elementTypes"></select></p>

		<div lb-fields="elem.fields" values="elem.data"></div>
	</div>
	<div class="modal-footer">
		<button class="btn btn-primary" type="button" ng-click="update()">Update</button>
		<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>
	</div>
</script>
