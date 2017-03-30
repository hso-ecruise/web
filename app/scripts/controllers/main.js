'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });


var application = angular.module('webApp', [
	'ngAnimate',
	'ngMaterial'
]);

application.controller('Ctrl_Main', function ($rootScope, $scope) {

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

	var bookings = [];

	for (var i = 0; i < 10; i++) {
		var booking = new Object();
		booking.date = "01.01.2017";
		booking.startTime = "10:00";
		booking.startPlace = "Hauptstraße 1";
		if (i % 2 === 0) {
			booking.state = "true";
		} else {
			booking.state = "false";
		}

		bookings.push(booking);
	}

	$scope.bookings = bookings;

});


application.controller('Ctrl_Profile', function ($rootScope, $scope) {

	$scope.userID = "12345";
	$scope.name = "Max";
	$scope.familyName = "Mustermann";
	$scope.email = "max.mustermann@gmail.com";
	$scope.phoneNr = 12354356;

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