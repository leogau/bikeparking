function LocationsViewModel() {
	var self = this;
	self.mapService = MapService;
	self.directionsURI = '/api/v1.0/directions';
	self.locations = ko.observableArray();
	self.currentLocation = {};
	
	self.beginChange = function() {
		$('#change').modal('show');
	}
	
	self.getDirections = function(location) {
		var endLocation = {
			'latitude': location.latitude(),
			'longitude': location.longitude()
		}
		self.mapService.calcRoute(self.currentLocation, endLocation);
	}
	
	self.changeStarting = function(newLocation) {
		self.mapService.initializeMap(newLocation, initLocations);
	}
	
	function initLocations(currentLocation) {
		self.currentLocation = currentLocation;
		$.get(self.directionsURI, { 'latitude': self.currentLocation.latitude, 'longitude': self.currentLocation.longitude}, function(data) {
			for (var i = 0; i < data.result.length; i++) {
				self.locations.push({
					latitude: ko.observable(data.result[i].coordinates.latitude),
					longitude: ko.observable(data.result[i].coordinates.longitude),
					address: ko.observable(data.result[i].location_name),
					racks_installed: ko.observable(data.result[i].racks_installed)
				});
			}
			if (self.locations().length > 0) {
				self.getDirections(self.locations()[0]);
			}
		});
	}
	self.mapService.initializeMap({}, initLocations);
}

function ChangeLocationViewModel() {
	var self = this;
	self.latitude = ko.observable();
	self.longitude = ko.observable();
	self.changeLoc = function() {
		$('#change').modal('hide');
		locationsViewModel.changeStarting({
			'latitude': +self.latitude(),
			'longitude': +self.longitude()
		});
		self.latitude("");
		self.longitude("");
	}
}

var locationsViewModel = new LocationsViewModel();
var changeLocationViewModel = new ChangeLocationViewModel();
ko.applyBindings(locationsViewModel, $('#main')[0]);
ko.applyBindings(changeLocationViewModel, $('#change')[0]);