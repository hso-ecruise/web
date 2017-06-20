'use strict';

application.controller('Ctrl_Manage', function ($rootScope, $scope, RESTFactory, Helper, $location) {

	$scope.testing = false;
	$scope.customerID = $rootScope.customerID;

	var bookings_done = {};
	var bookings_open = {};

	var INVOICE_TYPES = {
		1: {
			text: "Abbuchung",
			be: "DEBIT",
			id: 1
		},
		2: {
			text: "Gutschrift",
			be: "CREDIT",
			id: 2
		}
	};	

    /**
	 * Description
     * Init-Funktion die Rest-Schnittstelle initialsiert,
     * daten ausliest und sie speichert
	 * @method Init
	 * @return 
	 */
	function Init() {

		RESTFactory.Bookings_Get_CustomerID($scope.customerID).then(function (response) {

			var data = response.data;

			for (var j = 0; j < data.length; j++) {
				new HandleResult_Booking(data[j]);
			}

		});

	}

	new Init();

    /**
	 * Description
     * Funktion die Buchungen sortiert die entweder noch bevorstehen oder schon vorbeit sind
	 * @method HandleResult_Booking
	 * @param {} response
	 * @return 
	 */
	function HandleResult_Booking(response) {

		var d = Helper.Get_Zeit_Server(response.plannedDate);
		var now = Helper.Get_Zeit(new Date());

		var dif = (d.value - now.value) / 1000 / 60;

		if (dif < 0) {
			//Trip in past
			new Handle_DoneBooking(response);
		} else {
			//Trip in future
			new Handle_OpenBooking(response, dif);
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
	function Handle_OpenBooking(response, dif) {

		var booking = {};

		booking.bookingID = response.bookingId;

		var str = booking.bookingID;

		booking.onMap = false;

		if (dif < 30) {
			booking.onMap = true;
		}

		var start = Helper.Get_Zeit_Server(response.plannedDate);

		booking.start = start;

		bookings_open[str] = booking;

		$scope.open_bookings = bookings_open;
		if ($scope.testing === false) {
			$scope.$apply();
		}

		var lat = response.bookingPositionLatitude;
		var lon = response.bookingPositionLongitude;

		RESTFactory.Get_Address(lat, lon).then(function (address) {

			bookings_open[str].start.address = address;

			$scope.open_bookings = bookings_open;
			if ($scope.testing === false) {
				$scope.$apply();
			}

			return "success";

		}, function (response) {
			//console.log("failed");
			return "failed";

		}).then(function (data) {

		});

	}

    /**
	 * Description
	 * Funktion die Daten wie 
     * InvoiceItemID, TripID und Stationen
     * der Buchungen aus der Rest-Schnittstelle holt und diese ausgibt
     * @method Handle_DoneBooking
	 * @param {} response
	 * @return 
	 */
	function Handle_DoneBooking(response) {

		var booking = {};


		booking.bookingID = response.bookingId;
		booking.tripID = response.tripId;
		booking.invoiceItemID = response.invoiceItemId;
		
		var str = booking.bookingID;

		bookings_done[str] = booking;
		$scope.done_bookings = bookings_done;

		if ($scope.testing === false) {
			$scope.$apply();
		}

		if (booking.invoiceItemID === null) {
			new Get_Trip();
		} else {

			RESTFactory.Invoices_Get_Items_ItemID(booking.invoiceItemID).then(function (response) {

				var data = response.data;

				var invoice = {
					invoiceID: data.invoiceId,
					totalAmount: data.totalAmount,
					paid: data.paid
				};

				booking.invoice = invoice;
				bookings_done[str] = booking;
				$scope.done_bookings = bookings_done;

				if ($scope.testing === false) {
					$scope.$apply();
				}

				new Get_Trip();

			}, function (response) {
				new Get_Trip();
			});
			
		}	
		

		function Get_Trip() {
			
			if (booking.tripID !== null) {

				RESTFactory.Trips_Get_TripID(booking.tripID).then(function (response) {

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

					var start = Helper.Get_Zeit_Server(trip.startDate);
					var end = Helper.Get_Zeit_Server(trip.endDate);

					booking.trip = trip;
					booking.start = start;
					booking.end = end;

					bookings_done[str] = booking;
					$scope.done_bookings = bookings_done;

					if ($scope.testing === false) {
						$scope.$apply();
					}

					function Get_StartChargingStation() {

						RESTFactory.Charging_Stations_Get_Charging_StationID(trip.startChargingStationID).then(function (response) {

							var data = response.data;

							var lat = data.latitude;
							var lon = data.longitude;

							RESTFactory.Get_Address(lat, lon).then(function (response) {

								var address = response;

								booking.start.address = address;

								bookings_done[str] = booking;
								$scope.done_bookings = bookings_done;

								if ($scope.testing === false) {
									$scope.$apply();
								}

								new Get_EndChargingStation();

							}, function () {
								new Get_EndChargingStation();
							});

						}, function (response) {
							new Get_EndChargingStation();
						})


					}

					function Get_EndChargingStation() {
					
						RESTFactory.Charging_Stations_Get_Charging_StationID(trip.endChargingStationID).then(function (response) {

							var data = response.data;

							var lat = data.latitude;
							var lon = data.longitude;


							RESTFactory.Get_Address(lat, lon).then(function (response) {

								var address = response;

								booking.end.address = address;

								bookings_done[str] = booking;
								$scope.done_bookings = bookings_done;
								if ($scope.testing === false) {
									$scope.$apply();
								}
							
							}, function (response) {
							
							});

						}, function (response) {
						
						});
					
					}

					new Get_StartChargingStation();

				}, function (response) {
				
				});
			
			}

		}

	}



    /**
	 * Description
     * Funktion die InvoiceIDs der Buchung aus der Rest-Schnittstelle holt und diese ausgibt
	 * @method GetBilling
	 * @param {} month
	 * @param {} year
	 * @return 
	 */
	var GetBilling = function (month, year) {

		var bill = {};

		var relevant_bookings = [];

		if ($scope.testing === true) {
			bookings_done = $scope.done_bookings;
		}		

		for (var key in bookings_done) {

			if (bookings_done.hasOwnProperty(key)) {

				var curMonth = bookings_done[key].end.date_ele.month;
				var curYear = bookings_done[key].end.date_ele.year;

				if (curMonth === month && curYear === year) {
					relevant_bookings.push(bookings_done[key]);
				}

			}

		}

		if (relevant_bookings.length === 0) {
			bill.active = false;
			$scope.currentBill = bill;
			if ($scope.testing === false) {
				$scope.$apply();
			}
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
		if (bill.paid === false) { bill.paidText = "Nicht bezahlt"; }
		bill.active = true;


		$scope.currentBill = bill;

		RESTFactory.Invoices_Get_Items(invoiceID).then(function (response) {

			var items = response.data;
			var bill_items = [];

			for (var i = 0; i < items.length; i++) {

				var item = {};
				item.invoiceID = items[i].invoiceId;
				item.invoiceItemID = items[i].invoiceItemId;
				item.reason = items[i].reason;
				item.type = INVOICE_TYPES[items[0].type].text;
				item.amount = items[i].amount;
				item.hasBooking = false;

				var jk = 0;
				while (jk < relevant_bookings.length) {

					if (relevant_bookings[jk].invoiceItemID === item.invoiceItemID) {
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
			if ($scope.testing === false) {
				$scope.$apply();
			}

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

        /*
		var date = new Date(input);

		var month = date.getMonth();
		var year = date.getFullYear();
		*/
		new GetBilling(month, year);

	};


    /**
	 * Description
     * Funktion die Buchungen auf der Karte zeigt
	 * @method ShowOnMap
	 * @param {} booking
	 * @return 
	 */
	$scope.ShowOnMap = function (booking) {

		if (booking.onMap === false) {
			return;
		}

		$location.path("/booking");

	};


});
