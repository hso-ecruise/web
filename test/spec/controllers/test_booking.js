'use strict';


describe('Testsuite: Bookingpage user', function () {

	var MainCtrl;
	var scope;
	var q;
	var deferred;

	var RESTFactory;
	var mdDialog;

	var address = {
		'street': "Guntherstreet",
		'number': "23b",
		'city': "Mannheim",
		'zip': 77652
	};

	var lat = 49.98;
	var lon = 9.48;
	var customerID = 3;

	beforeEach(module('webApp'));
	beforeEach(module('ngAnimate'));
	beforeEach(module('ngMap'));
	beforeEach(module('ngRoute'));
	beforeEach(module('ngCookies'));

	beforeEach(function () {
		RESTFactory = {
			Bookings_Post: function (data) {
				deferred = q.defer();
				return deferred.promise;
			},
			Cars_Get_ChargeLevelPerMinute: function () {
				deferred = q.defer();
				return deferred.promise;
			},
			Charging_Stations_Get: function () {
				deferred = q.defer();
				return deferred.promise;
			},
			Get_Address: function (lat, lon) {
				deferred = q.defer();
				return deferred.promise;
			},
			Bookings_Get_CustomerID: function (id) {
				deferred = q.defer();
				return deferred.promise;
			},
			Trips_Get_TripID: function (id) {
				deferred = q.defer();
				return deferred.promise;
			},
			Charging_Stations_Get_Charging_StationID: function (id) {
				deferred = q.defer();
				return deferred.promise;
			},
			Cars_Get: function () {
				deferred = q.defer();
				return deferred.promise;
			}

		};

		mdDialog = {
			show: function () {

			},
			hide: function () {

			}
		}

	});

	describe('Booking_Com Testsuite', function () {

		beforeEach(inject(function ($controller, $rootScope, $q) {

			spyOn(RESTFactory, 'Bookings_Post').and.callThrough();

			q = $q;
			scope = $rootScope.$new();
			MainCtrl = $controller('Ctrl_Booking_Com', {
				$scope: scope,
				RESTFactory: RESTFactory,
				$mdDialog: mdDialog
			});

		}));

		beforeEach(function () {

			//Setup scope
			scope.testing = true;
			scope.address = address;
			scope.lat = lat;
			scope.lon = lon;

		});


		describe('Wrong date/time inputs', function () {
			
			beforeEach(function () {
				var date = new Date();
				scope.date = date;

				var time = new Date();
				time.setSeconds(0);
				time.setMilliseconds(0);
				scope.time = time;
			});

			it('Check if alert is shown with wrong time input (wrong year)', function () {

				var date = new Date();
				date.setFullYear(date.getFullYear() - 1);
				scope.date = date;				

				spyOn(window, 'alert');

				scope.Save();

				expect(window.alert).toHaveBeenCalledWith("Die Startzeit liegt in der Vergangenheit. Bitte überprüfen Sie Ihre Eingaben.");

			});

			it('Check if alert is shown with wrong time input (wrong day)', function () {
				
				var date = new Date();
				date.setDate(date.getDate() - 1);
				date.setMinutes(5);
				scope.date = date;
				
				spyOn(window, 'alert');

				scope.Save();

				expect(window.alert).toHaveBeenCalledWith("Die Startzeit liegt in der Vergangenheit. Bitte überprüfen Sie Ihre Eingaben.");

			});

			it('Check if alert is shown with wrong time input (wrong minute)', function () {

				var time = new Date();
				time.setMinutes(time.getMinutes() - 1);
				time.setSeconds(0);
				time.setMilliseconds(0);
				scope.time = time;				

				spyOn(window, 'alert');

				scope.Save();

				expect(window.alert).toHaveBeenCalledWith("Die Startzeit liegt in der Vergangenheit. Bitte überprüfen Sie Ihre Eingaben.");

			});

		});


		describe('Time is set correctly', function () {

			beforeEach(function () {

				var date = new Date();
				date.setFullYear(date.getFullYear() + 1);
				scope.date = date;

				var time = new Date();
				time.setSeconds(0);
				time.setMilliseconds(0);
				scope.time = time;

			});

			it('Check if Post Booking in RESTFactory was called', function () {

				scope.Save();

				expect(RESTFactory.Bookings_Post).toHaveBeenCalled();

			});

			it('Check if alert is shown after saving resolve', function () {

				spyOn(window, 'alert');

				scope.Save();

				deferred.resolve({});
				scope.$root.$digest();

				expect(window.alert).toHaveBeenCalledWith("Buchung erfolgreich");

			});

			it('Check if alert is shown after saving reject', function () {

				spyOn(window, 'alert');

				scope.Save();

				deferred.reject({});
				scope.$root.$digest();

				expect(window.alert).toHaveBeenCalledWith("Buchung fehlgeschlagen");

			});

			it('Close mdDialog called after saving', function () {

				spyOn(scope, 'closeDialog').and.callThrough();

				scope.Save();

				expect(scope.closeDialog).toHaveBeenCalled();

			});

		});

	});

});