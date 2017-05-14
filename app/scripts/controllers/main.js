﻿'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */

const IP = 'localhost';
const PORT = '3000';
const CUSTOMER = "customers";
const API_KEY = "AIzaSyBCbY_MjWJ1cDjugF_MBHwnYDWFNJYAa4o&callback=initMap";

//REPLACE ALL _ by /



application.service('GetCaller', function ($http) {

	this.Get = function (url, body) {
		var get = $http({
			method: "get",
			url: url,
			data: body
		});
		return get;
	};
	this.Get = function(url){
		return $http.get(url);
	};

});

application.service('PostCaller', function ($http) {

	this.Post = function (url, body) {
		var post = $http({
			method: "post",
			url: url,
			data: body
		});
		return post;
	};

});

application.service('PatchCaller', function ($http) {

	this.Patch = function (url, body) {
		var post = $http({
			method: "patch",
			url: url,
			data: body
		});
		return post;
	};

});


application.factory('RESTFactory', function ($http, GetCaller, PostCaller, PatchCaller) {

	return {
		GetUser: function (id) {
			var url = 'http://' + IP + ':' + PORT + '/' + CUSTOMER + "?userID=" + id;
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		GetAddress: function(lat, lon){
			var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
			url += lat + "," + lon + "&key=" + API_KEY;
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Trips_Get: function(){
			var url = 'http://' + IP + ':' + PORT + "/trips";
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Trips_Get_TripID: function(id){
			var url = 'http://' + IP + ':' + PORT + "/trips_TripId/" + id;
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Trips_Get_CarID: function(id){
			var url = 'http://' + IP + ':' + PORT + "/trips/by-car?CarId=" + id;
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Trips_Post: function(data){
			var url = 'http://' + IP + ':' + PORT + "/trips";
			var orig = Promise.resolve(PostCaller.Get(url, data));
			return orig;
		},
		Trips_Patch: function(id, data){
			var url = 'http://' + IP + ':' + PORT + "/trips?TripId=" + id;
			var orig = Promise.resolve(PatchCaller.Patch(url, data));
			return orig;
		},
		Login_Get: function(email, data){
			var url = 'http://' + IP + ':' + PORT + "/public/login/" + email;
			var orig = Promise.resolve(GetCaller.Get(url, data));
			return orig;
		},
		Customers_Get: function(){
			var url = 'http://' + IP + ':' + PORT + "/customers";
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Customers_Post: function(data){
			var url = 'http://' + IP + ':' + PORT + "/customers";
			var orig = Promise.resolve(PostCaller.Get(url, data));
			return orig;
		},
		Customers_Get_CustomerID: function(id){
			var url = 'http://' + IP + ':' + PORT + "/customers/" + id;
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Customers_Patch_Password: function(id, pwd){
			var url = 'http://' + IP + ':' + PORT + "/customers/" + id + "/password";
			var orig = Promise.resolve(PatchCaller.Patch(url, pwd));
			return orig;
		},
		Customers_Patch_Email: function(id, email){
			var url = 'http://' + IP + ':' + PORT + "/customers/" + id + "/email";
			var orig = Promise.resolve(PatchCaller.Patch(url, email));
			return orig;
		},
		Customers_Patch_Address: function(id, address){
			var url = 'http://' + IP + ':' + PORT + "/customers/" + id + "/address";
			var orig = Promise.resolve(PatchCaller.Patch(url, address));
			return orig;
		},
		Cars_Get: function(){
			var url = 'http://' + IP + ':' + PORT + "/cars";
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Charging_Stations_Get: function(){
			var url = 'http://' + IP + ':' + PORT + "/charging-stations";
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Charging_Stations_Get_Charging_StationID: function(id){
			var url = 'http://' + IP + ':' + PORT + "/charging-stations/" + id;
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Car_Charging_Stations_Get_CarID: function(id){
			var url = 'http://' + IP + ':' + PORT + "/car-charging-stations_by-car/";// + id;			//TODO
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Invoices_Get: function(){
			var url = 'http://' + IP + ':' + PORT + "/invoices";
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Invoices_Post: function(data){
			var url = 'http://' + IP + ':' + PORT + "/invoices";
			var orig = Promise.resolve(PostCaller.Get(url, data));
			return orig;
		},
		Invoices_Get_InvoiceID: function(id){
			var url = 'http://' + IP + ':' + PORT + "/invoices/" + id;
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Invoices_Patch_Paid: function(id, data){
			var url = 'http://' + IP + ':' + PORT + "/invoices/" + id + "/paid";
			var orig = Promise.resolve(PatchCaller.Patch(url, data));
			return orig;
		},
		Invoices_Get_Items: function(id){
			var url = 'http://' + IP + ':' + PORT + "/invoices_" + id + "_items";
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		Invoices_Post: function(id, data){
			var url = 'http://' + IP + ':' + PORT + "/invoices/" + id + "/items";
			var orig = Promise.resolve(PostCaller.Post(url, data));
			return orig;
		},
		Invoices_Get_Items_ItemID: function(id, itemID){
			var url = 'http://' + IP + ':' + PORT + "/invoices/" + id + "/items/" + itemID;
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		},
		User_Login: function(email, password){
			var url = 'http://' + IP + ':' + PORT + "/public_login/" + email;
			var orig = Promise.resolve(PostCaller.Post(url, password));
			return orig;
		},
		User_Register: function(data){
			var url = 'http://' + IP + ':' + PORT + "/customers";
			var orig = Promise.resolve(PostCaller.Post(url, data));
			return orig;
		},
		Bookings_Post: function(data){
			var url = 'http://' + IP + ':' + PORT + "/bookings";
			var orig = Promise.resolve(PostCaller.Post(url, data));
			return orig;
		},
		Bookings_Get_CustomerID: function(id){
			var url = 'http://' + IP + ':' + PORT + "/bookings_by-customer/";// + id;			//TODO
			var orig = Promise.resolve(GetCaller.Get(url));
			return orig;
		}
		

	};

});



application.factory('Helper', function (RESTFactory, $cookies) {

	return {
		Get_Time: function (input){
			var d = new Date(input);
			var time = d.getHours() + ":" + d.getMinutes();
			return time;
		},
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
		Cookie_Set: function (name, value){
			var text = name + "=" + value;
			document.cookie = text;
			return "";
		},
		Cookie_Get: function (name){
			return $cookies.get(name);
		}
		
	};

});