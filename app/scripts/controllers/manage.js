'use strict';

application.controller('Ctrl_Manage', function ($rootScope, $scope, RESTFactory, Helper, $location, $q) {
    
	var customerID = $rootScope.customerID;
    
	var bookings_done = {};
	var bookings_open = {};
	
    var i = 0;

	
	var init = function(){
		
		RESTFactory.Bookings_Get_CustomerID(customerID).then(function(response){
			
			var data = response.data;
			
			for(var j = 0; j < data.length; j++){
				HandleResult_Booking(data[j]);
			}
			
		}, function(response){
			
		});
		
	};
	
	init();
	
	var HandleResult_Booking = function(response){
		
		var d = new Date(response.plannedDate);
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
		
		booking.bookingID = response.bookingId;
		//booking.tripID = response.tripId;
		
		var str = 'o' + booking.bookingID;
		
		booking.onMap = false;
		
		if(dif < 30){
			booking.onMap = true;
		}
		
		
		var start = {
			startDate: response.plannedDate,
			date : Helper.Get_Date(response.plannedDate),
			time: Helper.Get_Time(response.plannedDate)
		};
		
		booking.start = start;
		
		bookings_open[str] = booking;
		
		
		$scope.open_bookings = bookings_open;
		$scope.$apply();
		
		
		var lat = response.bookedPositionLatitude;
		var lon = response.bookedPositionLongitude;
		
		Helper.Get_Address(lat, lon).then(function(address){
			
			bookings_open[str].start.address = address;
			
			$scope.open_bookings = bookings_open;
			$scope.$apply();
			
		});
		
	};
		
	var Handle_DoneBooking = function(response){
		
		var booking = {};
		
		booking.bookingID = response.bookingId;
		booking.tripID = response.tripId;
		booking.invoiceID = response.invoiceId;
		
		var str = 'd' + booking.bookingID;
		
		bookings_done[str] = booking;
		
		$scope.done_bookings = bookings_done;
		$scope.$apply();
		
		
		
		RESTFactory.Invoices_Get_InvoiceID(booking.invoiceID).then(function(response){
			
			var data = response.data;
			
			var invoice = {
				invoiceID: data.invoiceId,
				totalAmount: data.totalAmount,
				paid: data.paid
			};
			
			bookings_done[str].invoice = invoice;
			
			$scope.done_bookings = bookings_done;
			$scope.$apply();
			
		});
		
		RESTFactory.Trips_Get_TripID(booking.tripID).then(function(response){
			
			var data = response.data;
			
			var trip = {
				tripID: data.tripId,
				carID: data.carId,
				customerID: data.customerId,
				startDate: data.startDate,
				endDate: data.endDate,
				startChargingStationID: data.startChargingStationId,
				endChargingStationID: data.endChargingStationId,
				distance: data.distanceTravelled
			};
			
			var start = {
				startDate: trip.startDate,
				date : Helper.Get_Date(trip.startDate),
				time: Helper.Get_Time(trip.startDate)
			};
			
			var end = {
				endDate: trip.endDate,
				date : Helper.Get_Date(trip.endDate),
				time: Helper.Get_Time(trip.endDate)
			};
			
			bookings_done[str].trip = trip;
			bookings_done[str].start = start;
			bookings_done[str].end = end;
			
			
			$scope.done_bookings = bookings_done;
			$scope.$apply();
			
			
			RESTFactory.Charging_Stations_Get_Charging_StationID(trip.startChargingStationID).then(function(response){
				
				var data = response.data;
				
				var lat = data.latitude;
				var lon = data.longitude;
				
				Helper.Get_Address(lat, lon).then(function(response){
					
					var address = response;
					
					bookings_done[str].start.address = address;
					
					$scope.done_bookings = bookings_done;
					$scope.$apply();
					
				}, function(response){
					console.log("Cant get address for start station");
				});
				
			}, function(response){
					console.log("Cant get start station");
			});
			
			RESTFactory.Charging_Stations_Get_Charging_StationID(trip.endChargingStationID).then(function(response){
				
				var data = response.data;
				
				var lat = data.latitude;
				var lon = data.longitude;
				
				Helper.Get_Address(lat, lon).then(function(response){
					
					var address = response;
					
					bookings_done[str].end.address = address;
					
					$scope.done_bookings = bookings_done;
					$scope.$apply();
					
					
				}, function(response){
					console.log("Cant get address for end station");
				});
				
			}, function(response){
				console.log("Cant get end station");
			});
			
		});
		
	};
	
	
	
	var GetBilling = function(month, year){
		
		var bill = {};
		
		var relevant_bookings = [];
		
		var i;
		
		for(var key in bookings_done){
			
			if(bookings_done.hasOwnProperty(key)){
				
				var curDate = new Date(bookings_done[key].end.endDate);
				
				if(curDate.getMonth() === month && curDate.getFullYear() === year){
					relevant_bookings.push(bookings_done[key]);
				}
				
			}
			
		}
		
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
		
		console.log("GET SOMETHING FOR SOMETHING ELSE");
		
		bill.invoiceID = relevant_bookings[0].invoice.invoiceID;
		bill.totalAmount = relevant_bookings[0].invoice.totalAmount;
		bill.paid = relevant_bookings[0].invoice.paid;
		bill.paidText = "Bezahlt";
		if(bill.paid === false){ bill.paidText = "Nicht bezahlt";}
		bill.active = true;
		
		
		$scope.currentBill = bill;
		
		RESTFactory.Invoices_Get_Items(invoiceID).then(function(response){
			
			var items = response.data;
			var bill_items = [];
			
			for(var i = 0; i < items.length; i++){
				
				var item = {};
				item.invoiceID = items[i].invoiceId;
				item.invoiceItemID = items[i].invoiceItemId;
				item.reason = items[i].reason;
				item.type = "Rechnung"
				if(items[i].type === 1){ item.type = "Gutschrift";}
				item.amount = items[i].amount;
				item.hasBooking = false;
				/*
				var jk = 0;
				while(jk < relevant_bookings.length){
		
					if(relevant_bookings[jk].invoiceItemID === item.invoiceItemID){
						item.hasBooking = true;
						item.booking = relevant_bookings[jk];
						break;
					}
					jk++;
				}
				*/
				bill_items.push(item);
				
			}

			bill.items = bill_items;
			
			$scope.currentBill = bill;
			
			$scope.$apply();

		});
			
		
	};
	

	
	

    $scope.ShowBilling = function (input) {
		
		var date = new Date(input);
		
		var month = date.getMonth();
		var year = date.getFullYear();
		
		GetBilling(month, year);
		
    };
	
	
	$scope.ShowOnMap = function(booking){
		
		if(booking.onMap === false){
			return;
		}
		
		$location.path("/booking");
		
	};

});
