$(document).ready(function() {
	var contents = [];	
	
	//Ten cong ty, lat, lgn, luong, stt
	var locations = [];

	// Tieu de nha ban, luong, lat, lgn, id
	var locations_home = ['My home', 10.846919, 106.764604, 1];
	
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var bounds = new google.maps.LatLngBounds();
	
	// Variables
	var map;
	var infowindow = new google.maps.InfoWindow();
	var marker, i;
	var markers = new Array();	
	
	$(document).on("click", ".btn-search", function() {
		var html_filter = $('.filterData').html();
		clearMarkers();
		deleteMarkers();
		showKeySearch(html_filter);		
	});
	
	function showKeySearch(html_filter) { 			
		if(html_filter != null && html_filter != "") {
			contents = [];	
			//hideMarkers(map, markers);
			// deleteMarkers();
			// clearMarkers();
			//Ten cong ty, lat, lgn, luong, stt
			locations = [];				
			
			// Variables
			infowindow = new google.maps.InfoWindow();			
			markers = new Array();	
			
			var data = jQuery.parseJSON(html_filter);
            var json_length = data.length;
            for(i=0; i<json_length; i++) {
           	 	json_data = data[i];
           	 	str_ctn = '<div class="s-infobox s-pad-r-400"><div class="s-d-logo"><img src="' + json_data.imageUrl + '" class="s-logo" /></div> <div><label class="s-lft-5">Salary: ' + json_data.salary + '</label><br /><b>' + json_data.company + '</b><br /><b>' + json_data.name + '</b><br />Address: ' + json_data.address + '<br />Distance: 20km<br /><a ng-click="openCompany(' + json_data.id + ')">View Details</a></div></div>';
           	 	contents.push(str_ctn);
           	 	
           	 	childs_locations = [json_data.company, json_data.lat, json_data.lgn, str_ctn,  json_data.id];
           	 	locations.push(childs_locations);           	 	
            }
            reloadMarker(map);
            // initialize();
		} else {
			$.ajax({
		        url: "data/task.json",         
		        dataType: "text",
		        success: function(data) { 
		        	var data = jQuery.parseJSON(data);
		            var json_length = data.length; 
		            for(i=0; i<json_length; i++) {
		           	 	json_data = data[i];
		           	 	str_ctn = '<div class="s-infobox"><div class="s-d-logo"><img src="' + json_data.imageUrl + '" class="s-logo" /></div> <div><label class="s-lft-5">Salary: ' + json_data.salary + '</label><br /><b>' + json_data.company + '</b><br /><b>' + json_data.name + '</b><br />Address: ' + json_data.address + '<br />Distance: 20km<br /><a ng-click="openCompany(' + json_data.id + ')">View Details</a></div></div>';
		           	 	contents.push(str_ctn);
		           	 	
		           	 	childs_locations = [json_data.company, json_data.lat, json_data.lgn, str_ctn,  json_data.id];
		           	 	locations.push(childs_locations);           	 	
		            }
		            google.maps.event.addDomListener(window, "load", initialize);
		        }
		   });			
		}		
	}
	showKeySearch("");

	function AutoCenter(map) {
	  //  Create a new viewpoint bound
	  var bounds = new google.maps.LatLngBounds();
	  //  Go through each...
	  $.each(markers, function (index, marker) {
		  bounds.extend(marker.position);
	  });
	  //  Fit these bounds to the map
	  map.fitBounds(bounds);
	}

	// draw direction
	function calcRoute(lat, lng, map) {
		var start = new google.maps.LatLng(locations_home[1], locations_home[2]);
		var end = new google.maps.LatLng(lat, lng);
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(start);
		bounds.extend(end);
		map.fitBounds(bounds);
		var request = {
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function (response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				directionsDisplay.setMap(map);
			} else {
				alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
			}
		});
	} 
	
	// remove marker
	function hideMarkers(map, markers) {
        /* Remove All Markers */
        while(markers.length){
            markers.pop().setMap(null);
        }
        console.log("Remove All Markers");
    }	
	
	function initialize() {
	    var latlng = new google.maps.LatLng(locations_home[1], locations_home[2]);
	    var myOptions = {
	        zoom: 10,
	        center: latlng,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    map = new google.maps.Map(document.getElementById("map"),
	            myOptions);
	    google.maps.event.addDomListener(window, "load", initialize);	   
		
	    directionsDisplay = new google.maps.DirectionsRenderer();          
	    directionsDisplay.setMap(map);
	    directionsDisplay.setOptions( { suppressMarkers: true } );

	    ///////////////////// add marker home in center ///////////////////
	    marker_home = new google.maps.Marker({
	    	position: new google.maps.LatLng(locations_home[1], locations_home[2]),
	    	map: map,
	    	icon: 'assets/img/home.png'
	    });
	    google.maps.event.addListener(marker_home, 'click', (function() {
	    	return function() {
	    	  infowindow.setContent(locations_home[0]);
	    	  infowindow.open(map, marker_home);
	    	}
	    })(marker_home, i));
	    markers.push(marker_home);

	    /////////////////////////////////////////////////////////////////
	    for (i = 0; i < locations.length; i++) {  
	      marker = new google.maps.Marker({
	    	position: new google.maps.LatLng(locations[i][1], locations[i][2]),
	    	map: map,
	    	icon: 'assets/img/company-marker.png'
	      });
	      markers.push(marker);
	      
	      // show all infowindow
	      /*
	      var infowindow = new google.maps.InfoWindow({
	    	content: locations[i][0],
	    	maxWidth: 160
	      });
	      infowindow.open(map, marker);
	      */
	      
	      // show infowindow when click
	      google.maps.event.addListener(marker, 'click', (function(marker, i) {
	    	return function() { 
	    	  // show salary or name    
	    	  infowindow.setContent(locations[i][3]);
	    	  infowindow.open(map, marker);
	    	  calcRoute(locations[i][1], locations[i][2], map);
			  moveToLocation(marker, map);
	    	}
	      })(marker, i));
	    }
	    if(markers.length > 0)
	    	AutoCenter(map);
	    // resize responsive
	    /*google.maps.event.addDomListener(window, "resize", function() {
	    	AutoCenter(map);
	    });*/	 
	}
	function reloadMarker(map) { 
		///////////////////// add marker home in center ///////////////////
		if(directionsDisplay != null) {
		    directionsDisplay.setMap(null);
		    directionsDisplay = null;
		}
		
		directionsDisplay = new google.maps.DirectionsRenderer();          
	    directionsDisplay.setMap(map);
	    directionsDisplay.setOptions( { suppressMarkers: true } );
	    
	    marker_home = new google.maps.Marker({
	    	position: new google.maps.LatLng(locations_home[1], locations_home[2]),
	    	map: map,
	    	icon: 'assets/img/home.png'
	    });
	    google.maps.event.addListener(marker_home, 'click', (function() {
	    	return function() {
	    	  infowindow.setContent(locations_home[0]);
	    	  infowindow.open(map, marker_home);
	    	}
	    })(marker_home, i));
	    /////////////////////////////////////////////////////////////////
	    
		for (i = 0; i < locations.length; i++) {  
		  var latlgn =  new google.maps.LatLng(locations[i][1], locations[i][2]);
		  marker = new google.maps.Marker({
	    	position: latlgn,
	    	map: map,
	    	icon: 'assets/img/company-marker.png'
	      });
	      markers.push(marker);
	      
	      showIdMarker(marker, locations[i]);	      
	      google.maps.event.addListener(marker, 'click', (function(marker, i) {
	    	return function() { 		    	  
			  // show detail company
	    	  infowindow.setContent(locations[i][3]);
	    	  infowindow.open(map, marker);
	    	  
	    	  calcRoute(locations[i][1], locations[i][2], map);
			  moveToLocation(marker, map);
	    	}
	      })(marker, i));
	      showIdMarker(marker, locations[i]);
	    }		

	    if(markers.length > 0)
	    	AutoCenter(map);
    }
	
	// show id tren home va marker
	function showIdMarker(marker, locations) { 	
		var latlgn =  new google.maps.LatLng(locations[1], locations[2]);
		var ifw = new google.maps.InfoWindow();
		ifw = new google.maps.InfoWindow({
			 content: (locations[4]).toString(),
			 closeBoxURL: "",
			 maxWidth: 160
		 });
		ifw.open(map, marker);
    } 
	
	/* update */
	function moveToLocation(marker, map) { 	
		map.setZoom(6);
		map.setCenter(marker.getPosition());		
	} 	
	function setMapMarker(markerSingle, map) { 	 
		markerSingle.setMap(map);
	}
	function setMapMarker(markerSingle, map) { 	 
		markerSingle.setMap(map);
	}
	function setMapOnAll(map) {
	  console.log(markers);
	  for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	  }
	}
	function clearMarkers() {
	  setMapOnAll(null);
	}
	function deleteMarkers() {
	  clearMarkers();
	  markers = [];
	}
	function addMarker(location) {
	  var marker = new google.maps.Marker({
		position: location,
		map: map
	  });
	  markers.push(marker);
	}
	function addMarker(location) {
	  var marker = new google.maps.Marker({
		position: location,
		map: map
	  });
	  markers.push(marker);
	}
	
	/* update */
	$("#final_span").keypress(function(e) {
	    if(e.which == 13) {
	    	$(".btn-search").trigger("click");	    
	    }
	});
	
	/* CV */
	$(document).on("click", ".btn-next-1", function() { 
		$(".q1").hide();			
		if($("#1a").is(':checked') && $("#1b").is(':checked') && $("#1c").is(':checked')) {
			return false;
		}
		/*var length_th = $('[name="s_chk[]"]:checked').length + 1;
		console.log(length_th);
		if(length <= 3) {
			var classes = ".btn-next-" + length_th;
			$(classes).html("Finish");
			$(classes).addClass("btn-finish");
			$(classes).removeClass(classes);
		}	*/	
		if($('.q1').hasClass("active")) {
			$('.q1').removeClass("active");
			$('.q2').addClass("active");
		}
		if($("#1a").is(':checked')) {
			$(".q2").removeClass("hide");
		}
		if($("#1b").is(':checked')) {
			$(".q3").removeClass("hide");
		}
		if($("#1c").is(':checked')) {
			$(".q4").removeClass("hide");
		}
	});
	$(document).on("click", ".btn-next-2", function() { 		
		if($('.q2').hasClass("active")) {
			$('.q2').removeClass("active");
			$('.q3').addClass("active");
		}		
	});
	$(document).on("click", ".btn-next-3", function() { 		
		if($('.q3').hasClass("active")) {
			$('.q3').removeClass("active");
			$('.q4').addClass("active");
		}		
	});
	$(document).on("click", ".btn-finish", function() { 		
		$(".modal").trigger("click");
	});	
});
