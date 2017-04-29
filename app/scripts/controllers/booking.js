'use strict';

application.controller('Ctrl_Booking', function ($rootScope, $scope, $mdDialog, RESTFactory) {    
    
	var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: new google.maps.LatLng(49.5, 8.434),
		mapTypeId: 'roadmap'
    });
    
	map.addListener("click", function(event){
		
		var lat = event.latLng.lat();
		var lon = event.latLng.lng();
		console.log( lat + ', ' + lon );
		
		map.panTo(new google.maps.LatLng(lat, lon));
		
		Get_Address(lat, lon).then(function(address){
			ShowInputPopUp(address, lat, lon);
		});
		
	});
	
    var icons = {
		car_available: {
			icon: "images/icons/car_available.png"
		},
		car_loading_00:{
			icon: "images/icons/car_loading_00.png"
		},
		car_loading_25:{
			icon: "images/icons/car_loading_25.png"
		},
		car_loading_50:{
			icon: "images/icons/car_loading_50.png"
		},
		car_loading_75:{
			icon: "images/icons/car_loading_75.png"
		},
		car_occupied:{
			icon: "images/icons/car_occupied.png"
		},
		car_reserved:{
			icon: "images/icons/car_reserved.png"
		},
		car_standing_admin:{
			icon: "images/icons/car_standing_admin.png"
		},
		car_standing_user:{
			icon: "images/icons/car_standing_user.png"
		},
		station_available:{
			icon: "images/icons/station_available.png"
		},
		station_occupied:{
			icon: "images/icons/station_occupied.png"
		}
    };
    
    var image = {
		url: 'images/icons/car_available.png',
		scaledSize: new google.maps.Size(60, 96),
		origin: new google.maps.Point(0, 0),
    	anchor: new google.maps.Point(0, 32)
    };
    
    var CreateMarker = function(lat, lon, state){
		
		image.url = icons[state].icon;
	
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lon),
			map: map,
			icon: image
		});
		
		marker.addListener('click', function(event){
			alert = $mdDialog.alert({
				title: "Fahrzeuginformationen",
				textContent: "Fahrzeug lädt. 60%",
				ok: 'X'
			});

			$mdDialog
				.show( alert )
				.finally(function() {
					alert = undefined;
				});
			console.log("Marker clicked");
		});
		
    };
	
	
	function ShowInputPopUp(address, lat, lon){
		
		console.log("SHOW");
		
		$scope.address = address;
		
		$mdDialog.show({
			clickOutsideToClose: true,
			scope: $scope,
			preserveScope: true,
			template:
				'<md-dialog>'+
				'	<md-dialog-content>' +
				
				'		<md-toolbar class="md-hue-2">' +
				'			<div class="md-toolbar-tools">' +
				'				<h2 class="md-flex">Bitte Fahrtdaten eingeben</h2>' +
				'			</div>' +
				'		</md-toolbar>' +
		
				'		<md-content flex layout-padding>' +
				'			<div>' +
				'				<label> Straße Nr.: {{ address.street }}  {{ address.number }}</label>' +
				'				<br/>' +
				'				<label> Stadt: {{ address.zip }}  {{ address.city }}</label>' +
                '			</div>' +
				'		</md-content>' +
				
				'		<md-content flex layout-padding>' +
				'			<md-input-container>' +
				'				<input type="date" placeholder="Datum" class="md-input" ng-model="date">' +
                '			</md-input-container>' +

                '			<md-input-container>' +
				'				<input type="time" placeholder="Uhrzeit" class="md-input" ng-model="time">' +
                '			</md-input-container>' +
				'		</md-content>' +
				
				'		<md-content flex layout-padding>' +
                '			<md-button class="md-raised md-primary button-to-right" ng-click="Save()"> Speichern </md-button>' +
                '			<md-button class="md-primary md-hue-1 button-to-right" ng-click="closeDialog()"> Verwerfen </md-button>' +
				'		</md-content>' +
				
				'	</md-dialog-content>' +
				'</md-dialog>',
			
			controller: function DialogController($scope, $mdDialog){
				
				$scope.address = address;
				
				$scope.date = new Date();
				$scope.time = new Date();
				
				$scope.closeDialog = function(){
					$mdDialog.hide();
				}
				
				$scope.Save = function(){
					
					console.log("REST call for booking: " + lat + " , " + lon + "  Datum: " + $scope.date + " Uhrzeit: " + $scope.time);
					
					$scope.closeDialog();
				}
				
			}
		});
		
	}
    
    new CreateMarker(49.5, 8.434, "car_loading_25");
    new CreateMarker(49.501, 8.434, "car_available");

	
	
	
	function Get_Address(lat, lon){
		
		return new Promise(function(resolve, reject){
			
			RESTFactory.GetAddress(lat, lon).then(function(response){
				
				var ret = response.data.results[0].address_components;
				
				var address = { };
				
				for(var i = 0;i < ret.length; i++){
					for(var j = 0; j < ret[i].types.length; j++){
						switch(ret[i].types[j]){
							case "street_number":
								address.number = ret[i].long_name;
								break;
							case "route":
								address.street = ret[i].long_name;
								break;
							case "locality":
								address.city = ret[i].long_name;
								break;
							case "postal_code":
								address.zip = ret[i].long_name;
								break;
							default:
								break;
						}
					}
				}
				
				resolve(address);
				
				reject("error");
				
			});
		});
		
	}
	
});
