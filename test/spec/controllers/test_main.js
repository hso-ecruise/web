'use strict';

describe('Testsuite: Helper', function () {
	
	var scope;
	var q;
	var deferred;
	var rootScope;
	var Helper;

	beforeEach(module('webApp'));
	beforeEach(module('ngAnimate'));
	beforeEach(module('ngMap'));
	beforeEach(module('ngRoute'));
	beforeEach(module('ngCookies'));
	
	beforeEach(inject(function ($injector, _Helper_) {

		rootScope = $injector.get('$rootScope');

		Helper = _Helper_;

	}));

	it("Check if Helper is injected", function () {

		expect(Helper).toBeDefined();

	});

	it('Get_Zeit from value null', function () {
		
		var val = Helper.Get_Zeit(null);

		expect(val.state).toBe(false);

	});

	it('Get_Zeit_Server from value null', function () {

		var val = Helper.Get_Zeit_Server(null);

		expect(val.state).toBe(false);

	});	

	it('Get_Zeit from where minutes < 10', function () {

		var d = new Date();
		d.setHours(5);
		d.setMinutes(8);

		var val = Helper.Get_Zeit(d);

		expect(val.time).toBe("5:08");

	});

	it('Get_Zeit_Server from where minutes < 10', function () {

		var d = new Date();
		d.setHours(5);
		d.setMinutes(8);

		var val = Helper.Get_Zeit_Server(d.toUTCString());

		expect(val.time).toBe("5:08");

	});

	it('Get_Zeit_Server with non utc string', function () {

		var d = "2017-06-11T15:37:21.776";
		var val = Helper.Get_Zeit_Server(d);

		expect(val.time).toBe("17:37");

	});


});


describe('Testsuite: Addrses in RESTFactory', function () {

	var scope;
	var q;
	var deferred;
	var rootScope;
	var GetCaller;

	beforeEach(module('webApp'));
	beforeEach(module('ngAnimate'));
	beforeEach(module('ngMap'));
	beforeEach(module('ngRoute'));
	beforeEach(module('ngCookies'));

	beforeEach(inject(function ($injector, _$q_, _GetCaller_) {

		var deferred = _$q_.defer();
		
		deferred.resolve({
			'data': {
				"results": [
					{
						"address_components": [
							{
								"long_name": "1",
								"short_name": "1",
								"types": ["street_number"]
							},
							{
								"long_name": "Altenbergstraße",
								"short_name": "Altenbergstraße",
								"types": ["route"]
							},
							{
								"long_name": "Schnait",
								"short_name": "Schnait",
								"types": ["political", "sublocality", "sublocality_level_1"]
							},
							{
								"long_name": "Weinstadt",
								"short_name": "Weinstadt",
								"types": ["locality", "political"]
							},
							{
								"long_name": "Rems-Murr-Kreis",
								"short_name": "Rems-Murr-Kreis",
								"types": ["administrative_area_level_3", "political"]
							},
							{
								"long_name": "Stuttgart",
								"short_name": "Süd",
								"types": ["administrative_area_level_2", "political"]
							},
							{
								"long_name": "Baden-Württemberg",
								"short_name": "BW",
								"types": ["administrative_area_level_1", "political"]
							},
							{
								"long_name": "Deutschland",
								"short_name": "DE",
								"types": ["country", "political"]
							},
							{
								"long_name": "71384",
								"short_name": "71384",
								"types": ["postal_code"]
							}
						]
					}
				]
			}
		});

		rootScope = $injector.get('$rootScope');

		GetCaller = _GetCaller_;

		spyOn(GetCaller, 'GetShort').and.returnValue(deferred.promise);
		
	}));

	it("Check if GetCaller is injected", function () {

		expect(GetCaller).toBeDefined();

	});

	it('Get address from coordinates', inject(function (RESTFactory) {

		var v = RESTFactory.Get_Address(48.794774, 9.398477);
		rootScope.$apply();
		v.then(function (response) {
			expect(response.street).toEqual("Altenbergstraße");
		}, function (response) {
			expect(response.street).toBe(undefined);
		});

	}));

});

describe('Testsuite: RESTFactory', function () {

	var scope;
	var q;
	var deferred;

	var RESTFactory;
	var GetCaller;
	var rootScope;

	var tripID = 1;
	var email = "login@ecruise.me";
	var customerID = 3;
	var chargingStationID = 5;
	var invoiceID = 7;
	var invoiceItemID = 9;

	var httpBackend;


	beforeEach(module('webApp'));
	beforeEach(module('ngAnimate'));
	beforeEach(module('ngMap'));
	beforeEach(module('ngRoute'));
	beforeEach(module('ngCookies'));
	

	beforeEach(inject(function ($injector, _RESTFactory_) {

		var response_address = {
			'data': {
				"results": [
					{
						"address_components": [
							{
								"long_name": "1",
								"short_name": "1",
								"types": ["street_number"]
							},
							{
								"long_name": "Altenbergstraße",
								"short_name": "Altenbergstraße",
								"types": ["route"]
							},
							{
								"long_name": "Schnait",
								"short_name": "Schnait",
								"types": ["political", "sublocality", "sublocality_level_1"]
							},
							{
								"long_name": "Weinstadt",
								"short_name": "Weinstadt",
								"types": ["locality", "political"]
							},
							{
								"long_name": "Rems-Murr-Kreis",
								"short_name": "Rems-Murr-Kreis",
								"types": ["administrative_area_level_3", "political"]
							},
							{
								"long_name": "Stuttgart",
								"short_name": "Süd",
								"types": ["administrative_area_level_2", "political"]
							},
							{
								"long_name": "Baden-Württemberg",
								"short_name": "BW",
								"types": ["administrative_area_level_1", "political"]
							},
							{
								"long_name": "Deutschland",
								"short_name": "DE",
								"types": ["country", "political"]
							},
							{
								"long_name": "71384",
								"short_name": "71384",
								"types": ["postal_code"]
							}
						]
					}
				]
			}
		}


		httpBackend = $injector.get('$httpBackend');
		rootScope = $injector.get('$rootScope');
		
		RESTFactory = _RESTFactory_;

		httpBackend.when('GET', 'https://maps.googleapis.com/maps/api/geocode/json?latlng=48.794774,9.398477&key=AIzaSyBCbY_MjWJ1cDjugF_MBHwnYDWFNJYAa4o&callback=initMap').respond(
			response_address
		);

		
		httpBackend.when('GET', 'https://api.ecruise.me/v1/trips/' + tripID).respond(
			{ 'status': 200 }
		);

		
		httpBackend.when('POST', 'https://api.ecruise.me/v1/public/login/' + email).respond(
			{ 'status': 200 }
		);

		httpBackend.when('POST', 'https://api.ecruise.me/v1/public/register').respond(
			{ 'status': 200 }
		);

		
		httpBackend.when('GET', 'https://api.ecruise.me/v1/customers/' + customerID).respond(
			{ 'status': 200 }
		);

		httpBackend.when('PATCH', 'https://api.ecruise.me/v1/customers/' + customerID + "/password").respond(
			{ 'status': 200 }
		);

		httpBackend.when('PATCH', 'https://api.ecruise.me/v1/customers/' + customerID + "/phone-number").respond(
			{ 'status': 200 }
		);

		httpBackend.when('PATCH', 'https://api.ecruise.me/v1/customers/' + customerID + "/email").respond(
			{ 'status': 200 }
		);

		httpBackend.when('PATCH', 'https://api.ecruise.me/v1/customers/' + customerID + "/address").respond(
			{ 'status': 200 }
		);

		
		httpBackend.when('GET', 'https://api.ecruise.me/v1/cars').respond(
			{ 'status': 200 }
		);

		httpBackend.when('GET', 'https://api.ecruise.me/v1/cars/charge-level-per-minute').respond(
			{ 'status': 200 }
		);

		
		httpBackend.when('GET', 'https://api.ecruise.me/v1/charging-stations').respond(
			{ 'status': 200 }
		);

		httpBackend.when('GET', 'https://api.ecruise.me/v1/charging-stations/' + chargingStationID).respond(
			{ 'status': 200 }
		);


		httpBackend.when('GET', 'https://api.ecruise.me/v1/invoices/' + invoiceID + "/items").respond(
			{ 'status': 200 }
		);

		httpBackend.when('GET', 'https://api.ecruise.me/v1/invoices/by-invoice-item/' + invoiceItemID).respond(
			{ 'status': 200 }
		);

		
		httpBackend.when('GET', 'https://api.ecruise.me/v1/bookings/by-customer/' + customerID).respond(
			{ 'status': 200 }
		);

		httpBackend.when('POST', 'https://api.ecruise.me/v1/bookings').respond(
			{ 'status': 200 }
		);

	}));


	it("Check if RESTFactory is injected", function () {
		
		expect(RESTFactory).toBeDefined();

	});


	describe('Trip', function () {
		
		it("Check if trip response is a 200", function () {

			httpBackend.expectGET('https://api.ecruise.me/v1/trips/' + tripID);
			var t = RESTFactory.Trips_Get_TripID(tripID);
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

	});

	describe('Login and register', function () {
		

		it("Check if login response is a 200", function () {

			httpBackend.expectPOST('https://api.ecruise.me/v1/public/login/' + email);
			var t = RESTFactory.User_Login(email);
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

		it("Check if register response is a 200", function () {

			var data = {};

			httpBackend.expectPOST('https://api.ecruise.me/v1/public/register');
			var t = RESTFactory.User_Register(data);
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});
	
	});

	describe('Getting and Patching custoemr Infos', function () {
		

		it("Check if getCustomer by ID response is a 200", function () {

			httpBackend.expectGET('https://api.ecruise.me/v1/customers/' + customerID);
			var t = RESTFactory.Customers_Get_CustomerID(customerID);
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

		it("Check if customer patch password response is a 200", function () {

			httpBackend.expectPATCH('https://api.ecruise.me/v1/customers/' + customerID + "/password");
			var t = RESTFactory.Customers_Patch_Password(customerID, "passwort123");
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

		it("Check if customer patch email response is a 200", function () {

			httpBackend.expectPATCH('https://api.ecruise.me/v1/customers/' + customerID + "/email");
			var t = RESTFactory.Customers_Patch_Email(customerID, "email@test.com");
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

		it("Check if customer patch phone response is a 200", function () {

			httpBackend.expectPATCH('https://api.ecruise.me/v1/customers/' + customerID + "/phone-number");
			var t = RESTFactory.Customers_Patch_PhoneNr(customerID, "12346324786");
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

		it("Check if customer patch address response is a 200", function () {

			httpBackend.expectPATCH('https://api.ecruise.me/v1/customers/' + customerID + "/address");
			var t = RESTFactory.Customers_Patch_Address(customerID, { 'address': {} });
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

	});	

	describe('Cars', function () {
		
		it("Check if getting all cars by ID response is a 200", function () {

			httpBackend.expectGET('https://api.ecruise.me/v1/cars/');
			var t = RESTFactory.Cars_Get();
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

		it("Check if chargelevelperminute response is a 200", function () {

			httpBackend.expectGET('https://api.ecruise.me/v1/cars/charge-level-per-minute');
			var t = RESTFactory.Cars_Get_ChargeLevelPerMinute();
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

	});

	describe('Charging stations', function () {
		
		it("Check if charging stations response is a 200", function () {

			httpBackend.expectGET('https://api.ecruise.me/v1/charging-stations');
			var t = RESTFactory.Charging_Stations_Get();
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

		it("Check if specific charging station response is a 200", function () {

			httpBackend.expectGET('https://api.ecruise.me/v1/charging-stations/' + chargingStationID);
			var t = RESTFactory.Charging_Stations_Get_Charging_StationID(chargingStationID);
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

	});

	describe('Invoices', function () {
		
		it("Check if invoiceItems by invoiceID response is a 200", function () {

			httpBackend.expectGET('https://api.ecruise.me/v1/invoices/' + invoiceID + "/items");
			var t = RESTFactory.Invoices_Get_Items(invoiceID);
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

		it("Check if invoice by invoiceItemID response is a 200", function () {

			httpBackend.expectGET('https://api.ecruise.me/v1/invoices/by-invoice-item/' + invoiceItemID);
			var t = RESTFactory.Invoices_Get_Items_ItemID(invoiceItemID);
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

	});

	describe('Bookings', function () {
		
		it("Check if bookings by customerID response is a 200", function () {

			httpBackend.expectGET('https://api.ecruise.me/v1/bookings/by-customer/' + customerID);
			var t = RESTFactory.Bookings_Get_CustomerID(customerID);
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

		it("Check if post booking by customerID response is a 200", function () {

			httpBackend.expectPOST('https://api.ecruise.me/v1/bookings');
			var t = RESTFactory.Bookings_Post(customerID, { 'booking': {} });
			rootScope.$apply();
			t.then(function (response) {
				expect(response.status).toBe(200);
			}, function (response) {
				expect(response.street).toBe(undefined);
			});

		});

	});
	

});