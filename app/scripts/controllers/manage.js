'use strict';

application.controller('Ctrl_Manage', function ($rootScope, $scope, RESTFactory, Helper, $location) {
    
	var customerID = $rootScope.customerID;
	
	var open_bookings = [];
    var done_bookings = [];
    
	
    var i = 0;

	
	var HandleResult_Booking = function(response){
		
		var d = new Date(response.PlannedDate);
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
	
	var Handle_OpenBooking = function(response, dif){
		
		var booking = {};
		
		booking.bookingID = response.BookingId;
		booking.onMap = false;
		
		if(dif < 30){
			booking.onMap = true;
		}
		
		var lat = response.BookedPositionLatitude;
		var lon = response.BookedPositionLongitude;
		
		Helper.Get_Address(lat, lon).then(function(address){
			
			var start = {
				date : Helper.Get_Date(response.PlannedDate),
				time: Helper.Get_Time(response.PlannedDate),
				address: address
			};
			
			
			booking.start = start;
			
			open_bookings.push(booking);
			
			$scope.open_bookings = open_bookings;
			
			$scope.$apply();
			
		});
		
	};
	
	
	$scope.ShowOnMap = function(booking){
		
		if(booking.onMap === false){
			return;
		}
		
		$location.path("/booking");
		
	};
	
	
	var Handle_DoneBooking = function(response){
		
		var booking = {};
		
		booking.bookingID = response.BookingId;
		booking.tripID = response.TripId;
		booking.invoiceItemID = response.InvoiceItemId;
		
		//Get Trip from backend with response.tripId
		var prom_trip = RESTFactory.Trips_Get_TripID(booking.tripID);
		
		
		
		/*
		
			TODO MAKE A REQUEST TO BACKEND TO GET THE INVOICE
		
		*/
		
		var prom_invoice = RESTFactory.Invoices_Get_InvoiceID(booking.invoiceItemID);
		
		var invoice = {
			InvoiceId: 1,
			TotalAmount: 100,
			Paid: false
		};
		
		booking.invoice = invoice;
		
		prom_trip.then(function(trip_response){
			
			var trip = trip_response.data;
			
			var prom_start_station = RESTFactory.Charging_Stations_Get_Charging_StationID(trip.StartChargingStationId);
			var prom_end_station = RESTFactory.Charging_Stations_Get_Charging_StationID(trip.EndChargingStationId);
			
			prom_start_station.then(function(start_response){
				
				prom_end_station.then(function(end_response){
					
					var start_station = start_response.data;
					var end_station = end_response.data;
					
					var start_lat = start_station.Latitude;
					var start_lon = start_station.Longitude;
				
					var end_lat = end_station.Latitude;
					var end_lon = end_station.Longitude;
				
					var start_get = Helper.Get_Address(start_lat, start_lon);
					var end_get = Helper.Get_Address(end_lat, end_lon);
					
					start_get.then(function(start_addr){
						
						end_get.then(function(end_addr){
							
							var start = {
								date : Helper.Get_Date(trip.StartDate),
								time: Helper.Get_Time(trip.StartDate),
								address: start_addr
							};
							
							var end = {
								endDate: trip.EndDate,
								date: Helper.Get_Date(trip.EndDate),
								time: Helper.Get_Time(trip.EndDate),
								address: end_addr
							};
							
							booking.start = start;
							booking.end = end;
							
							//Invoice taken from Backend
							
							booking.invoice = {
								invoiceID: invoice.InvoiceId,
								totalAmount: invoice.TotalAmount,
								paid: invoice.Paid
							};
							
							done_bookings.push(booking);
							
							$scope.done_bookings = done_bookings;
							
							$scope.$apply();
							
						}, function(errorReponse){
							console.log("Cant get address for end-point");
						});
						
					}, function(errorReponse){
						console.log("Cant get address for start-point");
					});
					
				});
				
			});
			
		}, function(errorReponse){
			console.log("Cant get trip informations");
		});
		
		
		
		
		
	};
	
	
	
	var GetBilling = function(month, year){
		
		var bill = {};
		
		var relevant_bookings = [];
		
		var i;
		
		for(i = 0; i < done_bookings.length; i++){
			
			var curDate = new Date(done_bookings[i].end.endDate);
			
			if(curDate.getMonth() === month && curDate.getFullYear() === year){
				relevant_bookings.push(done_bookings[i]);
			}
			
		}
		
		//TODO GET INVOICE ID
		
		if(relevant_bookings.length === 0){
			bill.active = false;
			$scope.currentBill = bill;
			$scope.$apply();
			return;
		}
		var invoiceID = relevant_bookings[0].invoice.invoiceID;
		
		bill.date = {
			month: month,
			year: year
		};
		
		var prom_invoice = RESTFactory.Invoices_Get_InvoiceID(invoiceID);
		
		prom_invoice.then(function(response){
			
			var invoice = response.data;
			bill.invoiceID = invoice.InvoiceId;
			bill.totalAmount = invoice.TotalAmount;
			bill.paid = invoice.Paid;
			bill.paidText = "Bezahlt";
			if(bill.paid === false){ bill.paidText = "Nicht bezahlt";}
			bill.active = true;
			
			var prom_invoice_items = RESTFactory.Invoices_Get_Items(invoiceID);
			
			prom_invoice_items.then(function(response){
				
				var items = response.data;
				var bill_items = [];
				
				for(var i = 0; i < items.length; i++){
					
					var item = {};
					item.invoiceID = items[i].InvoiceId;
					item.invoiceItemID = items[i].InvoiceItemId;
					item.reason = items[i].Reason;
					item.type = items[i].Type;
					item.amount = items[i].Amount;
					item.hasBooking = false;
					
					var jk = 0;
					while(jk < relevant_bookings.length){
						
						if(relevant_bookings[jk].invoiceItemID === item.invoiceItemID){
							item.hasBooking = true;
							item.booking = relevant_bookings[jk];
							break;
						}
						jk++;
					}
				
					bill_items.push(item);
					
				}

				bill.items = bill_items;
				
				$scope.currentBill = bill;
				
				$scope.$apply();

			});
			
		}, function(response){
			
			console.log("Failed to get invoice");
			
			bill.active = false;

			$scope.currentBill = bill;
			
		});
		
	};
	
	//GetBilling(1,2017);
	
	
	var init = function(){
		
		var prom_bookings = RESTFactory.Bookings_Get_CustomerID(customerID);
		
		prom_bookings.then(function(response){
			
			var data = response.data;
			
			for(var j = 0; j < data.length; j++){
				HandleResult_Booking(data[j]);
			}
			
		}, function(response){
			
		});
		
	};
	
	init();
	/*
	//TEST FUNCTION
    for (i = 0; i < 6; i++) {
	
		//REST Call
		var return_obj = {
			BookingId: i,
			CustomerId: 0,
			TripId: 0,
			InvoiceId: i,
			BookedPositionLatitude: 50.127714,
			BookedPositionLongitude: 8.640663,
			BookingDate: "2018-04-26T11:52:57.780Z",
			PlannedDate: "2018-04-26T11:52:57.780Z"
		};
	
		if(i % 2 === 0){
			return_obj.PlannedDate = "2017-04-24T18:52:46.839Z";
		}
		
		HandleResult_Booking(return_obj);
		
    }
	*/

    $scope.ShowBilling = function (input) {
		
		var date = new Date(input);
		
		var month = date.getMonth();
		var year = date.getFullYear();
		
		GetBilling(month, year);
		
    };

});
