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
			'		<form ng-submit="Login()">' +
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
			'					<input placeholder="Passwort" type="password" pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,}" title="Passwort muss mindestens eine Zahl und einen kleinen oder großen Buchstaben enthalten und mindestens 7 Zeichen lang sein" ng-model="login_password" ng-required="true" /> ' +
			'				</md-input-container>' +
			
            '			</md-content>' +

            '			<md-content flex layout-padding>' +
			'				<input type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;" value=""/>' +
            '				<md-button class="md-raised md-primary button-to-right" ng-click="Login()"> Login </md-button>' +
            '			</md-content>' +
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
			
			'		<form ng-submit="Register()">' +
            '			<md-toolbar class="md-hue-2">' +
            '				<div class="md-toolbar-tools">' +
            '					<h2 class="md-flex">Registieren</h2>' +
            '				</div>' +
            '			</md-toolbar>' +

			'			<md-content flex layout-padding>' +
			'				<md-input-container>' +
			'					<label>Vorname</label>' +
			'					<input ng-model="register_name" pattern="[A-Z]{1}[a-z]{1,}([-\s]{1}[A-Z]{1}[a-z]{1,}){0,}" ng-required="true" />' +
			'				</md-input-container>' +
			
			'				<md-input-container>' +
			'					<label>Nachname</label>' +
			'					<input ng-model="register_familyName" pattern="[A-Z]{1}[a-z]{1,}([-\s]{1}[A-Z]{1}[a-z]{1,}){0,}" ng-required="true" />' +
			'				</md-input-container>' +
			'			</md-content>' +
			
			'			<md-content flex layout-padding>' +
			'				<md-input-container>' +
			'					<label>Email</label>' +
			'					<input type="text" pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,3}$" title="E-Mail muss folgend aufgebaut sein: xxx@yyy.zzz" ng-model="register_email"  ng-required="true" />' +
			'				</md-input-container>' +
			
			'				<md-input-container>' +
			'					<label>Passwort</label>' +
			'					<input type="password" pattern="(?=.*[a-z])(?=.*[0-9]).{8,}" title="Passwort muss mindestens eine Zahl und einen kleinen oder großen Buchstaben enthalten und mindestens 8 Zeichen lang sein" ng-model="register_password" ng-required="true" />' +
			'				</md-input-container>' +
			'			</md-content>' +
			
            '			<md-content flex layout-padding>' +
			'				<input type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;" value=""/>' +
            '				<md-button class="md-raised md-primary button-to-right" ng-click="Register()"> Registrieren </md-button>' +
            '			</md-content>' +
			'		</form>' +
			
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
					
					if(email === undefined || familyName === undefined || name === undefined || password === undefined){
						alert("Bitte füllen Sie alle Felder aus");
						return;
					}
					
					if(email === "" || familyName === "" || name === "" || password === ""){
						alert("Bitte füllen Sie alle Felder aus");
						return;
					}
					
				//	name = "\"" + name + "\"";
				//	familyName = "\"" + familyName + "\"";
				//	email = "\"" + email + "\"";
				//	password = "\"" + password + "\"";
					
					var data = {
						email: email,
						password: password,
						firstName: name,
						lastName: familyName
					};
					
					console.log(data);
					
					RESTFactory.User_Register(data).then(function(response){
						
						console.log(response);
						
						alert("Bitte bestätigen Sie Ihre Email Adresse");
						
					}, function(response){
						
						alert("Registrierung fehlgeschlagen");
						
					});
					
					$scope.closeDialog();
					
                };

            }
        });
		
	};
	
	
});
