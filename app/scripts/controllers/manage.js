'use strict';

application.controller('Ctrl_Manage', function ($rootScope, $scope, RESTFactory) {
    
	var open_bookings = [];
    var done_bookings = [];
    
    //Make REST Call to /bookings/by-customer/{CustomerID} to get all Bookings
    
	//Check if the trip is in the neyt 30 Minutes, then get the Trip and get the CarID
	//Filter all the bookings if they are ended or not for every Booking, where the Planneddate is in the past, call /trips/{TripID}
	//Check if the tripend is set then call /invoices/{InvoiceId}/items
	
    /*
		
		Booking {
			"BookingId": 0,
			"CustomerId": 0,
			"TripId": 0,
			"InvoiceId": 0,
			"BookedPositionLatitude": 0,
			"BookedPositionLongitude": 0,
			"BookingDate": "2017-04-23T11:52:57.780Z",
			"PlannedDate": "2017-04-23T11:52:57.780Z"
		}
		
		Trip {
			"TripId": 0,
			"CarId": 0,
			"CustomerId": 0,
			"StartDate": "2017-04-25T18:52:46.839Z",
			"EndDate": "2017-04-25T18:52:46.839Z",
			"StartPositionLatitude": 0,
			"StartPositionLongitude": 0,
			"EndPositionLatitude": 0,
			"EndPositionLongitude": 0
		}
		
		//List
		InvoiceItem {
			"InvoiceItemId": 0,
			"InvoiceId": 0,
			"Reason": "string",
			"Type": "DEBIT",
			"Amount": 0
		}
		
      
    */
    
    var i = 0;

	
	function HandleResult_Booking(response){
		
		var d = new Date(return_obj.PlannedDate);
		var now = new Date();
		var dif = (d.getTime() - now.getTime()) / 1000 / 60;
		
		if(dif < 0){
			//Trip in past
			
		}else{
			//Trip in future
			Handle_OpenBooking(response, dif)
		}
		
	}
	
	function Handle_OpenBooking(response, dif){
		
		var booking = {};
		
		if(dif < 30){
			booking.state = true;
		}else{
			booking.state = false;
		}
		
		var d = new Date(return_obj.PlannedDate);
		
		var day = d.getDate();
		var month = d.getMonth() + 1;
		var year = d.getFullYear();
		
		if(month < 10){
			month = "0" + month;
		}
	
		var start_date = day + "." + month + "." + year;
		var start_time = d.getHours() + ":" + d.getMinutes();
	
		RESTFactory.GetAddress(return_obj.BookedPositionLatitude, return_obj.BookedPositionLongitude).then(function(response){
			
			console.log(response);
			
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
			
			var start = {
			
				date: start_date,
				time: start_time,
				address: address
			
			};
			
			var booking = {
				bookingId: i,
				start: start
			};
			
			if(dif)
			
			open_bookings.push(booking);
			
			$scope.open_bookings = open_bookings;
			
		});
		
	}
	
	
    for (i = 0; i < 3; i++) {
	
		//REST Call
		var return_obj = {
			BookingId: 0,
			CustomerId: 0,
			TripId: 0,
			InvoiceId: 0,
			BookedPositionLatitude: 50.127714,
			BookedPositionLongitude: 8.640663,
			BookingDate: "2017-04-26T11:52:57.780Z",
			PlannedDate: "2017-04-26T11:52:57.780Z"
		};
	
		HandleResult_Booking(return_obj);
	/*
		var d = new Date(return_obj.PlannedDate);
		
		var day = d.getDate();
		var month = d.getMonth() + 1;
		var year = d.getFullYear();
		
		if(month < 10){
			month = "0" + month;
		}
	
		var start_date = day + "." + month + "." + year;
		var start_time = d.getHours() + ":" + d.getMinutes();
	
		RESTFactory.GetAddress(return_obj.BookedPositionLatitude, return_obj.BookedPositionLongitude).then(function(response){
			
			console.log(response);
			
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
			
			
			var start = {
			
			date: start_date,
			time: start_time,
			address: address
			
			};
			
			var booking = {
			bookingId: i,
			start: start
			};
			console.log(booking);
			
			if (i % 2 !== 0){
			booking.payed = "Nicht bezahlt";
			}
			
			open_bookings.push(booking);
			
			$scope.open_bookings = open_bookings;
			
		});
	
	*/
	
	//	var start_place = GeoCode_Reverse.geocodeLatLng(return_obj.BookedPositionLatitude, return_obj.BookedPositionLongitude);
	
	//	console.log(start_place);
	
	
    }



    $scope.ShowBilling = function (index) {
	console.log(index + "   " + finishedBookings[index].billing);
	$scope.currentBooking = finishedBookings[index];
    };

});
