'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */

const IP = 'https://api.ecruise.me/v1';
const API_KEY = "AIzaSyBCbY_MjWJ1cDjugF_MBHwnYDWFNJYAa4o&callback=initMap";

application.service('GetCaller', function ($http, $rootScope) {

    /**
     * Description
     * Implementation der GET-Funktion 
     * @method Get
     * @param {} url
     * @param {} body
     * @param {} token
     * @return get
     */
    this.Get = function (url, body, token) {

        var myToken = $rootScope.token;
        var get = {};

        if(token === true){
            get = $http({
                method: "get",
                url: url,
                data: body,
                headers: {
                    'access_token': myToken
                }
            });
        }else{
            get = $http({
                method: "get",
                url: url,
                data: body
            });
        }
        return get;
    };

    /**
	 * Description
     * Implementation der GetShort-Funktion
	 * @method GetShort
	 * @param {} url
	 * @param {} token
	 * @return get
	 */
    this.GetShort = function (url, token) {

        var myToken = $rootScope.token;

        var get = {};

        if(token === true){

            get = $http({
                method: "get",
                url: url,
                headers: {
                    'access_token': myToken
                }
            });
        }else{
            get = $http({
                method: "get",
                url: url
            });
        }

        return get;
    };
});

application.service('PostCaller', function ($http, $rootScope) {

    /**
     * Description
     * Implementation der POST-Funktion
     * @method Post
     * @param {} url
     * @param {} body
     * @param {} token
     * @return post
     */
    this.Post = function (url, body, token) {

        var post = {};

        if(token === true){
            post = $http({
                method: "post",
                url: url,
                data: body,
                headers: {
                    'access_token': $rootScope.token
                }
            });
        }else{
            post = $http({
                method: "post",
                url: url,
                data: body
            });			
        }

        return post;

    };

});

application.service('PatchCaller', function ($http, $rootScope) {

    /**
     * Description
     * Implementation der PATCH-Funktion
     * @method Patch
     * @param {} url
     * @param {} body
     * @param {} token
     * @return patch
     */
    this.Patch = function (url, body, token) {

        var patch = {};

        if(token === true){
            patch = $http({
                method: "patch",
                url: url,
                data: body,
                headers: {
                    'access_token': $rootScope.token
                }
            });
        }else{
            patch = $http({
                method: "patch",
                url: url,
                data: body
            });
        }

        return patch;

    };

});


application.factory('RESTFactory', function ($http, GetCaller, PostCaller, PatchCaller) {

    return {

        //OTHERS
        /**
		 * Description
         * GET Funktion die aus lat und lot eine Adresse generiert
		 * @method GetAddress
		 * @param {} lat
		 * @param {} lon
		 * @return orig
		 */
        GetAddress: function(lat, lon){
            var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
            url += lat + "," + lon + "&key=" + API_KEY;
            var orig = Promise.resolve(GetCaller.Get(url, null, false));
            return orig;
        },




        //TRIPS
        /**
		 * Description
         * GET Funktion die Trips alle lädt
		 * @method Trips_Get
		 * @return orig
		 */
        Trips_Get: function(){
            var url = IP + "/trips";
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion die ein Trip durch seine ID lädt
		 * @method Trips_Get_TripID
		 * @param {} id
		 * @return orig
		 */
        Trips_Get_TripID: function(id){
            var url = IP + "/trips/" + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion die Trips eines Autos lädt
		 * @method Trips_Get_CarID
		 * @param {} id
		 * @return orig
		 */
        Trips_Get_CarID: function(id){
            var url = IP + "/trips/by-car/" + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },

        /**
		 * Description
         * Funktion für POST von Trips
		 * @method Trips_Post
		 * @param {} data
		 * @return orig
		 */
        Trips_Post: function(data){
            var url = IP + "/trips";
            var orig = Promise.resolve(PostCaller.Get(url, data, true));
            return orig;
        },

        /**
		 * Description
         * Funktion für PATCH von Trip mit TripID
		 * @method Trips_Patch
		 * @param {} id
		 * @param {} data
		 * @return orig
		 */
        Trips_Patch: function(id, data){
            var url = IP + "/trips?TripId=" + id;
            var orig = Promise.resolve(PatchCaller.Patch(url, data, true));
            return orig;
        },




        //PUBLIC
        /**
		 * Description
         * Funktion für Login GET
		 * @method Login_Get
		 * @param {} email
		 * @param {} data
		 * @return orig
		 */
        Login_Get: function(email, data){
            var url = IP + "/public/login/" + email;
            var orig = Promise.resolve(GetCaller.Get(url, data, false));
            return orig;
        },
        /**
		 * Description
         * Funktion für User-Login POST
		 * @method User_Login
		 * @param {} email
		 * @param {} password
		 * @return orig
		 */
        User_Login: function(email, password){
            var url = IP + "/public/login/" + email;
            var orig = Promise.resolve(PostCaller.Post(url, password, false));
            return orig;
        },
        /**
		 * Description
         * Funktion für User-Register POST
		 * @method User_Register
		 * @param {} data
		 * @return orig
		 */
        User_Register: function(data){
            var url = IP + "/public/register";
            var orig = Promise.resolve(PostCaller.Post(url, data, false));
            return orig;
        },




        //CUSTOMERS
        /**
		 * Description
         * GET Funktion für Kunde
		 * @method Customers_Get
		 * @return orig
		 */
        Customers_Get: function(){
            var url = IP + "/customers";
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Kunde ID
		 * @method Customers_Get_CustomerID
		 * @param {} id
		 * @return orig
		 */
        Customers_Get_CustomerID: function(id){
            var url = IP + "/customers/" + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Kunde Name
		 * @method Customers_Get_Name
		 * @param {} name
		 * @return orig
		 */
        Customers_Get_Name: function(name){
            var url = IP + "/customers/by-lastname/" + name;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },

        /**
		 * Description
         * POST Funktion für Kunden
		 * @method Customers_Post
		 * @param {} data
		 * @return orig
		 */
        Customers_Post: function(data){
            var url = IP + "/public/register";		// "/customers";
            var orig = Promise.resolve(PostCaller.Post(url, data, true));
            return orig;
        },

        /**
		 * Description
         * PATCH Funktion für Kunde Passwort 
		 * @method Customers_Patch_Password
		 * @param {} id
		 * @param {} pwd
		 * @return orig
		 */
        Customers_Patch_Password: function(id, pwd){
            var url = IP + "/customers/" + id + "/password";
            var orig = Promise.resolve(PatchCaller.Patch(url, pwd, true));
            return orig;
        },
        /**
		 * Description
         * PATCH Funktion für Kunde Email 
		 * @method Customers_Patch_Email
		 * @param {} id
		 * @param {} email
		 * @return orig
		 */
        Customers_Patch_Email: function(id, email){
            var url = IP + "/customers/" + id + "/email";
            var orig = Promise.resolve(PatchCaller.Patch(url, email, true));
            return orig;
        },
        /**
		 * Description
         * PATCH Funktion für Kunde Telefonnummer
		 * @method Customers_Patch_PhoneNr
		 * @param {} id
		 * @param {} phoneNr
		 * @return orig
		 */
        Customers_Patch_PhoneNr: function(id, phoneNr){
            var url = IP + "/customers/" + id + "/phone-number";
            var orig = Promise.resolve(PatchCaller.Patch(url, phoneNr, true));
            return orig;
        },
        /**
		 * Description
         * PATCH Funktion für Kunde Adresse
		 * @method Customers_Patch_Address
		 * @param {} id
		 * @param {} address
		 * @return orig
		 */
        Customers_Patch_Address: function(id, address){
            var url = IP + "/customers/" + id + "/address";
            var orig = Promise.resolve(PatchCaller.Patch(url, address, true));
            return orig;
        },
        /**
		 * Description
         * PATCH Funktion für Kunde ChipCard 
		 * @method Customers_Patch_ChipCard
		 * @param {} id
		 * @param {} chipID
		 * @return orig
		 */
        Customers_Patch_ChipCard: function(id, chipID){
            var url = IP + "/customers/" + id + "/chipcarduid";
            var orig = Promise.resolve(PatchCaller.Patch(url, chipID, true));
            return orig;
        },
        /**
		 * Description
         * PATCH Funktion für Kunde Verified
		 * @method Customers_Patch_Verified
		 * @param {} id
		 * @param {} verified
		 * @return orig
		 */
        Customers_Patch_Verified: function(id, verified){
            var url = IP + "/customers/" + id + "/verified";
            var orig = Promise.resolve(PatchCaller.Patch(url, verified, true));
            return orig;
        },



        //CARS
        /**
		 * Description
         * GET Funktion für Autos
		 * @method Cars_Get
		 * @return orig
		 */
        Cars_Get: function(){
            var url = IP + "/cars";
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Auto ID
		 * @method Cars_Get_CarID
		 * @param {} id
		 * @return orig
		 */
        Cars_Get_CarID: function(id){
            var url = IP + "/cars/" + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Auto in der Nähe von lat lon
		 * @method Cars_Get_ClosestTo
		 * @param {} lat
		 * @param {} lon
		 * @return orig
		 */
        Cars_Get_ClosestTo: function(lat, lon){
            var url = IP + "/cars/closest-to/" + lat + "/" + lon;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },

        /**
		 * Description
         * POST Funktion für Auto
		 * @method Cars_Post
		 * @param {} data
		 * @return orig
		 */
        Cars_Post: function(data){
            var url = IP + "/cars";
            var orig = Promise.resolve(PostCaller.Post(url, data, true));
            return orig;
        },

        /**
		 * Description
         * PATCH Funktion für Auto ID Status
		 * @method Cars_Patch_ChargingState
		 * @param {} id
		 * @param {} data
		 * @return orig
		 */
        Cars_Patch_ChargingState: function(id, data){
            var url = IP + "/cars/" + id + "/chargingstate";
            var orig = Promise.resolve(PatchCaller.Patch(url, data, true));
            return orig;
        },
        /**
		 * Description
         * PATCH Funktion für Auto ID Buchungsstatus
		 * @method Cars_Patch_BookingState
		 * @param {} id
		 * @param {} data
		 * @return orig
		 */
        Cars_Patch_BookingState: function(id, data){
            var url = IP + "/cars/" + id + "/bookingstate";
            var orig = Promise.resolve(PatchCaller.Patch(url, data, true));
            return orig;
        },
        /**
		 * Description
         * PATCH Funktion für Auto Laufleistung
		 * @method Cars_Patch_Mileage
		 * @param {} id
		 * @param {} data
		 * @return orig
		 */
        Cars_Patch_Mileage: function(id, data){
            var url = IP + "/cars/" + id + "/mileage";
            var orig = Promise.resolve(PatchCaller.Patch(url, data, true));
            return orig;
        },
        /**
		 * Description
         * PATCH Funktion für Auto Ladungstatus
		 * @method Cars_Patch_ChargeLevel
		 * @param {} id
		 * @param {} data
		 * @return orig
		 */
        Cars_Patch_ChargeLevel: function(id, data){
            var url = IP + "/cars/" + id + "/chargelevel";
            var orig = Promise.resolve(PatchCaller.Patch(url, data, true));
            return orig;
        },
        /**
		 * Description
         * PATCH Funktion für Auto Position
		 * @method Cars_Patch_Position
		 * @param {} id
		 * @param {} lat
		 * @param {} lon
		 * @return orig
		 */
        Cars_Patch_Position: function(id, lat, lon){
            var url = IP + "/cars/" + id + "/position/" + lat + "/" + lon;
            var orig = Promise.resolve(PatchCaller.Patch(url, null));
            return orig;
        },




        //CHARGING-STATION
        /**
		 * Description
         * GET Funktion für Stationen
		 * @method Charging_Stations_Get
		 * @return orig
		 */
        Charging_Stations_Get: function(){
            var url = IP + "/charging-stations";
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Station ID
		 * @method Charging_Stations_Get_Charging_StationID
		 * @param {} id
		 * @return orig
		 */
        Charging_Stations_Get_Charging_StationID: function(id){
            var url = IP + "/charging-stations/" + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Station in der Näge von Position lat lon
		 * @method Charging_Stations_Get_ClosestTo
		 * @param {} lat
		 * @param {} lon
		 * @return orig
		 */
        Charging_Stations_Get_ClosestTo: function(lat, lon){
            var url = IP + "/charging-stations/closest-to/" + lat + "/" + lon;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },

        /**
		 * Description
         * POST Funktion für Stationen
		 * @method Charging_Stations_Post
		 * @param {} data
		 * @return orig
		 */
        Charging_Stations_Post: function(data){
            var url = IP + "/charging-stations";
            var orig = Promise.resolve(PostCaller.Post(url, data, true));
            return orig;
        },




        //CAR CHARGING STATION
        /**
		 * Description
         * GET Funktion für Autoladestationen
		 * @method Car_Charging_Stations_Get
		 * @return orig
		 */
        Car_Charging_Stations_Get: function(){
            var url = IP + "/car-charging-stations";
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Autoladestationen Auto ID 
		 * @method Car_Charging_Stations_Get_CarID
		 * @param {} id
		 * @return orig
		 */
        Car_Charging_Stations_Get_CarID: function(id){
            var url = IP + "/car-charging-stations/by-car/" + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Autoladestation Station ID
		 * @method Car_Charging_Stations_Get_ChargingStationID
		 * @param {} id
		 * @return orig
		 */
        Car_Charging_Stations_Get_ChargingStationID: function(id){
            var url = IP + "/car-charging-stations/by-charging-station/" + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },

        /**
		 * Description
         * POST Funktion für Autoladestation
		 * @method Car_Charging_Stations_Post
		 * @param {} data
		 * @return orig
		 */
        Car_Charging_Stations_Post: function(data){
            var url = IP + "/car-charging-stations";
            var orig = Promise.resolve(PostCaller.Post(url, data, true));
            return orig;
        },

        /**
		 * Description
         * PATCH Funktion für Autoladestationen ID
		 * @method Car_Charging_Stations_Patch_ChargeEnd
		 * @param {} id
		 * @param {} data
		 * @return orig
		 */
        Car_Charging_Stations_Patch_ChargeEnd: function(id, data){
            var url = IP + "/car-charging-stations/" + id + "/charge-end/";
            var orig = Promise.resolve(PatchCaller.Patch(url, data, true));
            return orig;
        },




        //INVOICES
        /**
		 * Description
		 * GET Funktion für Invoices
         * @method Invoices_Get
		 * @return orig
		 */
        Invoices_Get: function(){
            var url = IP + "/invoices";
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Invoice ID
		 * @method Invoices_Get_InvoiceID
		 * @param {} id
		 * @return orig
		 */
        Invoices_Get_InvoiceID: function(id){
            var url = IP + "/invoices/" + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Invoice Customer ID
		 * @method Invoices_Get_CustomerID
		 * @param {} id
		 * @return orig
		 */
        Invoices_Get_CustomerID: function(id){
            var url = IP + "/invoices/by-customer/" + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Invoice ID + items
		 * @method Invoices_Get_Items
		 * @param {} id
		 * @return orig
		 */
        Invoices_Get_Items: function(id){
            var url = IP + "/invoices/" + id + "/items";
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Invoice ItemID
		 * @method Invoices_Get_Items_ItemID
		 * @param {} itemID
		 * @return orig
		 */
        Invoices_Get_Items_ItemID: function(itemID){
            var url = IP + "/invoices/by-invoice-item/" + itemID;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Invoice ID Item ID
		 * @method Invoices_Get_InvoiceID_Items_ItemID
		 * @param {} id
		 * @param {} itemID
		 * @return orig
		 */
        Invoices_Get_InvoiceID_Items_ItemID: function(id, itemID){
            var url = IP + "/invoices/" + id + "/items/" + itemID;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },

        /**
         * Description
         * POST Funktion für Invoice ID Item
		 * @method Invoices_Post_Items
		 * @param {} id
		 * @param {} data
		 * @return orig
		 */
        Invoices_Post_Items: function(id, data){
            var url = IP + "/invoices/" + id + "/items";
            var orig = Promise.resolve(PostCaller.Post(url, data, true));
            return orig;
        },

        /**
		 * Description
         * PATCH Funktion für Invoice ID paid
		 * @method Invoices_Patch_Paid
		 * @param {} id
		 * @param {} data
		 * @return orig
		 */
        Invoices_Patch_Paid: function(id, data){
            var url = IP + "/invoices/" + id + "/paid";
            var orig = Promise.resolve(PatchCaller.Patch(url, data, true));
            return orig;
        },




        //BOOKINGS
        /**
		 * Description
         * GET Funktion für Bookings
		 * @method Bookings_Get
		 * @return orig
		 */
        Bookings_Get: function(){
            var url = IP + "/bookings";
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Bookings ID
		 * @method Bookings_Get_BookingID
		 * @param {} id
		 * @return orig
		 */
        Bookings_Get_BookingID: function(id){
            var url = IP + "/bookings/" + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Bookings Customer ID
		 * @method Bookings_Get_CustomerID
		 * @param {} id
		 * @return orig
		 */
        Bookings_Get_CustomerID: function(id){
            var url = IP + "/bookings/by-customer/" + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Booking Trip ID
		 * @method Bookings_Get_TripID
		 * @param {} id
		 * @return orig
		 */
        Bookings_Get_TripID: function(id){
            var url = IP + "/bookings/by-trip/" + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Booking Date
		 * @method Bookings_Get_Date
		 * @param {} date
		 * @return orig
		 */
        Bookings_Get_Date: function(date){
            var url = IP + "/bookings/date/" + date;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },

        /**
		 * Description
         * POST Funktion für Bookings
		 * @method Bookings_Post
		 * @param {} data
		 * @return orig
		 */
        Bookings_Post: function(data){
            var url = IP + "/bookings";
            var orig = Promise.resolve(PostCaller.Post(url, data, true));
            return orig;
        },




        //MAINTENANCES
        /**
		 * Description
         * GET Funktion für Maintenances
		 * @method Maintances_Get
		 * @return orig
		 */
        Maintances_Get: function(){
            var url = IP + '/maintenances';
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Maintenances ID
		 * @method Maintances_Get_MaintenanceID
		 * @param {} id
		 * @return orig
		 */
        Maintances_Get_MaintenanceID: function(id){
            var url = IP + '/maintenances/' + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },

        /**
		 * Description
         * POST Funktion für Maintenances
		 * @method Maintances_Post
		 * @param {} data
		 * @return orig
		 */
        Maintances_Post: function(data){
            var url = IP + "/maintenances";
            var orig = Promise.resolve(PostCaller.Post(url, data, true));
            return orig;
        },




        //CAR MAINTENANCES
        /**
		 * Description
         * GET Funktion für Auto Maintenances
		 * @method Car_Maintances_Get
		 * @return orig
		 */
        Car_Maintances_Get: function(){
            var url = IP + '/car-maintenances';
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Auto Maintenances ID
		 * @method Car_Maintances_Get_CarMaintenanceID
		 * @param {} id
		 * @return orig
		 */
        Car_Maintances_Get_CarMaintenanceID: function(id){
            var url = IP + '/car-maintenances/' + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Auto Maintenances by Maintenance ID
		 * @method Car_Maintances_Get_MaintenanceID
		 * @param {} id
		 * @return orig
		 */
        Car_Maintances_Get_MaintenanceID: function(id){
            var url = IP + '/car-maintenances/by-maintenance/' + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Auto Maintenances by Auto ID
		 * @method Car_Maintances_Get_CarID
		 * @param {} id
		 * @return orig
		 */
        Car_Maintances_Get_CarID: function(id){
            var url = IP + '/car-maintenances/by-car/' + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Auto Maintenances by InvoiceItem ID
		 * @method Car_Maintances_Get_InvoiceItemID
		 * @param {} id
		 * @return orig
		 */
        Car_Maintances_Get_InvoiceItemID: function(id){
            var url = IP + '/car-maintenances/by-invoice-item/' + id;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },

        /**
		 * Description
         * POST Funktion für Auto Maintenances
		 * @method Car_Maintances_Post
		 * @param {} data
		 * @return orig
		 */
        Car_Maintances_Post: function(data){
            var url = IP + "/car-maintenances";
            var orig = Promise.resolve(PostCaller.Post(url, data, true));
            return orig;
        },

        /**
		 * Description
         * PATCH Funktion für Auto Maintenances
		 * @method Car_Maintances_Patch_CompletedDate
		 * @param {} id
		 * @param {} data
		 * @return orig
		 */
        Car_Maintances_Patch_CompletedDate: function(id, data){
            var url = IP + "/car-maintenances/" + id + "/completed-date";
            var orig = Promise.resolve(PatchCaller.Patch(url, data, true));
            return orig;
        },

        //STATISTICS
        /**
		 * Description
         * GET Funktion für Statistik
		 * @method Statistics_Get
		 * @return orig
		 */
        Statistics_Get: function(){
            var url = IP + '/statistics';
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        },
        /**
		 * Description
         * GET Funktion für Statistik Data
		 * @method Statistics_Get_ByDate
		 * @param {} date
		 * @return orig
		 */
        Statistics_Get_ByDate: function(date){
            var url = IP + '/statistics/' + date;
            var orig = Promise.resolve(GetCaller.GetShort(url, true));
            return orig;
        }



    };

});



application.factory('Helper', function (RESTFactory, $cookies) {

    return {
        /**
	 * Description
     * Funktion um Uhrzeit zu konvertieren in String
	 * @method Get_Time
	 * @param {} input
	 * @return time
	 */
        Get_Time: function (input){
            var d = new Date(input);
            var time = d.getHours() + ":" + d.getMinutes();
            if(d.getMinutes() < 10){
                time = d.getHours() + ":0" + d.getMinutes();
            }
            return time;
        },
        /**
	 * Description
     * Funktion um Datum in String zu konvertieren
	 * @method Get_Date
	 * @param {} input
	 * @return date
	 */
        Get_Date: function (input){
            var d = new Date(input);
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            if(month < 10){
                month = "0" + month;
            }
            var date = day + "." + month + "." + year;
            return date;
        },
        /**
	 * Description
     * Funktion um Adresse zu konvertieren
	 * @method Get_Address
	 * @param {} lat
	 * @param {} lon
	 * @return NewExpression
	 */
        Get_Address: function(lat, lon){

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

        },
        /**
	 * Description
     * Funktion um Cookie zu beschreiben
	 * @method Cookie_Set
	 * @param {} name
	 * @param {} value
	 * @return Literal
	 */
        Cookie_Set: function (name, value){
            var text = name + "=" + value;
            document.cookie = text;
            return "";
        },
        /**
	 * Description
     * Funktion um in Cookie gespeicherte Daten zu bekommen
	 * @method Cookie_Get
	 * @param {} name
	 * @return CallExpression
	 */
        Cookie_Get: function (name){
            return $cookies.get(name);
        },

        /**
	 * Description
     * Funktion um aktuelles Datum und Uhrzeit zu bekommen
	 * @method Get_Now
	 * @return date
	 */
        Get_Now: function(){

            var now = new Date();

            var date = {};

            date.date = now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
            date.time = now.getHours() + ":" + now.getMinutes();
            if(now.getMinutes() < 10){
                date.time = now.getHours() + ":0" + now.getMinutes();
            }
            date.value = now.getTime();
            date.string = now;

            date.date_ele = {};
            date.date_ele.day = now.getDate();
            date.date_ele.month = now.getMonth();
            date.date_ele.year = now.getFullYear();

            date.time_ele = {};
            date.time_ele.minutes = now.getMinutes();
            date.time_ele.hours = now.getHours();

            return date;

        },

        /**
	 * Description
     * Funktion um aktuelles Datum und Uhrzeit zu bekommen
	 * @method Get_Zeit
	 * @param {} value
	 * @return date
	 */
        Get_Zeit: function(value){

            var now = new Date(value);

            var date = {};

            date.date = now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
            date.time = now.getHours() + ":" + now.getMinutes();
            if(now.getMinutes() < 10){
                date.time = now.getHours() + ":0" + now.getMinutes();
            }
            date.value = now.getTime();
            date.string = now;

            date.date_ele = {};
            date.date_ele.day = now.getDate();
            date.date_ele.month = now.getMonth();
            date.date_ele.year = now.getFullYear();

            date.time_ele = {};
            date.time_ele.minutes = now.getMinutes();
            date.time_ele.hours = now.getHours();

            return date;

        }

    };

});
