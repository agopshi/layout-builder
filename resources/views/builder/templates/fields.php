<script type="text/ng-template" id="/builder/templates/fields.html">
	<div ng-repeat="field in fields" class="lb-field">
		<div class="lb-field-label">{{field.label}}</div>
		<div ng-switch="field.type" class="lb-field-value">
			<div ng-switch-when="text">
				<input ng-model="values[field.code]" type="{{field.inputType || 'text'}}" />
			</div>
			<div ng-switch-when="textarea">
				<textarea ng-model="values[field.code]"></textarea>
			</div>
			<div ng-switch-when="select">
				<select ng-model="values[field.code]" ng-options="option.value as option.label for option in field.options"></select>
			</div>
			<div ng-switch-when="list" class="lb-field-list">
				<div ng-repeat="value in values[field.code]" class="lb-field-list-item">
					<div class="lb-field-list-item-meta">
						Item #{{$index + 1}}
						<button ng-click="removeItem(values[field.code], $index)">Remove Item</button>
					</div>
					<div app-fields-nested="field.list" values="value"></div>
				</div>
				<div class="lb-field-list-add"><button ng-click="addItem(values, field.code)">Add Item</button></div>
			</div>
		</div>
	</div>
</script>


<script type="text/ng-template" id="/templates/property-editor.html">
	<div ng-repeat="(k, v) in properties">
		<div class="editor-property" ng-show="filter(k, v)">
			<div ng-switch="type(k, v)">
				<div ng-switch-when="object">
					<label class="editor-property-label label_const">
						<span app-property-editor-label></span><!--
						--><div class="label-input">
							<button class="btn btn-default btn-xs" ng-hide="show[k]" ng-click="show[k] = true;">+</button>
							<button class="btn btn-default btn-xs" ng-show="show[k]" ng-click="show[k] = false;">-</button>
						</div>
					</label>
					
					<div ng-show="show[k]">
						<div app-property-editor-nested properties="properties[k]" meta="m(k).meta"></div>
					</div>
				</div>

				<div ng-switch-when="array">
					<label class="editor-property-label">
						<span app-property-editor-label></span>
					</label>
					<div>Arrays not yet implemented.</div>
				</div>

				<div ng-switch-when="string">
					<label class="label_const">
						<span app-property-editor-label></span><!--
						--><input class="label-input"
							type="text"
							ng-readonly="m(k).readOnly || false"
							ng-model="properties[k]" />
					</label>
				</div>

				<div ng-switch-when="select">
					<label class="label_const">
						<span app-property-editor-label></span><!--
						--><select class="label-input"
							ng-disabled="m(k).readOnly || false"
							ng-model="properties[k]"
							ng-options="option.value as option.label for option in m(k).options"></select>
					</label>
				</div>

				<div ng-switch-when="number">
					<label class="label_const">
						<span app-property-editor-label></span><!--
						--><input class="label-input"
							type="number"
							ng-readonly="m(k).readOnly || false"
							min="[[ m(k).min || 0 ]]"
							max="[[ m(k).max || 1 ]]"
							step="[[ m(k).step || 0.1 ]]"
							ng-model="properties[k]" />
					</label>
				</div>

				<div ng-switch-when="boolean">
					<label class="label_const">
						<span app-property-editor-label></span><!--
						--><input type="checkbox"
							ng-readonly="m(k).readOnly || false"
							ng-model="properties[k]" />
					</label>
				</div>

				<div ng-switch-when="color">
					<label class="label_const">
						<span app-property-editor-label></span><!--
						--><span class="label-input">
							<input type="text"
								ng-readonly="m(k).readOnly || false"
								ng-model="properties[k]" /><!--
							--><input type="color"
								ng-readonly="m(k).readOnly || false"
								ng-model="properties[k]" />
						</span>
					</label>
				</div>
			</div>

			<div class="editor-property-desc" ng-show="m(k).desc" ng-bind-html="m(k).desc | unsafe"></div>
		</div>
	</div>

	<div class="editor-add">
		<div ng-show="addingProperty">
			<div class="editor-property">
				<label class="label_const">
					<input class="label-text" type="text" ng-model="propertyCode" /><!--
					--><input class="label-input" type="text" ng-model="propertyValue" />
				</label>
			</div>
			<button class="btn btn-default btn-xs" ng-click="addProperty()">Add Property</button>
		</div>
		<div ng-hide="addingProperty">
			<button class="btn btn-default btn-xs" ng-click="newProperty()">New Property</button>
		</div>
	</div>
</script>
