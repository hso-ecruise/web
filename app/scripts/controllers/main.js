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
		},
		GetAddress: function(lat, lon){
			var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
			url += lat + "," + lon + "&key=" + API_KEY;
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
	  //REST Call
	  $rootScope.customerId = 12345;
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
	
	var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: new google.maps.LatLng(49.5, 8.434),
		mapTypeId: 'roadmap'
    });
	
	
	var icons = {
		car_available: {
			icon: "images/icons/car_available.png"
		},
		car_loading_25:{
			icon: "images/icons/car_loading_25.png"
		}
	};
	
	var image = {
		url: 'images/icons/car_available.png',
		scaledSize: new google.maps.Size(60, 96),
		origin: new google.maps.Point(0, 0),
    	anchor: new google.maps.Point(0, 32)
	};
	
	
	var CreateMarker = function(lat, lon, state){
		
		image.url = icons[state].icon;
		
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lon),
			map: map,
			icon: image
		});
		
	}
	
	CreateMarker(49.5, 8.434, "car_loading_25");
	CreateMarker(49.501, 8.434, "car_available");
	
	


});


application.controller('Ctrl_Manage', function ($rootScope, $scope, RESTFactory) {

	var open_bookings = [];
	var done_bookings = [];
	
	//Make REST Call to /bookings/by-customer/{CustomerID}
	
	//Offene Buchungen
	/*
		
		  {
			"BookingId": 0,
			"CustomerId": 0,
			"TripId": 0,
			"InvoiceId": 0,
			"BookedPositionLatitude": 0,
			"BookedPositionLongitude": 0,
			"BookingDate": "2017-04-23T11:52:57.780Z",
			"PlannedDate": "2017-04-23T11:52:57.780Z"
		  }
		
	*/
	
	
	
	var i = 0;

	for (i = 0; i < 3; i++) {
		
		//REST Call
		var return_obj = {
			BookingId: 0,
			CustomerId: 0,
			TripId: 0,
			InvoiceId: 0,
			BookedPositionLatitude: 50.127714,
			BookedPositionLongitude: 8.640663,
			BookingDate: "2017-04-23T11:52:57.780Z",
			PlannedDate: "2017-04-23T11:52:57.780Z"
		};
		
		
		
		var d = new Date(return_obj.PlannedDate);
		
		var day = d.getDate();
		var month = d.getMonth() + 1;
		var year = d.getFullYear();
		
		if(month < 10){
			month = "0" + month;
		}
		
		var start_date = day + "." + month + "." + year;
		var start_time = d.getHours() + ":" + d.getMinutes();
		
		RESTFactory.GetAddress(return_obj.BookedPositionLatitude, return_obj.BookedPositionLongitude).then(function(response){
			
			console.log(response);
			
			var ret = response.data.results[0].address_components;
			
			var address = { };
			
			for(var i = 0;i < ret.length; i++){
				
				for(var j = 0; j < ret[i].types.length; j++){
					switch(ret[i].types[j]){
						case "street_number":
							address.number = ret[i].long_name;
							break;
						case "route":
							address.street = ret[i].long_name;
							break;
						case "locality":
							address.city = ret[i].long_name;
							break;
						case "postal_code":
							address.zip = ret[i].long_name;
							break;
						default:
							break;
					}
				}
				
			}
			
			
			var start = {
				
				date: start_date,
				time: start_time,
				address: address
				
			};
			
			var booking = {
				bookingId: i,
				start: start
			};
			console.log(booking);
			
			if (i % 2 !== 0){
				booking.payed = "Nicht bezahlt";
			}
		
			open_bookings.push(booking);
			
			$scope.open_bookings = open_bookings;
		});
		
		
		
	//	var start_place = GeoCode_Reverse.geocodeLatLng(return_obj.BookedPositionLatitude, return_obj.BookedPositionLongitude);
		
	//	console.log(start_place);
		
		
	}



	$scope.ShowBilling = function (index) {
		console.log(index + "   " + finishedBookings[index].billing);
		$scope.currentBooking = finishedBookings[index];
	};

});


application.controller('Ctrl_Profile', function (RESTFactory, $rootScope, $scope) {
	
	var userID = "";
	
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
	   //REST call to get user data
	   userID = user.userID;
	  
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
			userID: userID,
			name: $scope.user.name,
			familyName: $scope.user.familyName,
			email: $scope.user.email,
			phoneNr: $scope.user.phoneNr
		};
		var address = {
			street: $scope.user.address.street,
			number: $scope.user.address.number,
			country: $scope.user.address.country,
			zip: $scope.user.address.zip,
			city: $scope.user.address.city
		};
		
		obj.address = address;
		
		console.log("Change Profile: ");
		console.log(obj);

	};

	$scope.Cancel = function () {

		//Reload data from backend

	};

	$scope.ChangePassword = function(){
	
		var old_password = $scope.user.password.old;
		var new_password = $scope.user.password.new;
		var new_password_conf = $scope.user.password.confirm;
		
		console.log("Change Password: " + old_password + "   " + new_password + "   " + new_password_conf);
		
		if (new_password === new_password_conf) {
			//Check if the old password is correct
			//make rest call with new password
		}

	};

});