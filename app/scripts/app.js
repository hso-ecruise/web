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
    'ngMaterial',
    'ngMap',
    'ngRoute',
	'ngCookies'
]);

var checkRouting = function ($rootScope, $location, Helper) {
	
	var loggedIN = Helper.Cookie_Get("loggedIN");
	var token = Helper.Cookie_Get("token");
	var customerID = Helper.Cookie_Get("customerID");
	
	if(loggedIN !== "true"){
		loggedIN = false;
	}
	
	$rootScope.loggedIN = loggedIN;
	$rootScope.token = token;
	$rootScope.customerID = customerID;
	
	if ($rootScope.loggedIN === false || $rootScope.loggedIN === undefined)
    {
		if($rootScope.loggedIN === undefined){
			$rootScope.loggedIN = false;
		}
		
		console.log("FAILED ");
		
		$location.path("/start");
    }
    else
    {
		alert("true or other");
		alert($rootScope.loggedIN);
    }
};

application.config(function ($routeProvider, $locationProvider){

    $routeProvider
	.when('/', {
	    templateUrl: 'views/start.html',
	    resolve: {
			factory: checkRouting
			}
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
			controller: 'Ctrl_Manage'
		})
	
	.otherwise(
	    {
			templateUrl : 'views/start.html',
			controller: 'Ctrl_Main'
			//template: 'NO PAGE'
	    });
	
    $locationProvider
    .html5Mode(true);

});

