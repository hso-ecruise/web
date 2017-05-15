'use strict';

application.controller('Ctrl_Profile', function (RESTFactory, $rootScope, $scope) {
    
	var customerID = $rootScope.customerID;
	
	var oldUser = {};
	
	$scope.customerID = customerID;
	
	
	function LoadData(){
		
		
		//GET Call
		var prom_data = RESTFactory.Customers_Get_CustomerID(customerID);
		
		prom_data.then(function(response){
			
			var user = {
				userID: customerID,
				name: response.FirstName,
				familyName: response.LastName,
				email: {
					current: response.Email
				},
				phoneNr: response.PhoneNumber,
				address: {
					street: response.Street,
					number: response.HouseNumber,
					country: response.Country,
					city: response.City,
					zip: response.ZipCode,
					extra: response.AddressExtraLine
				},
				activated: response.Activated,
				verified: response.Verified
				
			};
			
			oldUser = user;
			
			$scope.user = user;
			
		}, function(response){
			
			
			var user = {
				name : "Failed",
				familyName: "Connection",
				email : {
					current: "max.mustermann@gmail.com"
				},
				phoneNr : 12354356,
				address : {
					street : "Musterstrasse",
					number : 123,
					country : "Germany",
					zip: 234234,
					city: "Musterstadt",
					extra: "ZUSATZFELD"
				}
			};
			
			$scope.user = user;
			
		});
		
		
	}
	
    


    var init = function () {
		
		LoadData();
	
    };

    init();

	
    $scope.Safe = function () {

		var changedPhone = {
			PhoneNumber: $scope.user.phoneNr
		};
		
		if(changedPhone.PhoneNumber !== oldUser.phoneNr){
			
			var prom_phone = RESTFactory.Customers_Patch_PhoneNr(customerID, changedPhone);
			
			prom_phone.then(function(response){
				LoadData();
				alert("Telefonnummer erfolgreich geändert");
			}, function(response){
				LoadData();
				alert("Telefonnummer konnte nicht geändert werden");
			});
			
			
		}else{
			console.log("Nothing to change Phone");
		}
		
		var address = {
			Country: $scope.user.address.country,
			City: $scope.user.address.city,
			ZipCode: $scope.user.address.zip,
			Street: $scope.user.address.street,
			HouseNumber: $scope.user.address.number,
			AddressExtraLine: $scope.user.address.extra
		};
		
		if(	address.Country !== oldUser.address.country || 
			address.City !== oldUser.address.city ||
			address.ZipCode !== oldUser.address.zip ||
			address.Street !== oldUser.address.street ||
			address.HouseNumber !== oldUser.address.number ||
			address.AddressExtraLine !== oldUser.address.extra)
		{
		
			var chg_address = RESTFactory.Customers_Patch_Address(customerID, address);
			
			chg_address.then(function(response){
				LoadData();
				console.log("Addresse wurde erfolgreich geändert");
			}, function(reponse){
				LoadData();
				console.log("Addresse konnte nicht geändert werden");
			});
		}else{
			console.log("Nothing to change address");
		}
		
    };

    $scope.Cancel = function () {
		
		LoadData();
    
	};
	
    $scope.ChangePassword = function(){
	
		var old_password = $scope.user.password.current;
		var new_password = $scope.user.password.new;
		var new_password_conf = $scope.user.password.confirm;
		
		if (new_password === new_password_conf) {
			
			if($rootScope.login.password === old_password){
				
				var chg_pwd = RESTFactory.Customers_Patch_Password(customerID, new_password);
				chg_pwd.then(function(response){
					console.log("Password changed");
				}, function(response){
					console.log("Password failed");
				});
				
			}
			
		}
		
		$scope.user.password.current = "";
		$scope.user.password.new = "";
		$scope.user.password.confirm = "";

    };
	
	$scope.ChangeEmail = function(){
		
		var old_email = $scope.user.email.current;
		var new_email = $scope.user.email.new;
		var new_email_conf = $scope.user.email.confirm;
		
		console.log("Change Email: " + old_email + "   " + new_email + "   " + new_email_conf);
		
		if(new_email === new_email_conf){
			
			if($rootScope.login.email === old_email){
				
				var chg_email = RESTFactory.Customers_Patch_Password(customerID, new_email);
				chg_email.then(function(response){
					console.log("Email changed");
				}, function(response){
					console.log("Email failed");
				});
				
			}
			
		}
		
		$scope.user.email.current = "";
		$scope.user.email.new = "";
		$scope.user.email.confirm = "";
		
		LoadData();
		
	};

});
