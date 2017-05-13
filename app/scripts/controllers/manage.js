'use strict';

application.controller('Ctrl_Manage', function ($rootScope, $scope, RESTFactory, Helper) {
    
	var customerID = $rootScope.customerID;
	
	var open_bookings = [];
    var done_bookings = [];
    
	
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
		
		booking.bookingID = response.BookingId;
		booking.onMap = false;
		
		if(dif < 30){
			booking.onMap = true;
		}
		
		var lat = return_obj.BookedPositionLatitude;
		var lon = return_obj.BookedPositionLongitude;
	
		Helper.Get_Address(lat, lon).then(function(address){
			
			var start = {
				date : Helper.Get_Date(return_obj.PlannedDate),
				time: Helper.Get_Time(return_obj.PlannedDate),
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
		
		var booking = {};
		
		booking.bookingID = response.BookingId;
		booking.tripID = response.TripId;
		booking.invoiceItemID = response.InvoiceItemId;
		
		//Get Trip from backend with response.tripId
		var trip = RESTFactory.Trips_Get_TripID(booking.tripID);
		
//		var invoice_item = RESTFactory.Invoice_Get();
		
		
		var invoice = {
			InvoiceId: 10,
			TotalAmount: 100,
			Paid: true
		};
		
		trip.then(function(trip_response){
			
			var trip_response = {
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
			
			var start_lat = trip.StartPositionLatitude;
			var start_lon = trip.StartPositionLongitude;
		
			var end_lat = trip.EndPositionLatitude;
			var end_lon = trip.EndPositionLongitude;
		
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
						date : Helper.Get_Date(trip.EndDate),
						time: Helper.Get_Time(trip.EndDate),
						address: end_addr
					};
					
					var booking = {
						bookingID: bookingID,
						start: start,
						end: end
					};
					
					//Invoice taken from Backend
					
					booking.invoice = {
						invoiceID: invoice.InvoiceId,
						totalAmount: invoice.TotalAmount,
						paid: invoice.Paid
					}
					
					done_bookings.push(booking);
					
					$scope.done_bookings = done_bookings;
					
				}, function(errorReponse){
					console.log("Cant get address for end-point");
				});
				
			}, function(errorReponse){
				console.log("Cant get address for start-point");
			});
			
		}, function(errorReponse){
			console.log("Cant get trip informations");
		});
		
		
		
		
		
	}
	
	
	
	function GetBilling(month, year){
		
		var bill = {};
		
		var relevant_bookings = [];
		
		var i;
		
		for(i = 0; i < done_bookings.length; i++){
			
			if(done_bookings[i].end.date.month === month && done_bookings[i].end.date.year === year){
				relevant_bookings.push(done_bookings[i]);
			}
			
		}
		
		var invoiceID = 123;
		
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
				
					var j = 0;
					while(j < relevant_bookings.length){
						if(relevant_bookings[j].invoice.inveoiceItemID === item.invoiceItemID){
							item.hasBooking = true;
							item.booking = relevant_bookings[j];
							break;
						}
						j++;
					}
				
					bill_items.push(item);
					
				}

				$scope.currentBill = bill;

			});
			
		}, function(response){
			
			console.log("Failed to get invoice");
			console.log(response);
			
			bill.active = false;

//REMOVE START
			bill.invoiceID = 10;
			bill.totalAmount = 200;
			bill.paid = true;
			bill.paidText = "Bezahlt";
			if(bill.paid === false){ bill.paidText = "Nicht bezahlt";}
			bill.active = true;
			
			var items = [
				{
					InvoiceItemId: 0,
					InvoiceId: 0,
					Reason: "string",
					Type: "DEBIT",
					Amount: 2200
				},
				{
					InvoiceItemId: 1,
					InvoiceId: 0,
					Reason: "Auto kaputt",
					Type: "DEBIT",
					Amount: 0
				}
			
			]
			
			var bill_items = [];
				
			for(var i = 0; i < items.length; i++){
				
				var item = {};
				item.invoiceID = items[i].InvoiceId;
				item.invoiceItemID = items[i].InvoiceItemId;
				item.reason = items[i].Reason;
				item.type = items[i].Type;
				item.amount = items[i].Amount;
				item.hasBooking = false;
				
				if(i === 0){
					item.hasBooking = true;
					item.booking = open_bookings[0];
				}
				
				bill_items.push(item);
				
			}
			
			bill.items = bill_items;
			
//REMOVE END
			$scope.currentBill = bill;
			
		});
		
	}
	
	GetBilling(1,2017);
	
	
	
	var init = function(){
		
		var prom_bookings = RESTFactory.Bookings_Get_CustomerID(customerID);
		
		prom_bookings.then(function(response){
			
			var data = response.data;
			
			for(var j = 0; j < data.length; j++){
				HandleResult_Booking(data[j]);
			}
			
		}, function(response){
			
			console.log("Failed to get results");
			
		});
		
	};
	
	init();
	
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
	

    $scope.ShowBilling = function (month) {
		
		GetBilling(month);
		
    };

});
