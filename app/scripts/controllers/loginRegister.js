'use strict';

application.controller('Ctrl_Login_Register', function ($rootScope, $scope, $location) {

  $scope.Login = function () {

    var email = $scope.login.email;
    var password = $scope.login.password;
    console.log("LOGIN " + email + "   " + password);

    if (email === "test" && password === "test") {
      $rootScope.loggedIN = "true";
	//      $rootScope.currentView = "booking";
	if (email === "test" && password === "test") {
	    $rootScope.loggedIN = "true";
	    $location.path("/booking");
	    $rootScope.customerId = 12345;
	}
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
