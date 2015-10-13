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
