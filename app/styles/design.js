  'use strict';

    angular.module('MyApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']).config(function($mdThemingProvider) {
      $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('grey')
        .warnPalette('red')
        .accentPalette('blue')
    })
    .controller('Ctrl_Main', Ctrl_Main);

function Ctrl_Main($scope) {
    $scope.currentNavItem = 'login';
  }

