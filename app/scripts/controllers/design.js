  'use strict';

var application = angular.module('MyApp', ['ngMaterial', 'ngMessages']);
var theming = angular.module('MyApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

application.controller('Ctrl_Profile', function ($scope) {
	$scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
		'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY').split(' ').map(function (state) {
			return { abbrev: state };
		});
 });


    theming.config(function($mdThemingProvider) {
      $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('grey')
        .warnPalette('red')
        .accentPalette('blue')
    })
    .controller('Ctrl_Main', Ctrl_Main);

function Ctrl_Main($scope) {
    $scope.currentNavItem = 'login';
  }