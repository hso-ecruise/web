'use strict';

application.controller('Ctrl_Manage', function ($rootScope, $scope, RESTFactory, Helper, $location, $q) {

    var customerID = $rootScope.customerID;

    var bookings_done = {};
    var bookings_open = {};

    var i = 0;


    /**
	 * Description
     * Init-Funktion die Rest-Schnittstelle initialsiert,
     * daten ausliest und sie speichert
	 * @method init
	 * @return 
	 */
    var init = function(){

        RESTFactory.Bookings_Get_CustomerID(customerID).then(function(response){

            var data = response.data;

            console.log(data);

            for(var j = 0; j < data.length; j++){
                HandleResult_Booking(data[j]);
            }

        }, function(response){

        });

    };

    init();

    /**
	 * Description
     * Funktion die Buchungen sortiert die entweder noch bevorstehen oder schon vorbeit sind
	 * @method HandleResult_Booking
	 * @param {} response
	 * @return 
	 */
    var HandleResult_Booking = function(response){

        var d = new Date(response.plannedDate);
        d.setMonth(d.getMonth() + 1);
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

    /**
	 * Description
     * Funktion die Daten für die Anzeige vorbereitet 
	 * @method Handle_OpenBooking
	 * @param {} response
	 * @param {} dif
	 * @return 
	 */
    var Handle_OpenBooking = function(response, dif){

        var booking = {};

        booking.bookingID = response.bookingId;
        //booking.tripID = response.tripId;

        var str = 'o' + booking.bookingID;

        booking.onMap = false;

        if(dif < 30){
            booking.onMap = true;
        }

        var start = Helper.Get_Zeit(response.plannedDate);
        /*
		var start = {
			startDate: response.plannedDate,
			date : Helper.Get_Date(response.plannedDate),
			time: Helper.Get_Time(response.plannedDate)
		};
		*/
        booking.start = start;

        bookings_open[str] = booking;

        $scope.open_bookings = bookings_open;
        $scope.$apply();

        var lat = response.bookingPositionLatitude;
        var lon = response.bookingPositionLongitude;

        Helper.Get_Address(lat, lon).then(function(address){

            bookings_open[str].start.address = address;

            $scope.open_bookings = bookings_open;
            $scope.$apply();

        });

    };

    /**
	 * Description
	 * Funktion die Daten wie 
     * InvoiceItemID, TripID und Stationen
     * der Buchungen aus der Rest-Schnittstelle holt und diese ausgibt
     * @method Handle_DoneBooking
	 * @param {} response
	 * @return 
	 */
    var Handle_DoneBooking = function(response){

        var booking = {};

        booking.bookingID = response.bookingId;
        booking.tripID = response.tripId;
        booking.invoiceItemID = response.invoiceItemId;

        var str = 'd' + booking.bookingID;

        bookings_done[str] = booking;

        $scope.done_bookings = bookings_done;
        $scope.$apply();

        RESTFactory.Invoices_Get_Items_ItemID(booking.invoiceItemID).then(function(response){

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

            var start = Helper.Get_Zeit(trip.startDate);
            var end = Helper.Get_Zeit(trip.endDate);
            /*
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
			*/
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



    /**
	 * Description
     * Funktion die InvoiceIDs der Buchung aus der Rest-Schnittstelle holt und diese ausgibt
	 * @method GetBilling
	 * @param {} month
	 * @param {} year
	 * @return 
	 */
    var GetBilling = function(month, year){

        var bill = {};

        var relevant_bookings = [];

        var i;

        for(var key in bookings_done){

            if(bookings_done.hasOwnProperty(key)){

                var curMonth = bookings_done[key].end.date_ele.month;
                var curYear = bookings_done[key].end.date_ele.year;

                if(curMonth === month && curYear === year){
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


    };





    /**
     * Description
     * Funktion die Rechnung zusammenstellt
     * @method ShowBilling
     * @param {} month
     * @param {} year
     * @return 
     */
    $scope.ShowBilling = function (month, year) {
        console.log(month + "  " + year);

        /*
		var date = new Date(input);

		var month = date.getMonth();
		var year = date.getFullYear();
		*/
        GetBilling(month, year);

    };


    /**
	 * Description
     * Funktion die Buchungen auf der Karte zeigt
	 * @method ShowOnMap
	 * @param {} booking
	 * @return 
	 */
    $scope.ShowOnMap = function(booking){

        if(booking.onMap === false){
            return;
        }

        $location.path("/booking");

    };

});
