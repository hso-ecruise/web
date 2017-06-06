'use strict';

application.controller('Ctrl_Booking', function ($rootScope, $scope, $mdDialog, RESTFactory, Helper) {    

	var customerID = $rootScope.customerID;

	var carMarkers = [];
    var stationMarkers = [];

    var carsVisible = true;
    var stationsVisible = true;
	
    $scope.activeCar = "images/icons/car_available.png";
    $scope.activeStation = "images/icons/station_available.png";
	
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: new google.maps.LatLng(49.5, 8.434),
        mapTypeId: 'roadmap'
    });

    map.addListener("click", function(event){

        var lat = event.latLng.lat();
        var lon = event.latLng.lng();
		
        Helper.Get_Address(lat, lon).then(function(address){
			new ShowInputPopUp(address, lat, lon);
        }, function(response){
			
		});

    });
	

    var icons = {
        car_available: {
            icon: "images/icons/car_available.png",
            type: "car"
        },
        car_loading_00:{
            icon: "images/icons/car_loading_00.png",
            type: "car"
        },
        car_loading_25:{
            icon: "images/icons/car_loading_25.png",
            type: "car"
        },
        car_loading_50:{
            icon: "images/icons/car_loading_50.png",
            type: "car"
        },
        car_loading_75:{
            icon: "images/icons/car_loading_75.png",
            type: "car"
        },
        car_occupied:{
            icon: "images/icons/car_occupied.png",
            type: "car"
        },
        car_reserved:{
            icon: "images/icons/car_reserved.png",
            type: "car"
        },
        car_standing_admin:{
            icon: "images/icons/car_standing_admin.png",
            type: "car"
        },
        car_standing_user:{
            icon: "images/icons/car_standing_user.png",
            type: "car"
        },
        station_available:{
            icon: "images/icons/station_available.png",
            type: "station"
        },
        station_occupied:{
            icon: "images/icons/station_occupied.png",
            type: "station"
        }
    };


    function AddMarker(title, content, image_string, lat, lon){
		
        var img = {
            url: 'images/icons/car_available.png',
            scaledSize: new google.maps.Size(60, 87),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(30, 87)
        };

        img.url = icons[image_string].icon;

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            map: map,
            icon: img,
			optimized: false
        });


        marker.addListener('click', function(event){
            var new_alert = $mdDialog.alert({
                title: title,
                textContent: content,
				clickOutsideToClose: true,
                ok: 'OK'
            });

            $mdDialog
                .show( new_alert )
                .finally(function() {
                new_alert = undefined;
            });
        });

        if(icons[image_string].type === "car"){
            carMarkers.push(marker);
        }else{
            stationMarkers.push(marker);
        }

    }

    function AddVehicle(car){

        if(car.bookingState !== 1000){

            var lat = car.lastKnownPositionLatitude;
            var lon = car.lastKnownPositionLongitude;
            var bat = car.chargeLevel;
            var carID = car.carId;

            var title = "Fahrzeugdetails:";
			
			
            if(bat < 100){
				
                var endTime = new Date();
                endTime.setTime(endTime.getTime() + ((100 - bat) * 60 * 1000));

                var time = Helper.Get_Zeit().time;

                var content = "Das Fahrzeug lädt. Ladezustand " + parseInt(bat) + "%. Voraussichtliches Ende: gegen " + time;

				if(bat < 25){
					new AddMarker(title, content, "car_loading_00", lat, lon);
				}else if (bat < 50){
					new AddMarker(title, content, "car_loading_25", lat, lon);
				}else if (bat < 75){
					new AddMarker(title, content, "car_loading_50", lat, lon);
				}else if (bat < 100){
					new AddMarker(title, content, "car_loading_75", lat, lon);
				}
                /*
				RESTFactory.Car_Charging_Stations_Get_CarID(carID).then(function(response){
					
					var info = response.data;
					
					for(var tz = 0; tz < info.length; tz++){
						
						var station = info[tz];
						
						if(station.carId === carID){
						
							if(info.length > 0){
                                
                                //PRO MINUTE 1%

								var time = Helper.Get_Time(info[tz].chargeEnd);
								var content = "Das Fahrzeug lädt. Ladezustand " + parseInt(bat) + "%. Voraussichtliches Ende: gegen " + time;

								if(bat < 25){
									new AddMarker(title, content, "car_loading_00", lat, lon);
								}else if (bat < 50){
									new AddMarker(title, content, "car_loading_25", lat, lon);
								}else if (bat < 75){
									new AddMarker(title, content, "car_loading_50", lat, lon);
								}else if (bat < 100){
									new AddMarker(title, content, "car_loading_75", lat, lon);
								}

							}
							
							break;
							
						}
					}
					
                }, function(response){
					
					var content = "Das Fahrzeug lädt. Ladezustand " + parseInt(bat) + "%. Voraussichtliches Ende: kann nicht abgerufen werden";
					
					if(bat < 25){
						new AddMarker(title, content, "car_loading_00", lat, lon);
					}else if (bat < 50){
						new AddMarker(title, content, "car_loading_25", lat, lon);
					}else if (bat < 75){
						new AddMarker(title, content, "car_loading_50", lat, lon);
					}else if (bat < 100){
						new AddMarker(title, content, "car_loading_75", lat, lon);
					}
					
                });
                */
            }else{

                var content = "Das Fahrzeug ist voll geladen und kann benutzt werden.";

                new AddMarker(title, content, "car_available", lat, lon);

            }

        }

    }

    function AddStation(station){

        var lat = station.latitude;
        var lon = station.longitude;

		//FEHLER OCCUPIED
        var occupied = station.slotsOccupuied;
        var total = station.slots;

        var diff = total - occupied;

        var title = "Ladestation";
        var content =  diff + " von " + total + " Slots frei";
		
        if(diff === 0){
            new AddMarker(title, content, "station_occupied", lat, lon);
        }else{
            new AddMarker(title, content, "station_available", lat, lon);
        }

    }

    function LoadPositions(){

        carsVisible = true;
        stationsVisible = true;

        carMarkers = [];
        stationMarkers = [];
        
        var refIntCarID = setInterval(GetCars, 1000);
        var refIntStatID = setInterval(GetStations, 1000);

        function GetCars(){

            //GET Call to get all cars
            RESTFactory.Cars_Get().then(function(response){
                
                clearInterval(refIntCarID);

                var cars = response.data;
                    
                for(var ij = 0; ij < cars.length; ij++){
                    var car = cars[ij];
                    new AddVehicle(car);
                }

            }, function(response){
                
            });

        }

        function GetStations(){

            //GET Call to get all stations
            RESTFactory.Charging_Stations_Get().then(function(response){

                clearInterval(refIntStatID);

                var stations = response.data;
                
                for(var i = 0; i < stations.length; i++){
                    var station = stations[i];
                    new AddStation(station);
                }

            }, function(response){

            });

        }

    }

    function ShowInputPopUp(address, lat, lon){

        map.panTo(new google.maps.LatLng(lat, lon));
		
        $scope.address = address;

        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            template:
            '<md-dialog class="booking-dialog">'+
            '	<md-dialog-content>' +

            '		<md-toolbar class="md-hue-2">' +
            '			<div class="md-toolbar-tools">' +
            '				<h2 class="md-flex">Bitte Fahrtdaten eingeben</h2>' +
            '			</div>' +
            '		</md-toolbar>' +
			
			'		<form name="registerForm">' +
            '			<md-content flex layout-padding>' +
            '				<div>' +
            '					<label> Straße Nr.: {{ address.street }}  {{ address.number }}</label>' +
            '					<br/>' +
            '					<label> Stadt: {{ address.zip }}  {{ address.city }}</label>' +
            '				</div>' +
            '			</md-content>' +

            '			<md-content flex layout-padding>' +
            '				<md-input-container>' +
            '					<input type="date" placeholder="Datum" min="{{minDate}}" class="md-input" ng-model="date" ng-required="true" >' +   
            '				</md-input-container>' +
            '				<md-input-container>' +
            '					<input type="time" placeholder="Uhrzeit" min="{{minTime}}" class="md-input" ng-model="time" ng-required="true" >' +
            '				</md-input-container>' +
            '			</md-content>' +

            '			<md-content flex layout-padding>' +
            '				<md-button class="md-raised md-primary button-to-right" ng-click="Save()" ng-disabled="registerForm.$invalid"> Speichern </md-button>' +
            '				<md-button class="md-primary md-hue-1 button-to-right" ng-click="closeDialog()"> Verwerfen </md-button>' +
            '			</md-content>' +
			'		</form>' +

            '	</md-dialog-content>' +
            '</md-dialog>',

            controller: function DialogController($scope, $mdDialog){

                $scope.address = address;

				var timeInput = new Date();
				timeInput.setMilliseconds(0);
				timeInput.setSeconds(0);
				
				var minTime = timeInput;
				minTime.setMinutes(timeInput.getMinutes() - 1);
				
				
				var dateInput = new Date();
				dateInput.setMilliseconds(0);
				dateInput.setSeconds(0);
				dateInput.setMinutes(0);
				dateInput.setHours(0);
				
				var minDate = dateInput;
				
				$scope.time = timeInput;
				$scope.minTime = minTime;
				
				$scope.date = dateInput;
				$scope.minDate = minDate;

                $scope.closeDialog = function(){
                    $mdDialog.hide();
                };

                $scope.Save = function(){
					
					var date = new Date($scope.date);
					var time = new Date($scope.time);
					
					var plannedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), 0, 0);
					
					var now = new Date();
					
					//TRITT EIGENTLICH NIE AUF
					if(plannedDate.getTime() - now.getTime() < 0){
						alert("Die Startzeit liegt in der Vergangenheit. Bitte überprüfen Sie Ihre Eingaben.");
						return;
					}
					
					var data = {
						customerId: customerID,
						bookingPositionLatitude: lat,
						bookingPositionLongitude: lon,
						bookingDate: now,
						plannedDate: plannedDate
					};
                    console.log(data);
					
					RESTFactory.Bookings_Post(data).then(function(response){
						alert("Buchung erfolgreich");
					}, function(response){
						alert("Buchung fehlgeschlagen");
					});
					
					$scope.closeDialog();
					
                };

            }
        });

    }

    function ToggleCars(){
        if(carsVisible === true){
            carsVisible = false;
            $scope.activeCar = "images/icons/car_available_INACT.png";
            for(var i = 0; i < carMarkers.length; i++){
                carMarkers[i].setMap(null);
            }
        }else{
            carsVisible = true;
            $scope.activeCar = "images/icons/car_available.png";
            for(var i = 0; i < carMarkers.length; i++){
                carMarkers[i].setMap(map);
            }
        }
    }
	
    function ToggleStations(){
        if(stationsVisible === true){
            stationsVisible = false;
            $scope.activeStation = "images/icons/station_available_INACT.png";
            for(var i = 0; i < stationMarkers.length; i++){
                stationMarkers[i].setMap(null);
            }
        }else{
            stationsVisible = true;
            $scope.activeStation = "images/icons/station_available.png";
            for(var i = 0; i < stationMarkers.length; i++){
                stationMarkers[i].setMap(map);
            }
        }
    }


	
    function Init(){
		
		var input = document.getElementById('search_input');
		var searchBox = new google.maps.places.SearchBox(input);
		
        var carBtn = document.getElementById('car_btn');
        var stationBtn = document.getElementById('station_btn');

		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(carBtn);
        map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(stationBtn);


		map.addListener('bounds_changed', function() {
			searchBox.setBounds(map.getBounds());
		});
		
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
			
			var places = searchBox.getPlaces();

			if (places.length === 0) {
				return;
			}
			
			var place = places[0].geometry.location;
			
			var lat = place.lat();
			var lon = place.lng();
			
			var prom_addr = Helper.Get_Address(lat, lon);
			prom_addr.then(function(response){
				new ShowInputPopUp(response, lat, lon);
			});
			
        });
		
		//GET NEXT BOOKINGS
		RESTFactory.Bookings_Get_CustomerID(customerID).then(function(response){
			
			var bookings = response.data;
			
			var interested = [];
			
			var soon_bookings = [];
			
			for(var jk = 0; jk < bookings.length; jk++){
				
				var booking = bookings[jk];
				
				var d = new Date(booking.plannedDate);
				var now = new Date();
				var dif = (d.getTime() - now.getTime()) / 1000 / 60;
				
				if(dif < 30 && dif > 0){
					interested.push(booking);
				}
				
			}
			
			for(var kl = 0; kl < interested.length; kl++){
				
				var booking2 = interested[kl];
				
				RESTFactory.Trips_Get_TripID(booking2.TripId).then(function(response){
					
					var trip = response.data;
					
					var carID = trip.CarId;
					var chargingID = trip.startChargingStationId;
					
					RESTFactory.Charging_Stations_Get_Charging_StationID(chargingID).then(function(response){
						
						var station = response.data;
						
						var lat = station.latitude;
						var lon = station.longitude;
						
						Helper.Get_Address(lat, lon).then(function(address){
							
							var soon_booking = {};
						
							soon_booking.lat = lat;
							soon_booking.lon = lon;
							soon_booking.stationID = chargingID;
							soon_booking.carID = carID;
							soon_booking.address = address;
							soon_booking.date = Helper.Get_Date(booking2.plannedDate);
							soon_booking.time = Helper.Get_Time(booking2.plannedDate);
							
							soon_bookings.push(soon_booking);
							
							var content = "Ihr Fahrzeug mit der ID: " + soon_booking.carID + " steht ab " + soon_booking.time + " am " + soon_booking.date + " an der Station " + soon_booking.stationID + " bereit";
							
							new AddMarker("Ihre Reservierung", content, "car_reserved", lat, lon);
							
						}, function(response){
							
						});
						
					}, function(response){
						
					});
					
				}, function(response){
					
				});
				
			}
			
		}, function(response){
			
		});
		
		
		new LoadPositions();
		
	}
	
    $scope.ToggleCars = function(){
        new ToggleCars();
    }

    $scope.ToggleStations = function(){
        new ToggleStations();
    }

	new Init();

});
