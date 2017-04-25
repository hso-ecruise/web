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
		
		Invoice {
			"InvoiceId": 0,
			"TotalAmount": 0,
			"Paid": true
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
			Handle_DoneBooking(response);
		}else{
			//Trip in future
			Handle_OpenBooking(response, dif);
		}
		
	}
	
	function Handle_OpenBooking(response, dif){
		
		var booking = {};
		
		if(dif < 30){
			booking.state = true;
		}else{
			booking.state = false;
		}
		
		var lat = return_obj.BookedPositionLatitude;
		var lon = return_obj.BookedPositionLongitude;
	
		Get_Address(lat, lon).then(function(address){
			
			var start = {
				date : Get_Date(return_obj.PlannedDate),
				time: Get_Time(return_obj.PlannedDate),
				address: address
			};
			
			var booking = {
				bookingId: response.BookingId,
				start: start
			};
			
			open_bookings.push(booking);
			
			$scope.open_bookings = open_bookings;
			
		});
	}
	
	function Handle_DoneBooking(response){
		
		var bookingID = response.BookingId;
		var tripID = response.TripId;
		var invoiceID = response.InvoiceId;
		
		
		var booking = {};
		
		//Get Trip from backend with response.tripId
		
		//Done with Promise, extra then part
		var trip = {
			TripId: 0,
			CarId: 0,
			CustomerId: 0,
			StartDate: "2017-04-25T18:52:46.839Z",
			EndDate: "2017-04-25T20:52:46.839Z",
			StartPositionLatitude: 50.127714,
			StartPositionLongitude: 8.640663,
			EndPositionLatitude: 50.127714,
			EndPositionLongitude: 8.640663
		};
		
		var invoice = {
			InvoiceId: 0,
			TotalAmount: 0,
			Paid: true
		};
		
		var start_lat = trip.StartPositionLatitude;
		var start_lon = trip.StartPositionLongitude;
	
		var end_lat = trip.EndPositionLatitude;
		var end_lon = trip.EndPositionLongitude;
	
		var start_get = Get_Address(start_lat, start_lon);
		var end_get = Get_Address(end_lat, end_lon);
		
		start_get.then(function(start_addr){
			end_get.then(function(end_addr){
				
				var start = {
					date : Get_Date(trip.StartDate),
					time: Get_Time(trip.StartDate),
					address: start_addr
				};
				
				var end = {
					date : Get_Date(trip.EndDate),
					time: Get_Time(trip.EndDate),
					address: end_addr
				};
				
				var booking = {
					bookingId: bookingID,
					start: start,
					end: end,
					paid: invoice.Paid
				};
				
				console.log(booking);
				
				done_bookings.push(booking);
				
				$scope.done_bookings = done_bookings;
				
			});
		});
		
	}
	
	
	//TEST FUNCTION
    for (i = 0; i < 6; i++) {
	
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
	
		if(i % 2 === 0){
			return_obj.PlannedDate = "2017-04-24T18:52:46.839Z";
		}
		
		HandleResult_Booking(return_obj);
		
    }
	
	function Get_Date(input){
		
		var d = new Date(input);
		
		var day = d.getDate();
		var month = d.getMonth() + 1;
		var year = d.getFullYear();
		
		if(month < 10){
			month = "0" + month;
		}
	
		var date = day + "." + month + "." + year;
		
		return date;
		
	}
	
	function Get_Time(input){
		
		var d = new Date(input);
		
		var time = d.getHours() + ":" + d.getMinutes();
		
		return time;
		
	}
	
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



    $scope.ShowBilling = function (index) {
		console.log(index + "   " + done_bookings[index].billing);
		$scope.currentBooking = done_bookings[index];
    };

});
