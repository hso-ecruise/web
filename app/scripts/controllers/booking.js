'use strict';

application.controller('Ctrl_Booking', function ($rootScope, $scope, NgMap) {    
    
	var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: new google.maps.LatLng(49.5, 8.434),
		mapTypeId: 'roadmap'
    });
    
    var icons = {
		car_available: {
			icon: "images/icons/car_available.png"
		},
		car_loading_00:{
			icon: "images/icons/car_loading_00.png"
		},
		car_loading_25:{
			icon: "images/icons/car_loading_25.png"
		},
		car_loading_50:{
			icon: "images/icons/car_loading_50.png"
		},
		car_loading_75:{
			icon: "images/icons/car_loading_75.png"
		},
		car_occupied:{
			icon: "images/icons/car_occupied.png"
		},
		car_reserved:{
			icon: "images/icons/car_reserved.png"
		},
		car_standing_admin:{
			icon: "images/icons/car_standing_admin.png"
		},
		car_standing_user:{
			icon: "images/icons/car_standing_user.png"
		},
		station_available:{
			icon: "images/icons/station_available.png"
		},
		station_occupied:{
			icon: "images/icons/station_occupied.png"
		}
    };
    
    var image = {
		url: 'images/icons/car_available.png',
		scaledSize: new google.maps.Size(60, 96),
		origin: new google.maps.Point(0, 0),
    	anchor: new google.maps.Point(0, 32)
    };
    
    var CreateMarker = function(lat, lon, state){
		
		image.url = icons[state].icon;
	
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lon),
			map: map,
			icon: image
		});
		
    };
    
    new CreateMarker(49.5, 8.434, "car_loading_25");
    new CreateMarker(49.501, 8.434, "car_available");

});
