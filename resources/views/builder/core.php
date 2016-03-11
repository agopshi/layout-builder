<div ng-controller="MainController">
	<div class="container-fluid lb-metabox">
		<div class="lb-left lb-metabox-title-slug" lb-fields="metaFields" values="meta"></div>
		<div class="lb-left lb-field lb-field-language">
			<div class="lb-field-label">Language:</div>
			<div class="lb-field-value">
				<select ng-model="language" ng-options="lang.code as lang.label for lang in languages"></select>
			</div>
			
		</div>
		<div class="lb-right lb-actions">
			<div class="lb-left lb-field">
				<a href="" class="back-to-wordpress">Back to Wordpress</a>
			</div>
			<div class="lb-left lb-field">
				<button class="btn btn_small" ng-click="save()" ng-hide="saving">Save</button>
				<span ng-show="saving">Saving&hellip;</span>
			</div>
		</div>

		
	</div>

	<div class="lb-layout">
		<div lb-layout="state.rows"></div>
	</div>
	
	<div class="container-fluid">
		<p>Current state (for debugging):</p>
		<pre>{{state.rows}}</pre>
	</div>
</div>
