<div ng-controller="MainController" class="container-fluid">
	<div lb-fields="metaFields" values="meta"></div>

	<p>
		<button ng-click="save()" ng-hide="saving">Save</button>
		<span ng-show="saving">Saving&hellip;</span>
	</p>

	<p>Language: <select ng-model="language" ng-options="lang.code as lang.label for lang in languages"></select></p>

	<div lb-layout="state.rows"></div>

	<p>Current state (for debugging):</p>
	<pre>{{state.rows}}</pre>
</div>
