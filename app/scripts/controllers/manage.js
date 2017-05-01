'use strict';

application.controller('Ctrl_Manage', function ($rootScope, $scope, RESTFactory, Helper) {
    
	var open_bookings = [];
    var done_bookings = [];
    
    //Make REST Call to /bookings/by-customer/{CustomerID} to get all Bookings
    
	//Check if the trip is in the neyt 30 Minutes, then get the Trip and get the CarID
	//Filter all the bookings if they are ended or not for every Booking, where the Planneddate is in the past, call /trips/{TripID}
	//Check if the tripend is set then call /invoices/{InvoiceId}/items
	
    /*
		
		//FROM BACKEND
		
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
		
		
		//FOR HTML
		booking {
			bookingID,
			start,
			onMap,		//if start is in future less then 30Min
			end,		//if start was in past
			invoice,	//if start was in past
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
	
	
	
	function GetBilling(month){
		
		var bill = {};
		
		var relevant_bookings = [];
		
		var i;
		
		for(i = 0; i < done_bookings.length; i++){
			
			if(done_bookings[i].end.date.month === month){
				relevant_bookings.push(done_bookings[i]);
			}
			
		}
		
		//Get Invoice Items
		//REST CALL
		var invoice = {
			InvoiceId: 0,
			TotalAmount: 200,
			Paid: true
		};
		
		//Following in then part
		
		bill.invoiceID = invoice.InvoiceId;
		bill.totalAmount = invoice.TotalAmount;
		bill.paid = invoice.Paid;
		
		//REST CALL
		var items = [
			{
				InvoiceItemId: 0,
				InvoiceId: 0,
				Reason: "string",
				Type: "DEBIT",
				Amount: 0
			}
		];
		
		var bill_items = [];
		
		for(i = 0; i < items.length; i++){
			
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
		
		currentBill.items = bill_items;
		
		$scope.currentBill = bill;
		
	}
	
	
	
	
	
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
		
		/*
		var i = 0;
		while(i < done_bookings.Length){
			
			if(done_bookings[i].bookingID === id){
				break;
			}
			
			i++;
		}
		
		//Get all elements from List
		
		var items = [
		  {
			InvoiceItemId: 0,
			InvoiceId: 0,
			Reason: "Auto kaputt",
			Type: "DEBIT",
			Amount: 100
		  }, {
			InvoiceItemId: 0,
			InvoiceId: 0,
			Reason: "Gutschrift",
			Type: "DEBIT",
			Amount: -10
		  }
		];
		
		var currentBill = {
			
			start: done_bookings[i].start,
			end: done_bookings[i].end,
			invoice: done_bookings[i].invoice,
			items: items
			
		};
		
		console.log(currentBill);
		$scope.currentBill = currentBill;
		*/
    };

});
