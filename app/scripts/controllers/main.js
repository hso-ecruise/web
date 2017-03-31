'use strict';








/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */

var application = angular.module('webApp', [
	'ngAnimate',
	'ngMaterial'
]);

application.controller('Ctrl_Login_Register', function ($rootScope, $scope) {

	$scope.login_register = 'login';
	$rootScope.loggedIN = "false";
	
	$scope.Login = function () {

		var email = $scope.login.email;
		var password = $scope.login.password;

		if (email === "test" && password === "test") {
			$rootScope.loggedIN = "true";
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

application.controller('Ctrl_Main', function ($rootScope, $scope) {

	$rootScope.loggedIN = "false";

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


application.controller('Ctrl_Booking', function ($rootScope, $scope) {

	$scope.initialize = function () {
		var map = new google.maps.Map(document.getElementById('map'), {
			center: { lat: -34.397, lng: 150.644 },
			zoom: 8
		});
	}

	google.maps.event.addDomListener(window, 'load', $scope.initialize);


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
			billing: "Preis: " + (i+1) + "00 Euro",
			payed: "Bezahlt"
		}

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


application.controller('Ctrl_Profile', function ($rootScope, $scope) {

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

	if ($rootScope.user === null) {
		$scope.user = user;
	} else {
		$scope.user = $rootScope.user;
	}

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