'use strict';

describe('Testsuite: Managepage user', function () {

	var MainCtrl;
	var scope;
	var q;
	var deferred;

	var RESTFactory;
	var mdDialog;


	var booking_done_be;
	var bookings_response;
	var response_address;
	var response_trip;
	var response_chargingStation;
	var response_invoice;



	beforeEach(module('webApp'));
	beforeEach(module('ngAnimate'));
	beforeEach(module('ngRoute'));
	beforeEach(module('ngCookies'));

	beforeEach(function () {

		RESTFactory = {
			Bookings_Get_CustomerID: function (id) {
				deferred = q.defer();
				return deferred.promise;
			},
			Get_Address: function (lon, lat) {
				deferred = q.defer();
				return deferred.promise;
			},
			Invoices_Get_Items_ItemID: function (id) {
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
			Invoices_Get_Items: function (id) {
				deferred = q.defer();
				return deferred.promise;
			}
		};

		mdDialog = {
			show: function () {

			},
			hide: function () {

			}
		};

	});

	beforeEach(inject(function ($controller, $rootScope, $q) {
		
		spyOn(RESTFactory, 'Bookings_Get_CustomerID').and.callThrough();
		spyOn(RESTFactory, 'Get_Address').and.callThrough();
		spyOn(RESTFactory, 'Invoices_Get_Items_ItemID').and.callThrough();
		spyOn(RESTFactory, 'Trips_Get_TripID').and.callThrough();
		spyOn(RESTFactory, 'Charging_Stations_Get_Charging_StationID').and.callThrough();
		spyOn(RESTFactory, 'Invoices_Get_Items').and.callThrough();
		
		q = $q;
		scope = $rootScope.$new();
		
		MainCtrl = $controller('Ctrl_Manage', {
			$scope: scope,
			RESTFactory: RESTFactory,
			$mdDialog: mdDialog
		});

		//RESPONSE STUFF
		response_address = {
			'street': "Guntherstreet",
			'number': "23b",
			'zip': 77652,
			'city': "Offenburg"
		};

		//SCOPE STUFF
		scope.testing = true;

	}));


	it('Check if RESTFactory.Bookings_Get_CustomerID was called at init', function () {

		expect(RESTFactory.Bookings_Get_CustomerID).toHaveBeenCalled();

	});



	describe('Open Booking tests', function () {

		var booking_open_be;

		beforeEach(function () {
			booking_open_be = {
				"bookingId": 2,
				"customerId": 3,
				"tripId": null,
				"invoiceItemId": null,
				"bookingPositionLatitude": 50,
				"bookingPositionLongitude": 8,
				"bookingDate": "2017-06-08T12:04:00.000Z",
				"plannedDate": "2018-06-12T12:04:00.000Z"
			};
		});

		it('Check if openBooking was placed', function () {

			var data = [];
			data.push(booking_open_be);

			bookings_response = {
				'data': data
			};

			deferred.resolve(bookings_response);
			scope.$root.$digest();

			deferred.resolve(response_address);
			scope.$root.$digest();

			expect(scope.open_bookings).not.toBe(undefined);

		});	

		it('Check if openBooking date is converted from utc to now (plannedDate hour + 2)', function () {

			var plannedTime = "14:04";
			var bookingID = booking_open_be.bookingId;
			var data = [];
			data.push(booking_open_be);

			bookings_response = {
				'data': data
			};

			deferred.resolve(bookings_response);
			scope.$root.$digest();

			deferred.resolve(response_address);
			scope.$root.$digest();
			
			expect(scope.open_bookings[bookingID].start.time).toBe(plannedTime);

		});

		it('Check if openBooking will be shown onMap if under 30Minutes', function () {

			var now = new Date();
			now.setMinutes(now.getMinutes() + 20);
			now.setSeconds(0);
			now.setMilliseconds(0);

			booking_open_be.plannedDate = now.toUTCString();

			var bookingID = booking_open_be.bookingId;
			var data = [];
			data.push(booking_open_be);
			
			bookings_response = {
				'data': data
			};

			deferred.resolve(bookings_response);
			scope.$root.$digest();
			
			deferred.reject(response_address);
			scope.$root.$digest();

			expect(scope.open_bookings[bookingID].onMap).toBe(true);

		});

		it('Check if openBooking will not be shown onMap', function () {

			var now = new Date();
			now.setMinutes(now.getMinutes() + 32);
			now.setSeconds(0);
			now.setMilliseconds(0);

			booking_open_be.plannedDate = now.toUTCString();

			var bookingID = booking_open_be.bookingId;
			var data = [];
			data.push(booking_open_be);

			bookings_response = {
				'data': data
			};

			deferred.resolve(bookings_response);
			scope.$root.$digest();

			deferred.resolve(response_address);
			scope.$root.$digest();

			expect(scope.open_bookings[bookingID].onMap).toBe(false);

		});

		it('Check if address is set (using street "Guntherstreet")', function () {

			var bookingID = booking_open_be.bookingId;
			var data = [];
			data.push(booking_open_be);

			bookings_response = {
				'data': data
			};

			deferred.resolve(bookings_response);
			scope.$root.$digest();

			deferred.resolve(response_address);
			scope.$root.$digest();

			expect(scope.open_bookings[bookingID].start.address.street).toBe("Guntherstreet");

		});

	});



	describe('Done Booking tests', function () {

		var invoice_main;
		var bookingID = 3;
		var response_trip;
		var response_chargingStation;

		beforeEach(function () {
			booking_done_be = {
				"bookingId": bookingID,
				"customerId": 3,
				"tripId": 2,
				"invoiceItemId": 5,
				"bookingPositionLatitude": 50,
				"bookingPositionLongitude": 8,
				"bookingDate": "2016-06-05T12:14:10.797Z",
				"plannedDate": "2016-06-07T12:14:10.797Z"
			};

			invoice_main = {
				'invoiceId': 5,
				'totalAmount': 12.34,
				'customerId': 3,
				'paid': false
			};

			response_trip = {
				"tripId": 2,
				"carId": 10,
				"customerId": 3,
				"startDate": "2017-06-07T12:15:00.217Z",
				"endDate": "2017-06-07T13:15:00.217Z",
				"startChargingStationId": 2,
				"endChargingStationId": 3,
				"distanceTravelled": 10
			};

			response_chargingStation = {
				"chargingStationId": 2,
				"slots": 5,
				"slotsOccupied": 3,
				"latitude": 50,
				"longitude": 8
			};

			var b_data = [];

			b_data.push(booking_done_be);

			bookings_response = {
				'data': b_data
			};

		});

		beforeEach(function () {

			deferred.resolve(bookings_response);
			scope.$root.$digest();
		
		});

		it('Check if doneBooking was placed', function () {

			expect(scope.done_bookings).not.toBe(undefined);

		});

		describe('Done booking stuff', function () {
			

			describe('Success', function () {
				
				beforeEach(function () {
					//INVOICE
					deferred.resolve({ 'data': invoice_main });
					scope.$root.$digest();
				});

				it('Check if invoice is get', function () {

					expect(scope.done_bookings[bookingID].invoice.invoiceID).toBe(invoice_main.invoiceId);

				});

				it('Check if Trip is gettin called if invoice succeed', function () {

					expect(RESTFactory.Trips_Get_TripID).toHaveBeenCalled();

				});




				describe('Trip', function () {
					
					beforeEach(function () {
						//TRIP			
						deferred.resolve({ 'data': response_trip });
						scope.$root.$digest();
					});

					it('Check if trip is get', function () {

						expect(scope.done_bookings[bookingID].trip).not.toBe(undefined);

					});

					it('Check if trip is get correctly (using tripId = 2)', function () {

						expect(scope.done_bookings[bookingID].trip.tripID).toBe(response_trip.tripId);

					});


					describe('Start chargingstation tests', function () {

						beforeEach(function () {
							//START CHARGINGSTATION			
							deferred.resolve({ 'data': response_chargingStation });
							scope.$root.$digest();
							
							//ADDRESS
							deferred.resolve(response_address);
							scope.$root.$digest();
						});

						it('Check if get chargingstation and address is called', function () {

							expect(RESTFactory.Charging_Stations_Get_Charging_StationID).toHaveBeenCalled();
							expect(RESTFactory.Get_Address).toHaveBeenCalled();

						});

						it('Check if start chargingstation is get', function () {

							expect(scope.done_bookings[bookingID].start.address).not.toBe(undefined);

						});

						it('Check if start chargingstation and address are get correctly', function () {

							expect(scope.done_bookings[bookingID].start.address.street).toBe("Guntherstreet");

						});

						
						describe('End chargingstation tests', function () {

							beforeEach(function () {

								//END CHARGINGSTATION			
								deferred.resolve({ 'data': response_chargingStation });
								scope.$root.$digest();

								//START ADDRESS
								deferred.resolve(response_address);
								scope.$root.$digest();
						
							});


							it('Check if end chargingstation is get', function () {

								expect(scope.done_bookings[bookingID].end.address).not.toBe(undefined);

							});

							it('Check if end chargingstation and address are get correctly', function () {

								expect(scope.done_bookings[bookingID].end.address.street).toBe("Guntherstreet");

							});

						});

					});



				});


			});




			describe('Reject', function () {
				
				describe('Reject Invoice', function () {
					
					it('Check if Trip is gettin called if invoice failed', function () {

						//INVOICE
						deferred.reject({});
						scope.$root.$digest();

						expect(RESTFactory.Trips_Get_TripID).toHaveBeenCalled();

					});

				});

				describe('Reject Trip', function () {
					
					it('Get trip failing', function () {
						
						//INVOICE
						deferred.reject({});
						scope.$root.$digest();

						//TRIP
						deferred.reject({});
						scope.$root.$digest();
						
						expect(RESTFactory.Charging_Stations_Get_Charging_StationID).not.toHaveBeenCalled();

					});

					it('Get start station failing, end station failing', function () {

						//INVOICE
						deferred.reject({});
						scope.$root.$digest();

						//TRIP
						deferred.resolve({ 'data': response_trip });
						scope.$root.$digest();

						//START CHARGINGSTATION			
						deferred.reject({});
						scope.$root.$digest();

						//END CHARGINGSTATION
						deferred.reject({});
						scope.$root.$digest();


					});

					it('Get start station success, address failing', function () {

						//INVOICE
						deferred.reject({});
						scope.$root.$digest();

						//TRIP
						deferred.resolve({ 'data': response_trip });
						scope.$root.$digest();

						//START CHARGINGSTATION			
						deferred.resolve({ 'data': response_chargingStation });
						scope.$root.$digest();

						//START ADDRESS
						deferred.reject({});
						scope.$root.$digest();


					});

					it('Get end station success, address failing', function () {

						//INVOICE
						deferred.reject({});
						scope.$root.$digest();

						//TRIP
						deferred.resolve({ 'data': response_trip });
						scope.$root.$digest();

						//START CHARGINGSTATION			
						deferred.resolve({ 'data': response_chargingStation });
						scope.$root.$digest();

						//START ADDRESS
						deferred.reject({});
						scope.$root.$digest();

						//END CHARGINGSTATION			
						deferred.resolve({ 'data': response_chargingStation });
						scope.$root.$digest();

						//END ADDRESS
						deferred.reject({});
						scope.$root.$digest();

						expect(scope.done_bookings[bookingID].end.address).toBe(undefined);


					});

				});			

			});		
			

		});

	});



	describe('ShowonMap', function () {
		
		it('Show on map success', function () {
			
			var booking = {};

			booking.onMap = true;

			scope.ShowOnMap(booking);

		});


		it('Show on map success', function () {

			var booking = {};

			booking.onMap = false;

			scope.ShowOnMap(booking);

		});

	});



	describe('ShowBilling', function () {
		
		var bookingID = 3;

		beforeEach(function () {
			
			booking_done_be = {
				"bookingId": bookingID,
				"customerId": 3,
				"tripId": 2,
				"invoiceItemId": 5,
				"bookingPositionLatitude": 50,
				"bookingPositionLongitude": 8,
				"bookingDate": "2016-06-05T12:14:10.797Z",
				"plannedDate": "2016-06-07T12:14:10.797Z"
			};

			response_trip = {
				"tripId": 2,
				"carId": 10,
				"customerId": 3,
				"startDate": "2017-06-07T12:15:00.217Z",
				"endDate": "2017-06-07T13:15:00.217Z",
				"startChargingStationId": 2,
				"endChargingStationId": 3,
				"distanceTravelled": 10
			};

			response_chargingStation = {
				"chargingStationId": 2,
				"slots": 5,
				"slotsOccupied": 3,
				"latitude": 50,
				"longitude": 8
			};

			response_invoice = {
				'invoiceId': 5,
				'totalAmount': 12.34,
				'customerId': 3,
				'paid': false
			};

			var b_data = [];

			b_data.push(booking_done_be);

			bookings_response = {
				'data': b_data
			};

			deferred.resolve(bookings_response);
			scope.$root.$digest();

			//INVOICES			
			deferred.resolve({'data': response_invoice});
			scope.$root.$digest();

			//TRIP			
			deferred.resolve({'data': response_trip});
			scope.$root.$digest();

			//START CHARGINGSTATION			
			deferred.resolve({ 'data': response_chargingStation });
			scope.$root.$digest();
			
			//START ADDRESS
			deferred.resolve(response_address);
			scope.$root.$digest();

			//END CHARGINGSTATION			
			deferred.resolve({ 'data': response_chargingStation });
			scope.$root.$digest();

			//END ADDRESS
			deferred.resolve(response_address);
			scope.$root.$digest();

		});

		it('Show billing with billing is defined (items.length = 2)', function () {
			
			scope.ShowBilling(6, 2017);

			var i_data = [];

			var invoice_item = {
				"invoiceItemId": 2,
				"invoiceId": 8,
				"reason": "Grund",
				"type": 2,
				"amount": 10.35
			};

			var invoice_item2 = {
				"invoiceItemId": 5,
				"invoiceId": 8,
				"reason": "Grund",
				"type": 2,
				"amount": 10.35
			};

			i_data.push(invoice_item);
			i_data.push(invoice_item2);

			//INVOICE ITEMS
			deferred.resolve({'data': i_data});
			scope.$root.$digest();

			expect(scope.currentBill).not.toBe(undefined);
			expect(scope.currentBill.items.length).toBe(2);


		});

		it('Show billing with wrong month input (bill.active = false)', function () {

			scope.ShowBilling(7, 2017);

			expect(scope.currentBill).not.toBe(undefined);
			expect(scope.currentBill.active).toBe(false);


		});


	});

});
