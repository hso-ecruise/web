'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:StartCtrl
 * @description
 * # StartCtrl
 * Controller of the webApp
 */
 
 
application.controller('Ctrl_Main', function ($rootScope, $scope, $mdDialog) {
    
	var inited = false;
	
	var init = function(){
		
		if(inited === true){
			return;
		}
		
		
		inited = true;
		
		if($rootScope.loggedIN === undefined){
			$rootScope.loggedIN = false;
		}
		
		$scope.loggedIN = $rootScope.loggedIN;

	};
	
	init();
	
	$scope.Logout = function(){
		
		//DELETE COOKIES
		
		$rootScope.token = undefined;
		$rootScope.customerID = undefined;
		
		$rootScope.loggedIN = false;
		$scope.loggedIN = false;
		
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

            '		<md-toolbar class="md-hue-2">' +
            '			<div class="md-toolbar-tools">' +
            '				<h2 class="md-flex">Anmelden</h2>' +
            '			</div>' +
            '		</md-toolbar>' +

            '		<md-content flex layout-padding>' +
			
			'			<md-input-container>' +
			'				<input placeholder="E-Mail" type="" ng-model="login_email"/>' +
			'			</md-input-container>' +
			
			'			<md-input-container>' +
			'				<input placeholder="Passwort" type="password" ng-model="login_password" /> ' +
			'			</md-input-container>' +
			
            '		</md-content>' +

            '		<md-content flex layout-padding>' +
            '			<md-button class="md-raised md-primary button-to-right" ng-click="Login()"> Login </md-button>' +
            '		</md-content>' +

            '	</md-dialog-content>' +
            '</md-dialog>',

            controller: function DialogController($scope, $rootScope, $location, $mdDialog, RESTFactory){
				

                $scope.closeDialog = function(){
                    $mdDialog.hide();
                };

                $scope.Login = function(){

					var email = $scope.login_email;
					var password = $scope.login_password;
					
					console.log("login with" + email + "  " + password);
					
					var prom_Login = RESTFactory.User_Login(email, password);
					
					prom_Login.then(function(response){
						
						var data = response.data;
						
						$rootScope.token = data.token;
						$rootScope.customerID = data.id;
						
						$rootScope.loggedIN = true;
						$scope.loggedIN = true;
						
						$rootScope.$apply( function(){$location.path('/booking'); } );
						
						//SAFE DATA IN COOKIES
						
					}, function(response){
						
						console.log("Failed to login");
						
						if(email === "test" && password === "test"){
							
							$rootScope.token = "tokenSKHDFADJF";
							$rootScope.customerID = -1000;
							
							$rootScope.loggedIN = true;
							$scope.loggedIN = true;
							
							$rootScope.$apply( function(){$location.path('/booking'); } );
							
						}
						
					});
					
					$scope.closeDialog();
					
                };

            }
        });
		
	}
	
	
	
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
			'				<input ng-model="register_name"/>' +
			'			</md-input-container>' +
			
			'			<md-input-container>' +
			'				<label>Nachname</label>' +
			'				<input ng-model="register_familyName"/>' +
			'			</md-input-container>' +
			'		</md-content>' +
			
			'		<md-content flex layout-padding>' +
			'			<md-input-container>' +
			'				<label>Email</label>' +
			'				<input ng-model="email" type="register_email" />' +
			'			</md-input-container>' +
			
			'			<md-input-container>' +
			'				<label>Passwort</label>' +
			'				<input type="password" ng-model="register_password" />' +
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
					
					var data = {
						Email: email,
						Password: password,
						FirstName: name,
						LastName: familyName
					};
					
					console.log("Register with" + name + "  " + familyName + "   " + email + "  " + password);
					
					var prom_Register = RESTFactory.User_Register(data);
					
					prom_Register.then(function(response){
						
						alert("Bitte bestätigen Sie Ihre Email Adresse");
						
						//$location.path("/start");
						
					}, function(response){
						
						console.log("Failed to register");
						
					});
					
					$scope.closeDialog();
					
                };

            }
        });
		
	}
	
	
});
