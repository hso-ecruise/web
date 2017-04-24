'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */

const IP = 'localhost';
const PORT = '8080';
const CUSTOMER = "customers";
const API_KEY = "AIzaSyBCbY_MjWJ1cDjugF_MBHwnYDWFNJYAa4o&callback=initMap";


var application = angular.module('webApp', [
    'ngAnimate',
    'ngMaterial',
    'ngMap',
    'ngRoute'
]);

var checkRouting= function ($rootScope, $location) {
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
			controller: 'Ctrl_Manage'
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




application.service('GetCaller', function ($http) {

	this.Get = function (url) {
		return $http.get(url);
	};

});

application.service('PostCaller', function ($http) {

	this.Post = function (url, state) {
		var post = $http({
			method: "post",
			url: url,
			data: state
		});
		return post;
	};

});

application.service('PostReset', function ($http) {

	this.PostReset = function (url) {
		var post = $http({
			method: "post",
			url: url,
			data: [""]
		});
		return post;
	};

});


application.factory('RESTFactory', function ($http, GetCaller, PostCaller, PostReset) {

	return {
		GetUser: function (id) {
			var url = 'http://' + IP + ':' + PORT + '/' + CUSTOMER + "?userID=" + id;
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		GetAddress: function(lat, lon){
			var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
			url += lat + "," + lon + "&key=" + API_KEY;
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		}

	};

});
