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

application.service

/**
 * Description
 * Funktion um zu schauen ob user eingeloggt ist und ihm die richtige ausgewaehlte Seite zu zeigen.
 * @method checkRouting
 * @param {} $rootScope
 * @param {} $location
 * @param {} Helper
 * @return 
 */
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
    
    if ($rootScope.loggedIN === false || $rootScope.loggedIN === undefined) // falls user eingeloggt -> start, sonst passiert nichts
    {
		if($rootScope.loggedIN === undefined){
			$rootScope.loggedIN = false;
		}
		
		$location.path("/start");
    }
    else
    {
		//alert("true or other");
		//alert($rootScope.loggedIN);
    }
};


// Funktion die Urls und ihre Controller abhaengig von der ausgewaehlten Seite laedt
application.config(function ($routeProvider, $locationProvider, $httpProvider, $qProvider){

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
		resolve: {
			factory: checkRouting
		},
		controller: 'Ctrl_Booking'
	})
	
	.when ('/manage',
	{
		templateUrl: 'views/manage.html',
		resolve: {
			factory: checkRouting
		},
		controller: 'Ctrl_Manage'
	})

    .when ('/profile',
	{
		templateUrl: 'views/profile.html',
		resolve: {
			factory: checkRouting
		},
		controller: 'Ctrl_Manage'
	})
	
	.otherwise(
	{
		templateUrl : 'views/start.html',
		controller: 'Ctrl_Main'
	});
	
    $locationProvider
    .html5Mode(true);

});

