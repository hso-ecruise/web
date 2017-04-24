'use strict';

application.controller('Ctrl_Manage', function ($rootScope, $scope, RESTFactory) {
    var open_bookings = [];
    var done_bookings = [];
    
    //Make REST Call to /bookings/by-customer/{CustomerID}
    
    //Offene Buchungen
    /*
      
      {
      "BookingId": 0,
      "CustomerId": 0,
      "TripId": 0,
      "InvoiceId": 0,
      "BookedPositionLatitude": 0,
      "BookedPositionLongitude": 0,
      "BookingDate": "2017-04-23T11:52:57.780Z",
      "PlannedDate": "2017-04-23T11:52:57.780Z"
      }
      
    */
    
    var i = 0;

    for (i = 0; i < 3; i++) {
	
		//REST Call
		var return_obj = {
			BookingId: 0,
			CustomerId: 0,
			TripId: 0,
			InvoiceId: 0,
			BookedPositionLatitude: 50.127714,
			BookedPositionLongitude: 8.640663,
			BookingDate: "2017-04-23T11:52:57.780Z",
			PlannedDate: "2017-04-23T11:52:57.780Z"
		};
	
	
	
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
	
	
	
	//	var start_place = GeoCode_Reverse.geocodeLatLng(return_obj.BookedPositionLatitude, return_obj.BookedPositionLongitude);
	
	//	console.log(start_place);
	
	
    }



    $scope.ShowBilling = function (index) {
	console.log(index + "   " + finishedBookings[index].billing);
	$scope.currentBooking = finishedBookings[index];
    };

});
