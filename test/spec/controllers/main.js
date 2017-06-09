'use strict';

describe('Testsuite: Startpage user', function () {
	
	var MainCtrl;
	var scope;
	var q;
	var deferred;

	var RESTFactory;
	var Helper;
	var mdDialog;

	beforeEach(module('webApp'));
	beforeEach(module('ngAnimate'));
	beforeEach(module('ngMap'));
	beforeEach(module('ngRoute'));
	beforeEach(module('ngCookies'));
	
	beforeEach(function () {
		RESTFactory = {
			User_Login: function (email, pwd) {
				deferred = q.defer();
				return deferred.promise;
			},
			User_Register: function (data) {
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

	describe('Login Testsuite', function() {
		
		var login_response;	


		beforeEach(inject(function ($controller, $rootScope, $q) {
			q = $q;
			scope = $rootScope.$new();
			MainCtrl = $controller('Ctrl_Login', {
				$scope: scope,
				RESTFactory: RESTFactory,
				$mdDialog: mdDialog
			});

			//RESPONSE STUFF			
			login_response = { 'data': { 'token': '1234567890', 'id': 3 } };
			
			//SCOPE STUFF
			scope.testing = true;
			scope.login_email = "tkorten@ecruise.me";
			scope.login_password = 'test1234';

		}));

		
		it('Check if Login in RESTFactory was called', function () {

			spyOn(RESTFactory, 'User_Login').and.callThrough();

			scope.Login();

			expect(RESTFactory.User_Login).toHaveBeenCalled();

		});

		it('Check if loggedIN is set to true', function () {

			scope.Login();

			deferred.resolve(login_response);
			scope.$root.$digest();

			expect(scope.loggedIN).toBe(true);

		});

		it('Check if customerID is set to 3', function () {

			scope.Login();

			deferred.resolve(login_response);
			scope.$root.$digest();

			expect(parseInt(scope.customerID)).toBe(3);

		});

		it('Check if token ist set to 1234567890', function () {

			scope.Login();

			deferred.resolve(login_response);
			scope.$root.$digest();

			expect(scope.token).toBe('1234567890');

		});

		it('Close mdDialog called', function () {

			spyOn(scope, 'closeDialog').and.callThrough();

			scope.Login();

			expect(scope.closeDialog).toHaveBeenCalled();

		});

		
		it('Check if password is cleared', function () {

			scope.Login();

			deferred.reject({});
			scope.$root.$digest();

			expect(scope.login_password).toBe("");

		});
		
	});




	describe('Register Testsuite', function () {

		var register_response;


		beforeEach(inject(function ($controller, $rootScope, $q) {
			q = $q;
			scope = $rootScope.$new();
			MainCtrl = $controller('Ctrl_Register', {
				$scope: scope,
				RESTFactory: RESTFactory,
				$mdDialog: mdDialog
			});


			//RESPONSE STUFF
			register_response = { 'data': { 'id': 4 } };

			//SCOPE STUFF
			var currntCustomer = {
				name: "Tobias",
				familyName: "Korten",
				email: "tkorten@ecruise.me",
				password: "test1234",
				phoneNr: "0123456789",
				address: {
					country: "DE",
					street: "Street",
					number: "23b",
					city: "Offenburg",
					zip: 77652,
					extra: ""
				}
			};

			scope.currentCustomer = currntCustomer;

		}));

		it('Check if Register in RESTFactory was called', function () {

			spyOn(RESTFactory, 'User_Register').and.callThrough();

			scope.Register();

			expect(RESTFactory.User_Register).toHaveBeenCalled();

		});

		it('Check if register is called successful', function () {

			spyOn(window, 'alert');

			scope.Register();

			deferred.resolve(register_response);
			scope.$root.$digest();

			expect(window.alert).toHaveBeenCalledWith("Bitte bestätigen Sie Ihre Email Adresse");

		});

		it('Check if register is is called failing', function () {

			spyOn(window, 'alert');

			scope.Register();

			deferred.reject({});
			scope.$root.$digest();

			expect(window.alert).toHaveBeenCalledWith("Registrierung fehlgeschlagen");

		});

		it('Check if register is called successful with extra = undefined', function () {

			spyOn(window, 'alert');

			scope.currentCustomer.address.extra = undefined;

			scope.Register();

			deferred.resolve(register_response);
			scope.$root.$digest();

			expect(window.alert).toHaveBeenCalledWith("Bitte bestätigen Sie Ihre Email Adresse");

		});

		it('Check if alert is shown, when value is undefined', function () {

			spyOn(window, 'alert');

			scope.currentCustomer.email = undefined;

			scope.Register();

			expect(window.alert).toHaveBeenCalledWith("Bitte füllen Sie alle Felder aus");

		});

		it('Check if alert is shown, when value is ""', function () {

			spyOn(window, 'alert');

			scope.currentCustomer.email = "";

			scope.Register();

			expect(window.alert).toHaveBeenCalledWith("Bitte füllen Sie alle Felder aus");

		});

		it('Close mdDialog called', function () {

			spyOn(scope, 'closeDialog').and.callThrough();

			scope.Register();

			expect(scope.closeDialog).toHaveBeenCalled();

		});
			

	});


	describe('Main Testsuite', function () {

		beforeEach(inject(function ($controller, $rootScope, $q) {

			q = $q;
			scope = $rootScope.$new();
			MainCtrl = $controller('Ctrl_Main', {
				$scope: scope,
				$mdDialog: mdDialog
			});

		}));

		afterEach(function () {
			scope.Logout();
		})

		it('Check if loggedIN is set true after previous tests, where the login was set true', function () {

			expect(scope.loggedIN).toBe(true);

		});

		it('Check if Login clears values', function () {
			
			scope.Logout();
			
			expect(scope.loggedIN).toBe(false);

		});

		it('Check if $mdDialog.show is called when showLogin is called', function () {

			spyOn(mdDialog, 'show').and.callThrough();

			scope.showLogin();

			expect(mdDialog.show).toHaveBeenCalled();

		});

		it('Check if $mdDialog.show is called when showRegister is called', function () {

			spyOn(mdDialog, 'show').and.callThrough();

			scope.showRegister();

			expect(mdDialog.show).toHaveBeenCalled();

		});

	});	

});
