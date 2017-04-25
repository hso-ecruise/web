'use strict';

/**
 * @ngdoc overview
 * @name webApp
 * @description
 * # webApp
 *
 * Main module of the application.
 */
 
 
 
 var application = angular.module('webApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
	'blubb', []
]);

var checkRouting= function ($rootScope, $location) {
	
	console.log("CALLED");
	
    if ($rootScope.LoggedIN === false || $rootScope.LoggedIN === undefined)
    {
		$location.path("/login");
    }
    else
    {
		alert("true or other");
		alert($rootScope.LoggedIN);
    }
};

application.config(function ($routeProvider, $locationProvider){

    $routeProvider
	.when('/', {
	    templateUrl: 'views/main.html',
	    resolve: {
			factory: checkRouting
			}
		})
	
	.when('/login',
	    {
			templateUrl : 'views/login.html',
			controller: 'Ctrl_Login_Register'
	    })
		
	.when('/register',
	    {
			templateUrl : 'views/register.html',
			controller: 'Ctrl_Login_Register'
	    })
		
    .when('/booking',
	    {
			templateUrl : 'views/booking.html',
			controller: 'Ctrl_Booking'
		})
		
	.when ('/about',
		{
			templateUrl: 'views/about.html'
		})
    
	.when ('/manage',
		{
			templateUrl: 'views/manage.html',
			controller: 'Ctrl_Manage'
		})
	
	.when ('/profile',
		{
			templateUrl: 'views/profile.html',
			controller: 'Ctrl_Profile'
		})
	
	.otherwise(
	    {
			templateUrl : 'views/login.html',
			controller: 'Ctrl_Login_Register'
			//template: 'NO PAGE'
	    });
	
    $locationProvider
    .html5Mode(true);

});

/*
application.config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
*/