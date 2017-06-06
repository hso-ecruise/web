'use strict';

application.controller('Ctrl_Profile', function (RESTFactory, $rootScope, $scope, Helper) {
    
	var customerID = $rootScope.customerID;
	
	var oldUser = {};
	
	$scope.customerID = customerID;
	
	
	/**
	 * Description
	 * @method LoadData
	 * @return 
	 */
	function LoadData(){
		
		var prom_data = RESTFactory.Customers_Get_CustomerID(customerID);
		
		prom_data.then(function(response){
			
			var data = response.data;
			
			var user = {
				userID: customerID,
				name: data.firstName,
				familyName: data.lastName,
				email: {
					current: data.email,
					new: "",
					confirm: ""
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
			
			var password = {
				current: "",
				new: "",
				confirm: ""
			};
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
	
    


    /**
     * Description
     * @method init
     * @return 
     */
    var init = function () {
		
		LoadData();
	
    };

    init();

	
    /**
     * Description
     * @method Safe
     * @return 
     */
    $scope.Safe = function () {

		var new_phone_number = $scope.user.phoneNr;
		
		if(new_phone_number !== oldUser.phoneNr){
			
			var upload = "\"" + new_phone_number + "\"";
			
			RESTFactory.Customers_Patch_PhoneNr(customerID, upload).then(function(response){
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

    /**
     * Description
     * @method Cancel
     * @return 
     */
    $scope.Cancel = function () {
		
		LoadData();
    
	};
	
    /**
     * Description
     * @method ChangePassword
     * @return 
     */
    $scope.ChangePassword = function(){
		
		var orig_password = Helper.Cookie_Get("password");
		var old_password = String($scope.user.password.current);
		var new_password = String($scope.user.password.new);
		var new_password_conf = String($scope.user.password.confirm);
		
		if (new_password === new_password_conf && new_password !== "" && new_password !== undefined) {
			
			if(orig_password === old_password){
				
				var pwd = "\"" + new_password + "\"";
				
				RESTFactory.Customers_Patch_Password(customerID, pwd).then(function(response){
					alert("Passwort wurde erfolgreich geändert");
				}, function(response){
					alert("Passwort konnte nicht geändert werden");
				});
				
			}
			
		}
		
		$scope.user.password.current = "";
		$scope.user.password.new = "";
		$scope.user.password.confirm = "";
		$scope.pwd_required = false;
		
    };
	
	/**
	 * Description
	 * @method pwdInPressed
	 * @return 
	 */
	$scope.pwdInPressed = function(){
		
		var input = $scope.user.password.current;
		
		if(input === undefined || String(input).length === 0){
			$scope.pwd_required = false;
		}else{
			$scope.pwd_required = true;
		}
		
	};
	
	/**
	 * Description
	 * @method ChangeEmail
	 * @return 
	 */
	$scope.ChangeEmail = function(){
		
		var new_email = $scope.user.email.new;
		var new_email_conf = $scope.user.email.confirm;
		
		if(new_email === new_email_conf && new_email !== undefined){
			
			var em = "\"" + new_email + "\"";
			
			var chg_email = RESTFactory.Customers_Patch_Email(customerID, em);
			chg_email.then(function(response){
				LoadData();
				alert("Email wurde erfolgreich geändert");
			}, function(response){
				alert("Email konnte nicht geändert werden");
			});
			
		}
		
		$scope.user.email.new_ = "";
		$scope.user.email.confirm = "";
		
		LoadData();
		
	};

});
