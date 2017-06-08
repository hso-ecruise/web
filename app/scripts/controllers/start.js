'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:Ctrl_Login
 * @description
 * # Ctrl_Login
 * Controller of the webApp
 */
application.controller('Ctrl_Login', function ($rootScope, $scope, $mdDialog, RESTFactory, Helper, $location) {

	/**
    * Description
    * @method closeDialog
    * @return 
    */
	$scope.closeDialog = function () {
		$mdDialog.hide();
	};

    /**
    * Description
    * @method Login
	* @return 
    */
	$scope.Login = function () {

		var email = $scope.login_email;
		var password = String($scope.login_password);

		var use_pwd = "\"" + password + "\"";

		RESTFactory.User_Login(email, use_pwd).then(function (response) {

			var data = response.data;

			$rootScope.token = data.token;
			$rootScope.customerID = data.id;

			$rootScope.loggedIN = true;
			$scope.loggedIN = true;

			//Save data in cookies
			Helper.Cookie_Set("loggedIN", true);
			Helper.Cookie_Set("token", data.token);
			Helper.Cookie_Set("customerID", data.id);
			Helper.Cookie_Set("password", password);

			$scope.login_email = "";
			$scope.login_password = "";

			$rootScope.$apply(function () { $location.path('/booking'); });

		}, function (response) {

			alert("Anmelden fehgeschlagen");

			$scope.login_password = "";

		});

		$scope.closeDialog();

	};


});

/**
 * @ngdoc function
 * @name webApp.controller:Ctrl_Register
 * @description
 * # Ctrl_Register
 * Controller of the webApp
 */
application.controller('Ctrl_Register', function ($rootScope, $scope, $mdDialog, Helper, RESTFactory) {

	var currentCustomer = {};
	currentCustomer.address = {};
	$scope.currentCustomer = currentCustomer;


	/**
	 * Description
	 * @method closeDialog
	 * @return 
	 */
	$scope.closeDialog = function () {
		$mdDialog.hide();
	};

	/**
	 * Description
	 * @method Register
	 * @return 
	 */
	$scope.Register = function () {

		var customer = $scope.currentCustomer;
		var address = customer.address;


		var name = customer.name;
		var familyName = customer.familyName;

		var email = customer.email;
		var password = customer.password;
		var phoneNr = customer.phoneNr;

		var country = address.country;
		var street = address.street;
		var number = address.number;
		var city = address.city;
		var zip = parseInt(address.zip);
		var extra = address.extra;

		if (extra === undefined) {
			extra = "";
		}


		if (email === undefined || familyName === undefined || name === undefined || password === undefined || phoneNr === undefined || country === undefined || street === undefined || number === undefined || city === undefined || zip === undefined) {
			alert("Bitte füllen Sie alle Felder aus");
			return;
		}

		if (email === "" || familyName === "" || name === "" || password === "" || phoneNr === "" || country === "" || street === "" || number === "" || city === "" || zip === "") {
			alert("Bitte füllen Sie alle Felder aus");
			return;
		}

		var data = {
			email: email,
			password: password,
			firstName: name,
			lastName: familyName,
			phoneNumber: phoneNr,
			country: country,
			street: street,
			houseNumber: number,
			city: city,
			zipCode: zip,
			addressExtraLine: extra
		};

		console.log(data);

		RESTFactory.User_Register(data).then(function (response) {

			alert("Bitte bestätigen Sie Ihre Email Adresse");

		}, function (response) {

			alert("Registrierung fehlgeschlagen");

		});

		$scope.closeDialog();

	}
});



/**
 * @ngdoc function
 * @name webApp.controller:Ctrl_Main
 * @description
 * # Ctrl_Main
 * Controller of the webApp
 */
application.controller('Ctrl_Main', function ($rootScope, $scope, $mdDialog, Helper, $location) {

	var inited = false;

	/**
	 * Description
	 * @method init
	 * @return 
	 */
	var init = function () {

		if (inited === true) {
			return;
		}

		var loggedIN = Helper.Cookie_Get("loggedIN");
		var token = Helper.Cookie_Get("token");
		var customerID = Helper.Cookie_Get("customerID");

		if (loggedIN !== "true") {
			loggedIN = false;
		}

		$rootScope.loggedIN = loggedIN;
		$rootScope.token = token;
		$rootScope.customerID = customerID;

		inited = true;

		$scope.loggedIN = $rootScope.loggedIN;

	};

	init();
	
	/**
	 * Description
	 * @method Logout
	 * @return 
	 */
	$scope.Logout = function () {

		//DELETE COOKIES

		$rootScope.token = undefined;
		$rootScope.customerID = undefined;

		$rootScope.loggedIN = false;
		$scope.loggedIN = false;

		Helper.Cookie_Set("loggedIN", false);
		Helper.Cookie_Set("token", "");
		Helper.Cookie_Set("customerID", "");

		$location.path('/start');

	};



	/**
	 * Description
	 * @method showLogin
	 * @return 
	 */
	$scope.showLogin = function () {

		$mdDialog.show({
			clickOutsideToClose: true,
			scope: $scope,
			preserveScope: true,
			template:
			'<md-dialog class="login-dialog">' +
			'	<md-dialog-content>' +
			'		<form name="form_Login" ng-submit="Login()">' +
			'			<md-toolbar class="md-hue-2">' +
			'				<div class="md-toolbar-tools">' +
			'					<h2 class="md-flex">Anmelden</h2>' +
			'				</div>' +
			'			</md-toolbar>' +

			'			<md-content flex layout-padding>' +

			'				<md-input-container>' +
			'					<input placeholder="E-Mail" type="text" ng-model="login_email" pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,3}$" ng-required="true" />' +
			'				</md-input-container>' +
			//PASSWORT LÄNGE AUF 8 SETZEN
			'				<md-input-container>' +
			'					<input placeholder="Passwort" type="password" pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,}" title="Passwort muss mindestens eine Zahl und einen kleinen oder großen Buchstaben enthalten und mindestens 8 Zeichen lang sein" ng-model="login_password" ng-required="true" /> ' +
			'				</md-input-container>' +

			'			</md-content>' +

			'			<md-content flex layout-padding>' +
			'				<input type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;" ng-disabled="form_Login.$invalid" value=""/>' +
			'				<md-button class="md-raised md-primary button-to-right" ng-disabled="form_Login.$invalid" ng-click="Login()"> Login </md-button>' +
			'			</md-content>' +
			'		</form>' +
			'	</md-dialog-content>' +
			'</md-dialog>',

			controller: 'Ctrl_Login'
		});

	};



	/**
	 * Description
	 * @method showRegister
	 * @return 
	 */
	$scope.showRegister = function () {

		$mdDialog.show({
			clickOutsideToClose: true,
			scope: $scope,
			preserveScope: true,
			template:
			'<md-dialog class="login-dialog">' +
			'	<md-dialog-content>' +

			'		<form name="form_Register" ng-submit="Register()">' +
			'			<md-toolbar class="md-hue-2">' +
			'				<div class="md-toolbar-tools">' +
			'					<h2 class="md-flex">Registieren</h2>' +
			'				</div>' +
			'			</md-toolbar>' +

			'			<md-content flex layout-padding>' +
			'				<md-input-container>' +
			'					<label>Vorname</label>' +
			'					<input ng-model="currentCustomer.name" pattern="[A-Z]{1}[a-z]{1,}([-\s]{1}[A-Z]{1}[a-z]{1,}){0,}" ng-required="true" />' +
			'				</md-input-container>' +

			'				<md-input-container>' +
			'					<label>Nachname</label>' +
			'					<input ng-model="currentCustomer.familyName" pattern="[A-Z]{1}[a-z]{1,}([-\s]{1}[A-Z]{1}[a-z]{1,}){0,}" ng-required="true" />' +
			'				</md-input-container>' +
			'			</md-content>' +

			'			<md-content flex layout-padding>' +
			'				<md-input-container>' +
			'					<label>Email</label>' +
			'					<input type="text" pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,3}$" title="E-Mail muss folgend aufgebaut sein: xxx@yyy.zzz" ng-model="currentCustomer.email"  ng-required="true" />' +
			'				</md-input-container>' +

			'				<md-input-container>' +
			'					<label>Passwort</label>' +
			'					<input type="password" pattern="(?=.*[a-z])(?=.*[0-9]).{8,}" title="Passwort muss mindestens eine Zahl und einen kleinen oder großen Buchstaben enthalten und mindestens 8 Zeichen lang sein" ng-model="currentCustomer.password" ng-required="true" />' +
			'				</md-input-container>' +
			'			</md-content>' +

			'			<md-content flex layout-padding>' +
			'				<md-input-container flex-gt-sm>' +
			'					<input type="text" placeholder="Telefon" ng-model="currentCustomer.phoneNr" ng-disabled="editDisabled" required="true" pattern="[\+]{0,1}[0-9]{8,}" />' +
			'				</md-input-container>' +
			'				<md-input-container flex-gt-sm>' +
			'						<input type="text" placeholder="Land" maxlength="2" ng-model="currentCustomer.address.country" ng-disabled="editDisabled" required="true" pattern="[A-Z]{2,3}" title="Bitte geben Sie Ihr Länderkürzel an"  />' +
			'				</md-input-container>' +
			'			</md-content>' +

			'			<md-content flex layout-padding>' +
			'				<md-input-container flex-gt-sm>' +
			'					<input type="text" placeholder="Straße" ng-model="currentCustomer.address.street" ng-disabled="editDisabled" required="true" pattern="[A-Za-z\-\s]{5,}" title="Verwenden Sie \'ss\' statt \'ß\' " />' +
			'				</md-input-container>' +
			'				<md-input-container flex-gt-sm>' +
			'					<input type="text" placeholder="Nr" ng-model="currentCustomer.address.number" ng-disabled="editDisabled" required="true" pattern="[0-9]{1,}.*" />' +
			'				</md-input-container>' +
			'			</md-content>' +

			'			<md-content flex layout-padding>' +
			'				<md-input-container flex-gt-sm>' +
			'					<input type="text" placeholder="Stadt" ng-model="currentCustomer.address.city" ng-disabled="editDisabled" required="true" pattern="[A-Za-z\-\s]{3,}" />' +
			'				</md-input-container>' +
			'				<md-input-container flex-gt-sm>' +
			'					<input type="text" placeholder="PLZ" ng-model="currentCustomer.address.zip" pattern="[0-9]{5}" ng-disabled="editDisabled" required="true"/>' +
			'				</md-input-container>' +
			'			</md-content>' +

			'			<md-content flex layout-padding>' +
			'				<md-input-container flex-gt-sm>' +
			'					<input type="text" placeholder="Extra" ng-model="currentCustomer.address.extra" ng-disabled="editDisabled"/>' +
			'				</md-input-container>' +
			'			</md-content>' +

			'			<md-content flex layout-padding>' +
			'				<input type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;" ng-disabled="form_Register.$invalid" value=""/>' +
			'				<md-button class="md-raised md-primary button-to-right" ng-disabled="form_Register.$invalid" ng-click="Register()"> Registrieren </md-button>' +
			'			</md-content>' +
			'		</form>' +

			'	</md-dialog-content>' +
			'</md-dialog>',

			controller: 'Ctrl_Register'

		});

	};

});
