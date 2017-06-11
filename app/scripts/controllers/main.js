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
     * @method Get
     * @param {} url
     * @param {} body
     * @param {} token
     * @return get
     */
/* Uncomment if call with token is added

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
*/
	/**
	 * Description
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
		}
		
		return patch;
		
    };

});


application.factory('RESTFactory', function ($http, GetCaller, PostCaller, PatchCaller) {

	return {

		/**
		 * Description
		 * @method GetAddress
		 * @param {} lat
		 * @param {} lon
		 * @return orig
		 */
		Get_Address: function(lat, lon){
			var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
			url += lat + "," + lon + "&key=" + API_KEY;

			return new Promise(function (resolve, reject) {

				GetCaller.GetShort(url, false).then(function (response) {

					var ret = response.data.results[0].address_components;

					var address = {};

					for (var i = 0; i < ret.length; i++) {
						for (var j = 0; j < ret[i].types.length; j++) {
							switch (ret[i].types[j]) {
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
		
		
		
	//TRIPS
		/**
		 * Description
		 * @method Trips_Get_TripID
		 * @param {} id
		 * @return orig
		 */
		Trips_Get_TripID: function(id){
			var url = IP + "/trips/" + id;
			var orig = Promise.resolve(GetCaller.GetShort(url, true));
			return orig;
		},

		
		
	//PUBLIC
		/**
		 * Description
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
		
		
		
	//CARS
		/**
		 * Description
		 * @method Cars_Get
		 * @return orig
		 */
		Cars_Get: function(){
			var url = IP + "/cars";
			var orig = Promise.resolve(GetCaller.GetShort(url, true));
			return orig;
		},
		/**
		 * GET Funktion für Autoladestatus
		 * @method Cars_Get_ChargeLevelPerMinute
		 * @return orig
		 */
		Cars_Get_ChargeLevelPerMinute: function(){
			var url = IP + "/cars/charge-level-per-minute";
			var orig = Promise.resolve(GetCaller.GetShort(url, true));
			return orig;
		},
		
		

	//CHARGING-STATION
		/**
		 * Description
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
		 * @method Charging_Stations_Get_Charging_StationID
		 * @param {} id
		 * @return orig
		 */
		Charging_Stations_Get_Charging_StationID: function(id){
			var url = IP + "/charging-stations/" + id;
			var orig = Promise.resolve(GetCaller.GetShort(url, true));
			return orig;
		},
		
	
	
	//INVOICES
		/**
		 * Description
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
		 * @method Invoices_Get_Items_ItemID
		 * @param {} itemID
		 * @return orig
		 */
		Invoices_Get_Items_ItemID: function(itemID){
			var url = IP + "/invoices/by-invoice-item/" + itemID;
			var orig = Promise.resolve(GetCaller.GetShort(url, true));
			return orig;
		},
		
		
		
	//BOOKINGS
		/**
		 * Description
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
		 * @method Bookings_Post
		 * @param {} data
		 * @return orig
		 */
		Bookings_Post: function(data){
			var url = IP + "/bookings";
			var orig = Promise.resolve(PostCaller.Post(url, data, true));
			return orig;
		}
		
	};

});



application.factory('Helper', function (RESTFactory, $cookies) {

    return {

		/**
		 * Description
		 * @method Cookie_Set
		 * @param {} name
		 * @param {} value
		 * @return Literal
		 */
		Cookie_Set: function (name, value) {
			var text = name + "=" + value;
			document.cookie = text;
			return "";
		},
		/**
		 * Description
		 * @method Cookie_Get
		 * @param {} name
		 * @return CallExpression
		 */
		Cookie_Get: function (name) {
			return $cookies.get(name);
		},

		/**
		 * Description
		 * @method Get_Zeit
		 * @param {} value
		 * @return date
		 */
		Get_Zeit: function (value) {

			var now = new Date(value);

			var date = {};

			if (value === null) {
				date.state = false;
				return date;
			}

			date.state = true;

			date.date = now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
			date.time = now.getHours() + ":" + now.getMinutes();
			if (now.getMinutes() < 10) {
				date.time = now.getHours() + ":0" + now.getMinutes();
			}
			date.value = now.getTime();
			date.string = now;

			date.date_ele = {};
			date.date_ele.day = now.getDate();
			date.date_ele.month = now.getMonth() + 1;
			date.date_ele.year = now.getFullYear();

			date.time_ele = {};
			date.time_ele.minutes = now.getMinutes();
			date.time_ele.hours = now.getHours();

			return date;

		},

		/**
		 * Funktion um das aktuelle Datum und Uhrzeit von Server zu kriegen
		 * @method Get_Zeit_Server
		 * @param {} value
		 * @return date
		 */
		Get_Zeit_Server: function (value) {

			var date = {};
			
			if (value === null) {
				date.state = false;
				return date;
			}

			date.state = true;

			if (!(value[value.length - 1] === 'T' && value[value.length - 2] === 'M' && value[value.length - 3] === 'G')) {
				//ALTERNATVE
				if (value[value.length - 1] !== 'Z') {
					value += "Z";
				}
			}


			var now = new Date(value);
			
			date.state = true;
			date.date = now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
			date.time = now.getHours() + ":" + now.getMinutes();
			if (now.getMinutes() < 10) {
				date.time = now.getHours() + ":0" + now.getMinutes();
			}
			date.value = now.getTime();
			date.string = now;

			date.date_ele = {};
			date.date_ele.day = now.getDate();
			date.date_ele.month = now.getMonth() + 1;
			date.date_ele.year = now.getFullYear();

			date.time_ele = {};
			date.time_ele.minutes = now.getMinutes();
			date.time_ele.hours = now.getHours();

			return date;

		}
	
    };

});
