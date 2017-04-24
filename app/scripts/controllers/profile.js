'use strict';

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
