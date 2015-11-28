
// initialize the map on the "map" div with a given center and zoom
var map = L.map('map');
L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
	noWrap: true,
	maxZoom: 11,
	minZoom: 3,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);
map.fitWorld().setZoom(2)
new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.OpenStreetMap(),
    showMarker: false,
    searchLabel: "Where you coming from to Front-Trends?",
    zoomLevel: 11,
    enableAutocomplete: true
}).addTo(map);
map.on('resize', function(e) {
    //map.fitWorld({reset: true}).zoomIn();
});


map.setZoomAround([50.503, 30.57], 3);

var currentZoom = map.getZoom();
map.on('zoomstart', function(ev) {
	console.log(ev);
	map._container.classList.remove("zoom-"+currentZoom);
	map._container.classList.add("zoom-"+map._zoom);
	currentZoom = map._zoom;
});
var geoCodes = [[50.503, 30.57], [50.501, 30.57], [50.505, 30.57]];

geoCodes.forEach(function(code) {
	/*var myIcon = L.divIcon({className: 'my-div-icon', html: '<p><img src="https://pbs.twimg.com/profile_images/3584720897/2a30d1779d3b37d5c5da3e8d0f148ca3_bigger.png" width="30"><span class="why">jade po wiedze</span></p>'})

	var marker = L.marker(code, {icon: myIcon, riseOnHover: true});

	marker.addTo(map);
	console.log(marker);
	marker.on("mouseover", function(ev) {

		marker._icon.firstChild.firstChild.style.width = "100px";
	}).on("mouseout", function(ev) {
		marker._icon.firstChild.firstChild.style.width = "30px";
		marker._icon.firstChild.classList.remove("active");
	});

	var icon = marker._icon;
	console.log(icon);
	icon.firstChild.firstChild.addEventListener("webkitTransitionEnd", function(event) {
		if (icon.firstChild.firstChild.style.width === "30px") {
			icon.firstChild.classList.remove("active");
		} else {
			icon.firstChild.classList.add("active")
		}
	}, false)*/
});

var createMyIcon = function() {
	var html = 	'<div class="user-map-icon">' +
		'<div class="picture">' +
			'<img src="'+USER.picture +'" width="30">' +
		'</div>' +
		'<div class="content leaflet-control-container">' +
			'<form>' +
				'<textarea placeholder="I\'m coming to Front-Trends 2014 because..." class="reason" rows="10" cols="20"></textarea>' +
				'<button class="add-to-map">add me</button>' +
			'</form>' +
		'</div>' +
	'</div>';
	var myIcon = L.divIcon({className: 'myself', html: html})

	var marker = L.marker(map.getCenter(), {icon: myIcon, riseOnHover: true, draggable: true});
	marker.addTo(map);

	var rootEl = marker._icon;
	var addBtn = rootEl.querySelector('.add-to-map');
	var reason = rootEl.querySelector('.reason');
	reason.addEventListener("mousedown", function(ev) {
		ev.stopPropagation();
	}, false);
	addBtn.addEventListener("click", function(ev) {
		ev.preventDefault();
		var coord = marker.toGeoJSON().geometry.coordinates;
		var data = {
			latitude: coord[0],
			longitude: coord[1],
			reason: reason.value
		};
		console.log(data);
		jQuery.post("add.php", data, function() {
			map.removeLayer(marker);
		}, "json").fail(function() {
			console.log("aaa");
		});
	}, false);
	return marker;
};

var createAtendeeMarker = function(attendee) {
	var html = 	'<div class="attendee">' +
		'<div class="picture">' +
			'<img src="'+attendee.picture +'">' +
		'</div>' +
		'<div class="why">'+attendee.why+'</div>'+
	'</div>';

	var myIcon = L.divIcon({className: 'attendee-icon', html: html})

	var marker = L.marker([attendee.lat, attendee.long], {icon: myIcon, riseOnHover: true, draggable: false});

	marker.on("mouseover", function(ev) {
		console.log(marker._icon);
		marker._icon.querySelector('.attendee').style.width = "100px";
		marker._icon.classList.add("active");
	}).on("mouseout", function(ev) {
		marker._icon.querySelector('.attendee').style.width = "30px";
		marker._icon.classList.remove("active");
	});

	var icon = myIcon._icon;
	console.log(marker);
	marker.addEventListener("webkitTransitionEnd", function(event) {
		if (marker._icon.querySelector('.attendee').style.width === "30px") {
			icon.classList.classList.remove("active");
		} else {
			icon.classList.add("active");
		}
	}, false)
	return marker;
};

var createMarkers = function(attendees) {
	return attendees.map(createAtendeeMarker);
};

var createLayer = function(attendeeMarkers) {
	console.log(attendeeMarkers)
	return L.layerGroup(attendeeMarkers);
};

jQuery.get("attendees.php", function(data) {
	var attendees = JSON.parse(data);
	var atendeesLayer = createLayer(createMarkers(attendees));
	atendeesLayer.addTo(map);
	myMarkerOnMapIcon = createMyIcon();
});


