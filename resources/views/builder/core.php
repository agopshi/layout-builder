<div ng-controller="MainController" class="container-fluid">
	<p>
		Actions:
		<button ng-click="save()">Save</button>
	</p>

	<div lb-layout="state.rows"></div>

	<p>Current state (for debugging):</p>
	<pre>{{state.rows}}</pre>
</div>
