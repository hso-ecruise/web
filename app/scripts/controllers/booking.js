'use strict';
// Initialisierungsfunktion für die Seite bookings.html
// Karte, Icons und Marker werden initialisiert und geladen
application.controller('Ctrl_Booking', function ($rootScope, $scope, $mdDialog, RESTFactory, Helper) {    

	$scope.testing = false;	
    $scope.customerID = $rootScope.customerID;

    var carMarkers = [];
    var stationMarkers = [];

    var carsVisible = true;
    var stationsVisible = true;

    $scope.activeCar = "images/icons/car_available.png";
    $scope.activeStation = "images/icons/station_available.png";

	var map;


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

	var LOADING_STATES = {
		1: {
			text: "Entladen",
			be: "DISCHARGING",
			id: 1
		},
		2: {
			text: "Laden",
			be: "CHARGING",
			id: 2
		},
		3: {
			text: "Geladen",
			be: "FULL",
			id: 3
		}
	};
	
	var BOOKING_STATES = {
		1: {
			text: "Verfügbar",
			be: "AVAILABLE",
			id: 1
		},
		2: {
			text: "Gebucht",
			be: "BOOKED",
			id: 2
		},
		3: {
			text: "Geblockt",
			be: "BLOCKED",
			id: 3
		}
	};

    /**
     * Description
     * Funktion um Marker hinzuzufügen
     * Hier werden auf der Karte Marker und Ihre Icons hinzugefügt
     * @method AddMarker
     * @param {} id
     * @param {} title
     * @param {} content
     * @param {} image_string
     * @param {} lat
     * @param {} lon
     * @return 
     */
	function AddMarker(id, title, content, image_string, lat, lon){
	
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
			optimized: false,
			id: id
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
        // Hier werden Marker gerendert
        if(icons[image_string].type === "car"){
            carMarkers.push(marker);
        }else{
            stationMarkers.push(marker);
        }
    }


    /**
	 * Description
     * Funktion um Autos der Karte hinzuzufügen
	 * @method Cars_AddMarker
	 * @param {} car
	 * @return 
	 */
	function Cars_AddMarker(car){

        var lat = car.lastLat;
        var lon = car.lastLon;
        var bat = car.chargeLevel;
        var carID = car.vehicleID;

        var title = "Fahrzeugdetails " + carID;
		
		switch(car.bookingStateObj.be){

			case "AVAILABLE":

				if(car.chargeLevel < 100){

					RESTFactory.Cars_Get_ChargeLevelPerMinute().then(function(response){
						
						var loadingPerSecond = response.data;
					
						var endTime = new Date();
						endTime.setTime(endTime.getTime() + (100 - bat) * 1000 * 60 * loadingPerSecond);

						var content = "Das Fahrzeug lädt. Ladezustand " + parseInt(bat) + " (" + car.loadingStateObj.text + "). Voraussichtliches Ende gegen " + Helper.Get_Zeit(endTime).time + ", bei einer Aufladung von " + loadingPerSecond + "% pro Minute.";
						if(bat < 25){
							new AddMarker(carID, title, content, "car_loading_00", lat, lon);
						}else if (bat < 50){
							new AddMarker(carID, title, content, "car_loading_25", lat, lon);
						}else if (bat < 75){
							new AddMarker(carID, title, content, "car_loading_50", lat, lon);
						}else if (bat < 100){
							new AddMarker(carID, title, content, "car_loading_75", lat, lon);
						}

					}, function(response){
						
						var endTime = new Date();
						endTime.setTime(endTime.getTime() + (100 - bat) * 1000 * 60);

						var content = "Das Fahrzeug lädt. Ladezustand " + parseInt(bat) + " (" + car.loadingStateObj.text + "). Voraussichtliches Ende gegen " + Helper.Get_Zeit(endTime).time + ", bei einer Aufladung von 1% pro Minute.";
						if(bat < 25){
							new AddMarker(carID, title, content, "car_loading_00", lat, lon);
						}else if (bat < 50){
							new AddMarker(carID, title, content, "car_loading_25", lat, lon);
						}else if (bat < 75){
							new AddMarker(carID, title, content, "car_loading_50", lat, lon);
						}else if (bat < 100){
							new AddMarker(carID, title, content, "car_loading_75", lat, lon);
						}

					});

				}else{
					var content = "Das Fahrzeug ist voll geladen und kann benutzt werden.";
                	new AddMarker(carID, title, content, "car_available", lat, lon);
				}

				break;

		}

    }


    /**
     * Description
     * Funktion um Stationen der Karte hinzuzufügen
     * @method AddStation
     * @param {} station
     * @return 
     */
    function AddStation(station){

        var lat = station.latitude;
        var lon = station.longitude;

        var occupied = station.slotsOccupied;
        var total = station.slots;
        var diff = total - occupied;

        var title = "Ladestation";
        var content =  diff + " von " + total + " Slots frei";

        // Abfrage ob Station frei oder besetz für die Ausgabe von Info
        if(diff === 0){
            new AddMarker(station.stationID, title, content, "station_occupied", lat, lon);
        }else{
            new AddMarker(station.stationID, title, content, "station_available", lat, lon);
        }

    }

    /**
     * Description
     * Funktion um die Position für Marker, Autos und Stationen zu laden
     * @method LoadPositions
     * @return 
     */
    function LoadPositions(){

        carsVisible = true;
        stationsVisible = true;
        carMarkers = [];
        stationMarkers = [];
        var refIntCarID;
        var refIntStatID;

        /**
         * Description
         * Hier werden alle Autos von Rest-Schnittstelle geholt
         * @method GetCars
         * @return 
         */
        function GetCars(){
            //GET Call to get all cars
            RESTFactory.Cars_Get().then(function (response) {
                
                clearInterval(refIntCarID);
                
                if (response.data.length === null || response.data.length === 0) {
                    return;
                }

                var data = response.data;

                data.forEach(function(data_use, index){
				
                    var vehicle = {};
                    
                    vehicle.vehicleID = data_use.carId;
                    vehicle.licensePlate = data_use.licensePlate;
                    vehicle.chargingState = data_use.chargingState;
                    vehicle.bookingState = data_use.bookingState;
                    vehicle.bookingStateObj = BOOKING_STATES[data_use.bookingState];
                    vehicle.loadingStateObj = LOADING_STATES[data_use.chargingState];
                    vehicle.mileage = data_use.mileage;
                    vehicle.chargeLevel = data_use.chargeLevel;
                    vehicle.kilowatts = data_use.kilowatts;
                    vehicle.manufacturer = data_use.manufacturer;
                    vehicle.model = data_use.model;
                    vehicle.constructionYear = data_use.yearOfConstruction;
                    vehicle.lastLat = data_use.lastKnownPositionLatitude;
                    vehicle.lastLon = data_use.lastKnownPositionLongitude;
                    vehicle.lastDate = Helper.Get_Zeit_Server(data_use.lastKnownPositionDate);
                    vehicle.address_state = "false";
                    
                    new Cars_AddMarker(vehicle);
                    
                });

			});
			
        }

        /**
         * Description
         * Hier werden alle Stationen von Rest-Schnittstelle geholt
         * @method GetStations
         * @return 
         */
        function GetStations(){

            //GET Call to get all stations
            RESTFactory.Charging_Stations_Get().then(function(response){
                clearInterval(refIntStatID);
                var stations = response.data;
                for(var i = 0; i < stations.length; i++){
                    var station = stations[i];
                    new AddStation(station);
                }
            });
		}
		
		//Start spamming backend to get values
		refIntCarID = setInterval(GetCars, 1000);
		refIntStatID = setInterval(GetStations, 1000);


    }

    /**
     * Description
     * Funktion zeigt ein PopUp auf der Karte
     * Durch diesen Dialog kann der User eine Fahrt zu buchen
     * @method ShowInputPopUp
     * @param {} address
     * @param {} lat
     * @param {} lon
     * @return 
     */
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

            /**
             * Description
             * Funktion um Datum und Uhrzeit für eine Bestellung in einem Dialog anzuzeigen und bearbeiten
             * @method DialogController
             * @param {} $scope
             * @param {} $mdDialog
             * @return 
             */
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

                /**
                 * Description
                 * Funktion um ein Dialog zu verstecken
                 * @method closeDialog
                 * @return 
                 */
                $scope.closeDialog = function(){
                    $mdDialog.hide();
                };

                /**
                 * Description
                 * Funktion um eingegebene Daten für eine Buchung zu überprüfen und dem User bescheid zu geben ob eine Buchung erfolgreich war
                 * @method Save
                 * @return 
                 */
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
                        customerId: $scope.customerID,
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

    /**
     * Description
     * Funktion um Auto-Marker zu verstecken bzw zu anzuzeigen
     * @method ToggleCars
     * @return 
     */
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

    /**
     * Description
     * Funktion um Stationen-Marker zu verstecken bzw zu anzuzeigen
     * @method ToggleStations
     * @return 
     */
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



    /**
     * Description
     * Funktion die Karte auf die Seite lädt, Suchleiste in die Karte rendert,
     * und alle für eine Buchung benötigte Daten zu vorbereiten 
     * @method Init
     * @return 
     */
    function Init(){

        var input = document.getElementById('search_input');
        var searchBox = new google.maps.places.SearchBox(input);

        var carBtn = document.getElementById('car_btn');
        var stationBtn = document.getElementById('station_btn');
        
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 16,
			center: new google.maps.LatLng(49.5, 8.434),
			mapTypeId: 'roadmap'
		});

		map.addListener("click", function (event) {

			var lat = event.latLng.lat();
			var lon = event.latLng.lng();

			RESTFactory.Get_Address(lat, lon).then(function (address) {
				new ShowInputPopUp(address, lat, lon);
			});

		});


        // Controls auf die Karte setzen 
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

            RESTFactory.Get_Address(lat, lon).then(function(response){
                new ShowInputPopUp(response, lat, lon);
            });

        });

        //hier werden benötigte Daten von der Rest-Schnittstelle gehollt.
        RESTFactory.Bookings_Get_CustomerID($scope.customerID).then(function(response){
            var bookings = response.data;
            var interested = [];
            var soon_bookings = [];

            for(var jk = 0; jk < bookings.length; jk++){
                var booking = bookings[jk];

                var d = Helper.Get_Zeit_Server(booking.plannedDate);
                var now = new Date();
                var dif = (d.value - now.getTime()) / 1000 / 60;

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

                        RESTFactory.Get_Address(lat, lon).then(function(address){

                            var soon_booking = {};

                            soon_booking.lat = lat;
                            soon_booking.lon = lon;
                            soon_booking.stationID = chargingID;
                            soon_booking.carID = carID;
                            soon_booking.address = address;
                            soon_booking.date = Helper.Get_Zeit_Server(booking2.plannedDate);

                            soon_bookings.push(soon_booking);

                            var content = "Ihr Fahrzeug mit der ID: " + soon_booking.carID + " steht ab " + soon_booking.date.time + " am " + soon_booking.date.date + " an der Station " + soon_booking.stationID + " bereit";

                            new AddMarker(soon_booking.carID, "Ihre Reservierung", content, "car_reserved", lat, lon);

                        });

                    });

                });

            }

        });


        new LoadPositions();

    }

    /**
     * Description
     * @method ToggleCars
     * @return 
     */
	$scope.ToggleCars = function () {
		new ToggleCars();
	};

    /**
     * Description
     * @method ToggleStations
     * @return 
     */
	$scope.ToggleStations = function () {
		new ToggleStations();
	};
    
    new Init();

});
