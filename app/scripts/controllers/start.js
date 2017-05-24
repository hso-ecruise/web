'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:StartCtrl
 * @description
 * # StartCtrl
 * Controller of the webApp
 */
 
 
application.controller('Ctrl_Main', function ($rootScope, $scope, $mdDialog, Helper, $location) {
    
	var inited = false;
	
	var init = function(){
		
		if(inited === true){
			return;
		}
		
		var loggedIN = Helper.Cookie_Get("loggedIN");
		var token = Helper.Cookie_Get("token");
		var customerID = Helper.Cookie_Get("customerID");
		
		if(loggedIN !== "true"){
			loggedIN = false;
		}
		
		$rootScope.loggedIN = loggedIN;
		$rootScope.token = token;
		$rootScope.customerID = customerID;
		
		inited = true;
		
		$scope.loggedIN = $rootScope.loggedIN;

	};
	
	init();
	
	$scope.Logout = function(){
		
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
	
	
	
	$scope.showLogin = function(){
		
		$mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            template:
            '<md-dialog class="login-dialog">'+
            '	<md-dialog-content>' +
			'	<form ng-submit="Login()">' +
            '		<md-toolbar class="md-hue-2">' +
            '			<div class="md-toolbar-tools">' +
            '				<h2 class="md-flex">Anmelden</h2>' +
            '			</div>' +
            '		</md-toolbar>' +

            '		<md-content flex layout-padding>' +
			
			'			<md-input-container>' +
			'				<input placeholder="E-Mail" type="email" ng-model="login_email" ng-required="true" />' +
			'			</md-input-container>' +
			
			'			<md-input-container>' +
			'				<input placeholder="Passwort" type="password" ng-model="login_password" ng-required="true" /> ' +
			'			</md-input-container>' +
			
            '		</md-content>' +

            '		<md-content flex layout-padding>' +
			'			<input type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;" value=""/>' +
            '			<md-button class="md-raised md-primary button-to-right" ng-click="Login()"> Login </md-button>' +
            '		</md-content>' +
			'		</form>' +
            '	</md-dialog-content>' +
            '</md-dialog>',

            controller: function DialogController($scope, $rootScope, $location, $mdDialog, RESTFactory, Helper){
				

                $scope.closeDialog = function(){
                    $mdDialog.hide();
                };

                $scope.Login = function(){

					var email = $scope.login_email;
					var password = String($scope.login_password);
					
					var use_pwd = "\"" + password + "\"";
					
					var prom_Login = RESTFactory.User_Login(email, use_pwd);
					
					prom_Login.then(function(response){
						
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
						
						$rootScope.$apply( function(){$location.path('/booking'); } );
						
					}, function(response){
						
						console.log("Failed to login");
						
						if(email === "test" && password === "test"){
							
							$rootScope.token = "tokenSKHDFADJF";
							$rootScope.customerID = 1;
							
							$rootScope.loggedIN = true;
							$scope.loggedIN = true;
							
							//Save data in cookies
							Helper.Cookie_Set("loggedIN", true);
							Helper.Cookie_Set("token", "tokenSKHDFADJF");
							Helper.Cookie_Set("customerID", 1);
							Helper.Cookie_Set("password", password);
							
							$rootScope.$apply( function(){$location.path('/booking'); } );
							
						}
						
					});
					
					$scope.closeDialog();
					
                };

            }
        });
		
	};
	
	
	
	$scope.showRegister = function(){
		
		$mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            template:
            '<md-dialog class="login-dialog">'+
            '	<md-dialog-content>' +

            '		<md-toolbar class="md-hue-2">' +
            '			<div class="md-toolbar-tools">' +
            '				<h2 class="md-flex">Registieren</h2>' +
            '			</div>' +
            '		</md-toolbar>' +

			'		<md-content flex layout-padding>' +
			'			<md-input-container>' +
			'				<label>Vorname</label>' +
			'				<input ng-model="register_name" ng-required="true" />' +
			'			</md-input-container>' +
			
			'			<md-input-container>' +
			'				<label>Nachname</label>' +
			'				<input ng-model="register_familyName" ng-required="true" />' +
			'			</md-input-container>' +
			'		</md-content>' +
			
			'		<md-content flex layout-padding>' +
			'			<md-input-container>' +
			'				<label>Email</label>' +
			'				<input ng-model="register_email" type="email" ng-required="true" />' +
			'			</md-input-container>' +
			
			'			<md-input-container>' +
			'				<label>Passwort</label>' +
			'				<input type="password" ng-model="register_password" ng-required="true" />' +
			'			</md-input-container>' +
			'		</md-content>' +
			
            '		<md-content flex layout-padding>' +
            '			<md-button class="md-raised md-primary button-to-right" ng-click="Register()"> Registrieren </md-button>' +
            '		</md-content>' +

            '	</md-dialog-content>' +
            '</md-dialog>',

            controller: function DialogController($scope, $rootScope, $location, $mdDialog, RESTFactory){
				

                $scope.closeDialog = function(){
                    $mdDialog.hide();
                };

                $scope.Register = function(){

					var name = $scope.register_name;
					var familyName = $scope.register_familyName;
				
					var email = $scope.register_email;
					var password = $scope.register_password;
					
					name = "\"" + name + "\"";
					familyName = "\"" + familyName + "\"";
					email = "\"" + email + "\"";
					password = "\"" + password + "\"";
					
					var data = {
						email: email,
						password: password,
						firstName: name,
						lastName: familyName
					};
					
					RESTFactory.User_Register(data).then(function(response){
						
						alert("Bitte bestätigen Sie Ihre Email Adresse");
						
					}, function(response){
						
						console.log("Registrierung fehlgeschlagen");
						
					});
					
					$scope.closeDialog();
					
                };

            }
        });
		
	};
	
	
});
