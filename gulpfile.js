var gulp = require('gulp'),
	deepExtend = require('deep-extend'),
	assets = require('loewy-assets'),
	rubySass = require('gulp-ruby-sass');

var assetsDir = 'resources/assets/',
	publicDir = 'public/';

assets(assetsDir, publicDir, function() {
	// delete initial JS modules
	delete this.config.js.modules;

	var modules = ['builder', 'fields'],
		modulesObj = {
			vendor: [
				assetsDir + 'js/vendor/jquery-1.11.3.js',
				assetsDir + 'js/vendor/jquery-ui-1.11.4.js',
				assetsDir + 'js/vendor/angular-1.4.7.js',
				assetsDir + 'js/vendor/ui-bootstrap-tpls-0.14.0.js',
				assetsDir + 'js/vendor/**/*.js'
			]
		};
	modules.forEach(function(v, k) {
		modulesObj['modules/' + v] = [
			assetsDir + 'js/modules/' + v + '/core.js',
			assetsDir + 'js/modules/' + v + '/**/*.js'
		];
	});

	deepExtend(this.config, {
		js: {
			modules: modulesObj
		}
	});

	delete this.tasks.sass;

	// use gulp-ruby-sass instead
	this.tasks.rubySass = function() {
		var config = this.config,
			gulp = this.gulp;

		gulp.task('ruby-sass', function() {
			// ruby sass does not support the glob syntax
			return rubySass(assetsDir + 'scss/main.scss')
				.on('error', function(err) {
					console.error(err.message);
				})

				// move to the output directory
				.pipe(gulp.dest(config.sass.dest));
		});

		this.watches.push({
			watch: config.sass.src,
			task: 'ruby-sass'
		});
	};
}, gulp);
