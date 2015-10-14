<div ng-controller="MainController" class="container-fluid">
	<p>
		Actions:
		<button ng-click="save()">Save</button>
	</p>

	<p>
		Language:
		<select ng-model="language" ng-options="lang.code as lang.label for lang in languages"></select>
	</p>

	<div lb-layout="state.rows"></div>

	<p>Current state (for debugging):</p>
	<pre>{{state.rows}}</pre>
</div>
