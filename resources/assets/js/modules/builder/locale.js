(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder;

	module.service('locale', ['$rootScope', function($rootScope) {
		var languages = app.LANGUAGES,
			currentLanguage = languages[0].code;

		var locale = {
			getCurrentLanguage: function() {
				return currentLanguage;
			},

			setCurrentLanguage: function(lang) {
				currentLanguage = lang;

				$rootScope.$broadcast('setCurrentLanguage', currentLanguage);
			},

			getLanguages: function() {
				return languages;
			},

			prepareData: function(data) {
				for (var i = 0; i < languages.length; ++i)
				{
					var lang = languages[i].code;
					data[lang] = data[lang] || {};
				}
			}
		};

		return locale;
	}]);
})(angular);
