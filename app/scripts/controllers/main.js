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
    'ngMap'
]);





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








application.controller('Ctrl_Main', function ($rootScope, $scope) {

  var init = function () {

    $rootScope.loggedIN = "false";

  };

  init();



  $scope.ChangeView = function (input) {

    $scope.currentView = input;
    
  };

});




application.controller('Ctrl_Login_Register', function ($rootScope, $scope) {

  $scope.Login = function () {

    var email = $scope.login.email;
    var password = $scope.login.password;
    console.log("LOGIN " + email + "   " + password);

    if (email === "test" && password === "test") {
      $rootScope.loggedIN = "true";
      $rootScope.currentView = "booking";
    }

  };

  var init = function () {

    $scope.loginORregister = "login";

  };

  init();


	
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
      
	  $scope.loginORregister = state;

	};

});




application.controller('Ctrl_Booking', function ($rootScope, $scope, NgMap) {

	function AddVehicle(lat, lon, content, state) {

	  return {
	    name: content,
	    latitude: lat,
	    longitude: lon,
	    icon: 'images/icons/car_loading_25.png'
	  };


	}

	function AddStation(lat, lon, content, state) {
/*
		var marker = new L.marker([lat, lon], {
			draggable: false,
			icon: icon_table.station_available
		});

		if (state % 2 === 0) {
			marker.setIcon(icon_table.station_occupied);
		}

		marker.bindPopup(content).openPopup();
		marker.addTo(map);
*/
	}


  $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=" + API_KEY;

	NgMap.getMap().then(function (map) {
	  map.setZoom(12);
	  map.setCenter(new google.maps.LatLng(49.5, 8.434));
	});

	var points = [];

	for (var i = 0; i < 10; i++) {
        points.push(new AddVehicle(49.5 + Math.random() * 0.006, 8.434 + Math.random() * 0.001, "TEST", i));
	}
	 $scope.points = points;
  
	
    
	
    /*
    //TUTORIAL
    // https://ngmap.github.io/#/!custom-marker.html
    */

});


application.controller('Ctrl_Manage', function ($rootScope, $scope) {

	var bookings = [];
	var finishedBookings = [];

	var i = 0;

	for (i = 0; i < 3; i++) {
		var booking = {
			date: "01.01.2017",
			startTime: "1" + i + ":00",
			startPlace: "Hauptstrasse 1",
			endTime: "1" + (i + 1) + ":00",
			endPlace: "Hauptstrasse 2",
			billing: "Preis: " + (i + 1) + "00 Euro",
			payed: "Bezahlt"
		};

		if (i % 2 !== 0){
			booking.payed = "Nicht bezahlt";
		}
		
		bookings.push(booking);
	}

	for (i = 0; i < 3; i++) {
		var booking2 = {
			date: "01.01.2017",
			startTime: "1" + i + ":00",
			startPlace: "Hauptstrasse 1",
			endTime: "1" + (i + 1) + ":00",
			endPlace: "Hauptstrasse 2",
			billing: "Preis: " + (i + 1) + "00 Euro",
			payed: "Bezahlt"
		};

		if (i % 2 !== 0){
			booking2.payed = "Nicht bezahlt";
		}
		
		finishedBookings.push(booking2);
	}


	$scope.bookings = bookings;
	$scope.finishedBookings = finishedBookings;
	$scope.currentBooking = finishedBookings[0];

	$scope.ShowBilling = function (index) {
		console.log(index + "   " + finishedBookings[index].billing);
		$scope.currentBooking = finishedBookings[index];
	};

});


application.controller('Ctrl_Profile', function (RESTFactory, $rootScope, $scope) {

	//Dummy replaced by get call to backend
	var user = {
		userID : "12345",
		name : "Max",
		familyName: "Mustermann",
		email : "max.mustermann@gmail.com",
		phoneNr : 12354356,
		address : {
			street : "Musterstrasse",
			number : 123,
			country : "Germany",
			zip: 234234,
			city: "Musterstadt"
		}
	};


	var init = function () {

	   $scope.user = user;
	  
	};

	init();

	/*
	if ($rootScope.user === null) {
	} else {
		$scope.user = $rootScope.user;
	}
	*/
	$scope.Safe = function () {


		var obj = {
			userID: $scope.userID,
			name: $scope.name,
			familyName: $scope.familyName,
			email: $scope.email,
			phoneNr: $scope.phoneNr
		};
		
		console.log(obj);

	};

	$scope.Cancel = function () {



	};

	$scope.ChangePassword = function(){
	
	  var old_password = $scope.user.password.old;
	  var new_password = $scope.user.password.new;
	  var new_password_conf = $scope.user.password.confirm;

	  if (new_password === new_password_conf) {
	    //Check if the old password is correct
        //make rest call with new password
	  }

	};

});