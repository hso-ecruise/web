'use strict';


const IP = 'localhost';
const PORT = '8080';

const CUSTOMER = "customers";

const API_KEY = "AIzaSyBCbY_MjWJ1cDjugF_MBHwnYDWFNJYAa4o&callback=initMap";


/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */

var application = angular.module('webApp', [
	'ngAnimate',
	'ngMaterial',
        'ngMap',
        'ngRoute'
]);

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
	.when ('/about', {
	    templateUrl: 'views/about.html'
	})
    	.when ('/manage', {
	    templateUrl: 'views/manage.html',
	    controller: 'Ctrl_Manage'
	})
	.when ('/profile', {
	    templateUrl: 'views/profile.html',
	    controller: 'Ctrl_Manage'
	})
	.otherwise(
	    {
		template: 'NO PAGE'
	    });
	
    $locationProvider
    .html5Mode(true);

});

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
		}

	};

});


application.controller('Ctrl_Login_Register', function ($rootScope, $scope, $location) {
	$scope.login_register = 'login';
	$rootScope.loggedIN = "false";
	
	$scope.Login = function () {

		var email = $scope.login.email;
		var password = $scope.login.password;

	    if (email === "test" && password === "test") {
		$rootScope.loggedIN = "true";
		$location.path("/booking");
		}

	};

    
	$scope.Register = function () {

		/*
		var password = $scope.register.password;
		var password_confirm = $scope.register.password_confirm;

		if (password === password_confirm) {

			var name = $scope.register.name;
			console.log(name);

			var newUser = {

				name: $scope.register.name,
				familyName: $scope.register.familyName,
				email: $scope.register.email,
				phone: $scope.register.phone,
				address: {
					street: $scope.register.address.street,
					number: $scope.register.address.number,
					country: $scope.register.address.country,
					zip: $scope.register.address.zip,
					city: $scope.register.address.city
				}

			}

			console.log(newUser);

			$rootScope.user = newUser;
			$rootScope.loggedIN = "true";

		}
		*/
	};

	$scope.ChangeView = function (state) {
		if (state === 'login') {
			$scope.login_register = "login";
		} else {
			$scope.login_register = "register";
		}
	};

});

application.controller('Ctrl_Main', function ($rootScope, $scope, $location) {
    if ( $rootScope.loggedIN === undefined )
    {
	$rootScope.loggedIN = "false";
    }
    else
    {
	alert($rootScope.loggedIN);
    }


	$scope.bookingActive = "active";
	$scope.manageActive = "inactive";
	$scope.profileActive = "inactive";

	$scope.ChangeView = function (input) {

		$scope.bookingActive = "inactive";
		$scope.manageActive = "inactive";
		$scope.profileActive = "inactive";

		switch (input) {
			case 'booking':
				$scope.bookingActive = "active";
				$scope.currentView = "booking";
				break;
			case 'manage':
				$scope.manageActive = "active";
				$scope.currentView = "manage";
				break;
			case 'profile':
				$scope.profileActive = "active";
				$scope.currentView = "profile";
				console.log("PROFIL");
				break;
		}
	};

});


application.controller('Ctrl_Booking', function ($rootScope, $scope, NgMap) {
  /*
	var icon_table = {
		default_icon: {},
		car_loading_00: L.icon({
			iconUrl: 'images/icons/car_loading_00.png',
			iconSize: [60, 85],
			iconAnchor: [30, 85],
			popupAnchor: [0, -85]
		}),
		car_loading_25: L.icon({
			iconUrl: 'images/icons/car_loading_25.png',
			iconSize: [60, 85],
			iconAnchor: [30, 85],
			popupAnchor: [0, -85]
		}),
		car_loading_50: L.icon({
			iconUrl: 'images/icons/car_loading_50.png',
			iconSize: [60, 85],
			iconAnchor: [30, 85],
			popupAnchor: [0, -85]
		}),
		car_loading_75: L.icon({
			iconUrl: 'images/icons/car_loading_75.png',
			iconSize: [60, 85],
			iconAnchor: [30, 85],
			popupAnchor: [0, -85]
		}),
		car_available: L.icon({
			iconUrl: 'images/icons/car_available.png',
			iconSize: [60, 85],
			iconAnchor: [30, 85],
			popupAnchor: [0, -85]
		}),
		car_occupied: L.icon({
			iconUrl: 'images/icons/car_occupied.png',
			iconSize: [60, 85],
			iconAnchor: [30, 85],
			popupAnchor: [0, -85]
		}),
		station_available: L.icon({
			iconUrl: 'images/icons/station_available.png',
			iconSize: [60, 85],
			iconAnchor: [30, 85],
			popupAnchor: [0, -85]
		}),
		station_occupied: L.icon({
			iconUrl: 'images/icons/station_occupied.png',
			iconSize: [60, 85],
			iconAnchor: [30, 85],
			popupAnchor: [0, -85]
		})
	};
    */
	$scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=" + API_KEY;
	NgMap.getMap().then(function (map) {
	  map.setZoom(12);
	  map.setCenter(49.5, 8.434);
	});

	var points = [];

	for (var i = 0; i < 10; i++) {
        points.push(AddVehicle(49.5 + Math.random() * 0.006, 8.434 + Math.random() * 0.001, "TEST", i));
	}
	 $scope.points = points;
  
	function AddVehicle(lat, lon, content, state) {

	  return {
	    name: content,
	    latitude: lat,
	    longitude: lon,
	    icon: 'images/icons/car_loading_25.png'
	  };


	}

	function AddStation(lat, lon, content, state) {

		var marker = new L.marker([lat, lon], {
			draggable: false,
			icon: icon_table.station_available
		});

		if (state % 2 === 0) {
			marker.setIcon(icon_table.station_occupied);
		}

		marker.bindPopup(content).openPopup();
		marker.addTo(map);

	}
    
	
    /*
    //TUTORIAL
    // https://ngmap.github.io/#/!custom-marker.html
    */

});


application.controller('Ctrl_Manage', function ($rootScope, $scope) {

	var bookings = [];
	var finishedBookings = [];

	for (var i = 0; i < 3; i++) {
		var booking = new Object();
		booking.date = "01.01.2017";
		booking.startTime = "1" + i + ":00";
		booking.startPlace = "Hauptstrasse 1";
		if (i === 0) {
			console.log("WRITE");
			booking.state = "true";
		} else {
			booking.state = "false";
		}

		bookings.push(booking);
	}

	for (var i = 0; i < 3; i++) {
		var booking = {
			date: "01.01.2017",
			startTime: "1" + i + ":00",
			startPlace: "Hauptstrasse 1",
			endTime: "1" + (i + 1) + ":00",
			endPlace: "Hauptstrasse 2",
			billing: "Preis: " + (i + 1) + "00 Euro",
			payed: "Bezahlt"
		};

		if (i % 2 !== 0)
			booking.payed = "Nicht bezahlt";

		finishedBookings.push(booking);
	}


	$scope.bookings = bookings;
	$scope.finishedBookings = finishedBookings;
	$scope.currentBooking = finishedBookings[0];

	$scope.ShowBilling = function (index) {
		console.log(index + "   " + finishedBookings[index].billing);
		$scope.currentBooking = finishedBookings[index];
	}

});


application.controller('Ctrl_Profile', function (RESTFactory, $rootScope, $scope) {

	//Dummy replaced by get call to backend
	var user = {
		userID : "12345",
		name : "Max",
		familyName: "Mustermann",
		email : "max.mustermann@gmail.com",
		phone : 12354356,
		address : {
			street : "Musterstrasse",
			number : 123,
			country : "Germany",
			zip: 234234,
			city: "Musterstadt"
		}
	}

	RESTFactory.GetUser(0).then(function (responseData) {
		$scope.user = responseData.data[0];
		console.log(responseData.data);
	}, function (response) {
		console.log(response);
	});

	/*
	if ($rootScope.user === null) {
	} else {
		$scope.user = $rootScope.user;
	}
	*/
	$scope.Safe = function () {


		var obj = new Object();
		obj.userID = $scope.userID;
		obj.name = $scope.name;
		obj.familyName = $scope.familyName;
		obj.email = $scope.email;
		obj.phoneNr = $scope.phoneNr;

		console.log(obj);

	};

	$scope.Cancel = function () {



	};

});
