Preparing for tests:

Download karma coverage for code coverage:
	npm install karma-coverage --save-dev

Download firefox launcher for karma:
	npm install karma-firefox-launcher --save-dev

Download karma spec reporter
	npm install karma-spec-reporter --save-dev

Config karma spec reporter
	config.set({
	...
	reporters: ["spec"],
	specReporter: {
      		maxLogLines: 5,         // limit number of lines logged per test
      		suppressErrorSummary: true,  // do not print error summary
      		suppressFailed: false,  // do not print information about failed tests
      		suppressPassed: false,  // do not print information about passed tests
      		suppressSkipped: true,  // do not print information about skipped tests
      		showSpecTiming: false // print the time elapsed for each spec
	},
	plugins: ["karma-spec-reporter"],

Start tests with:
	karma start karma.config.js