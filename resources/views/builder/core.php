<div ng-controller="MainController">
	<div class="container-fluid">
		<div lb-fields="metaFields" values="meta"></div>

		<p>
			<button ng-click="save()" ng-hide="saving">Save</button>
			<span ng-show="saving">Saving&hellip;</span>
		</p>

		<p>Language: <select ng-model="language" ng-options="lang.code as lang.label for lang in languages"></select></p>
	</div>

	<div class="lb-layout">
		<div lb-layout="state.rows"></div>
	</div>
	
	<div class="container-fluid">
		<p>Current state (for debugging):</p>
		<pre>{{state.rows}}</pre>
	</div>
</div>
