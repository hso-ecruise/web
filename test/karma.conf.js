// Karma configuration
// Generated on 2017-01-12

module.exports = function (config) {
	'use strict';

	config.set({
		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// base path, that will be used to resolve files and exclude
		basePath: '../',

		// testing framework to use (jasmine/mocha/qunit/...)
		// as well as any additional frameworks (requirejs/chai/sinon/...)
		frameworks: [
			'jasmine'
		],
		// Code coverage report
		reporters: ['spec', 'coverage'],

		specReporter: {
			maxLogLines: 5,         // limit number of lines logged per test
			suppressErrorSummary: true,  // do not print error summary
			suppressFailed: false,  // do not print information about failed tests
			suppressPassed: false,  // do not print information about passed tests
			suppressSkipped: true,  // do not print information about skipped tests
			showSpecTiming: false // print the time elapsed for each spec
		},

		preprocessors: {
			'app/scripts/**/*.js': ['coverage']
		},
		coverageReporter: {
			type: 'html',
			dir: 'coverage/'
		},
		// list of files / patterns to load in the browser
		files: [
			// bower:js
			'bower_components/jquery/dist/jquery.js',
			'bower_components/angular/angular.js',
			'bower_components/bootstrap/dist/js/bootstrap.js',
			'bower_components/angular-animate/angular-animate.js',
			'bower_components/angular-aria/angular-aria.js',
			'bower_components/angular-cookies/angular-cookies.js',
			'bower_components/angular-messages/angular-messages.js',
			'bower_components/angular-resource/angular-resource.js',
			'bower_components/angular-route/angular-route.js',
			'bower_components/angular-sanitize/angular-sanitize.js',
			'bower_components/angular-touch/angular-touch.js',
			'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
			'bower_components/angular-material/angular-material.js',
			'bower_components/ngmap/build/scripts/ng-map.js',
			'bower_components/angular-mocks/angular-mocks.js',
			// endbower
			'app/scripts/app.js',
			'app/scripts/**/*.js',
			'test/mock/**/*.js',
			'test/spec/**/*.js'
		],

		// list of files / patterns to exclude
		exclude: [
		],

		// web server port
		port: 8080,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: [
			'Firefox'
		],

		// Which plugins to enable
		plugins: [
			'karma-phantomjs-launcher',
			'karma-jasmine',
			'karma-firefox-launcher',
			'karma-coverage',
			'karma-spec-reporter'
		],

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false,

		colors: true,

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,

		// Uncomment the following lines if you are using grunt's server to run the tests
		// proxies: {
		//   '/': 'http://localhost:9000/'
		// },
		// URL root prevent conflicts with the site root
		// urlRoot: '_karma_'
	});
};
