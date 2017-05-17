'use strict';

application.controller('Ctrl_Profile', function (RESTFactory, $rootScope, $scope, Helper) {
    
	var customerID = $rootScope.customerID;
	
	var oldUser = {};
	
	$scope.customerID = customerID;
	
	
	function LoadData(){
		
		var prom_data = RESTFactory.Customers_Get_CustomerID(customerID);
		
		prom_data.then(function(response){
			
			var data = response.data;
			
			var user = {
				userID: customerID,
				name: data.firstName,
				familyName: data.lastName,
				email: {
					current: data.email
				},
				phoneNr: data.phoneNumber,
				address: {
					street: data.street,
					number: data.houseNumber,
					country: data.country,
					city: data.city,
					zip: data.zipCode,
					extra: data.addressExtraLine
				},
				activated: data.activated,
				verified: data.verified
				
			};
			
			var password = {};
			user.password = password;
			
			oldUser = {
				userID: customerID,
				name: data.firstName,
				familyName: data.lastName,
				email: {
					current: data.email
				},
				phoneNr: data.phoneNumber,
				address: {
					street: data.street,
					number: data.houseNumber,
					country: data.country,
					city: data.city,
					zip: data.zipCode,
					extra: data.addressExtraLine
				},
				activated: data.activated,
				verified: data.verified
				
			};
			
			$scope.user = user;
			$scope.$apply();
			
		}, function(response){
			
		});
		
		
	}
	
    


    var init = function () {
		
		LoadData();
	
    };

    init();

	
    $scope.Safe = function () {

		var changedPhone = {
			phoneNumber: $scope.user.phoneNr
		};
		
		if(changedPhone.phoneNumber !== oldUser.phoneNr){
			
			RESTFactory.Customers_Patch_PhoneNr(customerID, changedPhone).then(function(response){
				LoadData();
				alert("Telefonnummer wurde erfolgreich geändert");
			}, function(response){
				LoadData();
				alert("Telefonnummer konnte nicht geändert werden");
			});
			
			
		}else{
			console.log("Nothing to change Phone");
		}
		
		
		
		var address = {
			country: $scope.user.address.country,
			city: $scope.user.address.city,
			zipCode: $scope.user.address.zip,
			street: $scope.user.address.street,
			houseNumber: $scope.user.address.number,
			addressExtraLine: $scope.user.address.extra
		};
		
		if(	address.country !== oldUser.address.country || 
			address.city !== oldUser.address.city ||
			address.zipCode !== oldUser.address.zip ||
			address.street !== oldUser.address.street ||
			address.houseNumber !== oldUser.address.number ||
			address.addressExtraLine !== oldUser.address.extra)
		{
		
			RESTFactory.Customers_Patch_Address(customerID, address).then(function(response){
				LoadData();
				alert("Adresse wurde erfolgreich geändert");
			}, function(reponse){
				LoadData();
				alert("Adresse konnte nicht geändert werden");
			});
		}else{
			console.log("Nothing to change address");
		}
		
    };

    $scope.Cancel = function () {
		
		LoadData();
    
	};
	
    $scope.ChangePassword = function(){
		
		var orig_password = Helper.Cookie_Get("password");
		var old_password = $scope.user.password.current;
		var new_password = $scope.user.password.new;
		var new_password_conf = $scope.user.password.confirm;
		
		if (new_password === new_password_conf && new_password !== "" && new_password !== undefined) {
			
			if(orig_password === old_password){
				
				var pwd_Obj = {
					password: new_password
				};
				
				RESTFactory.Customers_Patch_Password(customerID, pwd_Obj).then(function(response){
					alert("Passwort wurde erfolgreich geändert");
				}, function(response){
					alert("Passwort konnte nicht geändert werden");
				});
				
			}
			
		}
		
		$scope.user.password.current = "";
		$scope.user.password.new = "";
		$scope.user.password.confirm = "";

    };
	
	$scope.ChangeEmail = function(){
		
		var new_email = $scope.user.email.new;
		var new_email_conf = $scope.user.email.confirm;
		
		if(new_email === new_email_conf){
			
			var emailObj = {
				email: new_email
			};
			
			console.log(emailObj);
			
			var chg_email = RESTFactory.Customers_Patch_Email(customerID, emailObj);
			chg_email.then(function(response){
				LoadData();
				alert("Email wurde erfolgreich geändert");
			}, function(response){
				alert("Email konnte nicht geändert werden");
			});
			
		}
		
		$scope.user.email.new = "";
		$scope.user.email.confirm = "";
		
		LoadData();
		
	};

});
