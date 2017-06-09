'use strict';

describe('Testsuite: Profilepage user', function () {
	
	beforeEach(module('webApp'));
	beforeEach(module('ngAnimate'));
	beforeEach(module('ngMap'));
	beforeEach(module('ngRoute'));
	beforeEach(module('ngCookies'));
	
	describe('Mainchanges Testsuite', function () {
		
		var MainCtrl;
		var scope;
		var RESTFactory;
		var Helper;
		var q;
		var deferred;

		var user_data;


		beforeEach(function () {

			user_data = {
				'data': {
					'customerId': 3,
					'email': 'tkorten@ecruise.me',
					'phoneNumber': '1234567890',
					'firstName': 'Tobias',
					'lastName': 'Korten',
					'password': 'test1234',
					'chipCardUid': '422163126',
					'activated': true,
					'verified': false,
					'country': 'DE',
					'city': 'Offenburg',
					'zipCode': 77652,
					'street': 'Street',
					'houseNumber': '23b',
					'addressExtraLine': ''
				}
			};

			RESTFactory = {
				Customers_Get_CustomerID: function (id) {
					deferred = q.defer();
					return deferred.promise;
				},
				Customers_Patch_PhoneNr: function (id, phoneNr) {
					deferred = q.defer();
					return deferred.promise;
				},
				Customers_Patch_Address: function (id, address) {
					deferred = q.defer();
					return deferred.promise;
				},
				Customers_Patch_Password: function (id, pwd) {
					deferred = q.defer();
					return deferred.promise;
				},
				Customers_Patch_Email: function (id, email) {
					deferred = q.defer();
					return deferred.promise;
				}
			};

		});

		beforeEach(inject(function ($controller, $rootScope, $q) {
			q = $q;
			scope = $rootScope.$new();
			MainCtrl = $controller('Ctrl_Profile', {
				$scope: scope,
				RESTFactory: RESTFactory
			});

			scope.testing = true;
			scope.customerID = 3;

		}));

		it('Check if RESTFactory.Customers_Get_CustomerID was called at init', function () {

			spyOn(RESTFactory, 'Customers_Get_CustomerID').and.callThrough();

			scope.init();

			expect(RESTFactory.Customers_Get_CustomerID).toHaveBeenCalled();

		});

		it('Check if oldUser is set to user_data after init. Therefore use email', function () {

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			expect(scope.oldUser.email.current).toBe('tkorten@ecruise.me');

		});

		it('Check if user is set to user_data after init. Therefore use email', function () {

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			expect(scope.user.email.current).toBe('tkorten@ecruise.me');

		});

		it('Check if phoneNr can be changed successful', function () {

			spyOn(window, 'alert');

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			scope.user.phoneNr = "0987654321";

			scope.Safe();

			deferred.resolve(user_data);
			scope.$root.$digest();

			expect(window.alert).toHaveBeenCalledWith("Telefonnummer wurde erfolgreich geändert");

		});

		it('Check if phoneNr can be changed failed', function () {

			spyOn(window, 'alert');

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			scope.user.phoneNr = "0987654321";

			scope.Safe();

			deferred.reject(user_data);
			scope.$root.$digest();

			expect(window.alert).toHaveBeenCalledWith("Telefonnummer konnte nicht geändert werden");

		});

		it('Check if address can be changed successful (using street)', function () {

			spyOn(window, 'alert');

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			scope.user.address.street = "superdooperstreet";

			scope.Safe();

			deferred.resolve(user_data);
			scope.$root.$digest();

			expect(window.alert).toHaveBeenCalledWith("Adresse wurde erfolgreich geändert");

		});

		it('Check if address can be changed failed (using street)', function () {

			spyOn(window, 'alert');

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			scope.user.address.street = "superdooperstreet";

			scope.Safe();

			deferred.reject(user_data);
			scope.$root.$digest();

			expect(window.alert).toHaveBeenCalledWith("Adresse konnte nicht geändert werden");

		});



		it('Check if cancel resets data (useing email)', function () {

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			scope.user.email.current = "test@ecruise.me";

			expect(scope.user.email.current).not.toBe("tkorten@ecruise.me");

			scope.Cancel();

			deferred.resolve(user_data);
			scope.$root.$digest();

			expect(scope.user.email.current).toBe("tkorten@ecruise.me");

		});

		
		it('Check if password can be changed successful', function () {

			spyOn(window, 'alert');

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			scope.user.password.current = "test1234";
			scope.user.password.new = "test12345";
			scope.user.password.confirm = "test12345";

			scope.ChangePassword();

			deferred.resolve({});
			scope.$root.$digest();

			expect(window.alert).toHaveBeenCalledWith("Passwort wurde erfolgreich geändert. Bitte melden Sie sich neu an.");

		});

		it('Check if password can be changed failing', function () {

			spyOn(window, 'alert');

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			scope.user.password.current = "test1234";
			scope.user.password.new = "test12345";
			scope.user.password.confirm = "test12345";

			scope.ChangePassword();

			deferred.reject({});
			scope.$root.$digest();

			expect(window.alert).toHaveBeenCalledWith("Passwort konnte nicht geändert werden");

		});


		it('Check if password is typed in with text (using "test12345")', function () {

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			scope.user.password.current = "test12345";

			scope.pwdInPressed();

			expect(scope.pwd_required).toBe(true);

		});

		it('Check if password is typed in with text (using undefined)', function () {

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			scope.user.password.current = undefined;

			scope.pwdInPressed();

			expect(scope.pwd_required).toBe(false);

		});



		it('Check if email can be changed successful', function () {

			spyOn(window, 'alert');

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			scope.user.email.new = "test@ecruise.me";
			scope.user.email.confirm = "test@ecruise.me";

			scope.ChangeEmail();

			deferred.resolve({});
			scope.$root.$digest();

			expect(window.alert).toHaveBeenCalledWith("Email wurde erfolgreich geändert. Bitte melden Sie sich neu an.");

		});

		it('Check if email can be changed failing', function () {

			spyOn(window, 'alert');

			scope.init();

			deferred.resolve(user_data);
			scope.$root.$digest();

			scope.user.email.new = "test@ecruise.me";
			scope.user.email.confirm = "test@ecruise.me";

			scope.ChangeEmail();

			deferred.reject({});
			scope.$root.$digest();

			expect(window.alert).toHaveBeenCalledWith("Email konnte nicht geändert werden");

		});

	});
});
