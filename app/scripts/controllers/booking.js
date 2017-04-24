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
	car_loading_25:{
	    icon: "images/icons/car_loading_25.png"
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
	
    }
    
    CreateMarker(49.5, 8.434, "car_loading_25");
    CreateMarker(49.501, 8.434, "car_available");
});
