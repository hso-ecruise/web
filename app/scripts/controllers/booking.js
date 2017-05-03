'use strict';

application.controller('Ctrl_Booking', function ($rootScope, $scope, $mdDialog, RESTFactory, Helper) {    

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

        Helper.Get_Address(lat, lon).then(function(address){
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


    function AddMarker(title, content, image_string, lat, lon){

        var img = {
            url: 'images/icons/car_available.png',
            scaledSize: new google.maps.Size(60, 87),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 30)
        };

        img.url = icons[image_string].icon;

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            map: map,
            icon: img
        });

        marker.addListener('click', function(event){
            alert = $mdDialog.alert({
                title: title,
                textContent: content,
                ok: 'OK'
            });

            $mdDialog
                .show( alert )
                .finally(function() {
                alert = undefined;
            });
        });

    }

    function AddVehicle(car){

        if(car.BookingState === "FREE"){

            var lat = car.LastKnownPositionLatitude;
            var lon = car.LastKnownPositionLongitude;
            var bat = car.ChargeLevel;
            var carID = car.CarId;

            var title = "Fahrzeugdetails:";

            if(bat < 100){

                var res = RESTFactory.Car_Charging_Stations_Get_CarID(carID);

                res.then(function(response){
                    var info = response.data;
                    if(info.length > 0){

                        var time = Helper.Get_Time(info[0].ChargeEnd);
                        var content = "Das Fahrzeug lädt. Ladezustand " + parseInt(bat) + "%. Voraussichtlich um " + time + "fertig geladen.";

                        if(bat < 25){
                            AddMarker(title, content, "car_loading_00", lat, lon);
                        }else if (bat < 50){
                            AddMarker(title, content, "car_loading_25", lat, lon);
                        }else if (bat < 75){
                            AddMarker(title, content, "car_loading_50", lat, lon);
                        }else if (bat < 100){
                            AddMarker(title, content, "car_loading_75", lat, lon);
                        }

                    }
                }, function(response){

                    console.log("Failed to get loading informations");

                    var time = Helper.Get_Time(new Date());

                    var content = "Das Fahrzeug lädt. Ladezustand " + parseInt(bat) + "%. Voraussichtlich um " + time + " fertig geladen.";
                    if(bat < 25){
                        AddMarker(title, content, "car_loading_00", lat, lon);
                    }else if (bat < 50){
                        AddMarker(title, content, "car_loading_25", lat, lon);
                    }else if (bat < 75){
                        AddMarker(title, content, "car_loading_50", lat, lon);
                    }else if (bat < 100){
                        AddMarker(title, content, "car_loading_75", lat, lon);
                    }

                });



            }else{

                var content = "Das Fahrzeug ist voll geladen und kann benutzt werden.";

                AddMarker(title, content, "car_available", lat, lon);

            }

        }

    }

    function AddStation(station){

        var lat = station.Latitude;
        var lon = station.Longitude;


        var occupied = station.SlotsOccupied;
        var total = station.Slots;

        var diff = total - occupied;

        var title = "Ladestation";
        var content =  diff + " von " + total + " Slots frei";

        if(diff === 0){
            AddMarker(title, content, "station_occupied", lat, lon);
        }else{
            AddMarker(title, content, "station_available", lat, lon);
        }

    }

    function LoadPositions(){

        //GET Call to get all cars
        var res_cars = RESTFactory.Cars_Get();
        res_cars.then(function(response){

            var cars = response.data;

            for(var i = 0; i < cars.length; i++){
                var car = cars[i];
                AddVehicle(car);
            }

        }, function(response){

            console.log("Failed to get cars position.");

            for(var i = 0; i < 50; i++){

                var car = {
                    LastKnownPositionLatitude: 49.5 + Math.random() * 0.1,
                    LastKnownPositionLongitude: 8.434 + Math.random() * 0.1,
                    ChargeLevel: Math.random() * 100.0,
                    BookingState: "FREE"
                };

                AddVehicle(car);

            }

        });


        //GET Call to get all stations
        var res_stations = RESTFactory.Cars_Get();
        res_stations.then(function(response){

            var stations = response.data;

            for(var i = 0; i < stations.length; i++){
                var station = stations[i];
                AddStation(station);
            }

        }, function(response){

            console.log("Failed to get cars position.");

            for(var i = 0; i < 50; i++){

                var station = {
                    Slots: parseInt(2 + Math.random() * 3),
                    SlotsOccupied: parseInt(Math.random() * 5),
                    Latitude: 49.5 + Math.random() * 0.1,
                    Longitude: 8.434 + Math.random() * 0.1
                };

                AddStation(station);

            }

        });

    }

    function ShowInputPopUp(address, lat, lon){

        console.log("SHOW");

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
            //'               <md-datepicker type="date" placeholder="Datum" ng-model="date"></md-datepicker> ' +    waere zwar schoner aber scheiss drauf       
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
                };

                $scope.Save = function(){

                    console.log("REST call for booking: " + lat + " , " + lon + "  Datum: " + $scope.date + " Uhrzeit: " + $scope.time);

                    $scope.closeDialog();
                };

            }
        });

    }

    LoadPositions();

});
