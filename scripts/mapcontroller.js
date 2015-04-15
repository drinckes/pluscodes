/*
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/


/**
  Provides an object to interact with an embedded map.
  @this MapController
  @param {object} container The DOM element (a DIV) that contains the map.
 */
function MapController(container) {
  // DOM element holding the map.
  this.mapContainer = container;
  // Google Maps API map object.
  this.map;

  // Google Maps API Marker object indicating current device
  // location.
  this.marker;
  this.accuracyMarker;
  // OLC location marker.
  this.codeMarker;
  // Google Maps API Rectangle object indicating the current OLC code area.
  this.codeRectangle;
}

// ID for the imagery type preference.
MapController._IMAGERY_PREF = 'map_imagery';

// Default center location.
MapController._DEFAULT_CENTER = null;

// Default zoom level.
MapController._DEFAULT_ZOOM = 3;


/**
  Set up the map, register click handlers and get location updates.
  If the Google Maps APIs weren't loaded, returns false.
  @return {boolean} Whether the Maps API was loaded.
 */
MapController.prototype.initialise = function() {
  if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
    return false;
  }

  // Default center location.
  MapController._DEFAULT_CENTER = new google.maps.LatLng(40, 15);

  // Default location.
  // Create the map object.
  this.map = new google.maps.Map(
      this.mapContainer,
      {
        center: MapController._DEFAULT_CENTER,
        zoom: MapController._DEFAULT_ZOOM,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true,
        zoomControl: true,
        disableDefaultUI: true
      });
  this.map.setTilt(0);

  // Create the markers in the order to draw them.
  this.accuracyMarker = new google.maps.Circle({
      map: this.map,
      clickable: false
  });
  this.marker = new google.maps.Circle({
      map: this.map,
      clickable: false
  });
  this.codeRectangle = new google.maps.Rectangle({
      map: this.map,
      clickable: false
  });
  this.codeMarker = new google.maps.Circle({
      map: this.map,
      clickable: false
  });
  var imageryPref = DataStore.get(MapController._IMAGERY_PREF);
  if (imageryPref != null) {
    this.map.setMapTypeId(imageryPref);
  }

  google.maps.event.addListener(this.map, 'zoom_changed', receiveMapZoomEvent);
  google.maps.event.addListener(this.map, 'click', receiveMapClickEvent);
  google.maps.event.addListener(this.map, 'bounds_changed',
      receiveMapBoundsEvent);
  google.maps.event.addListener(this.map, 'dragstart', function() {
      if (displayedCode.is_pinned) {
        return;
      }
      var map = $('.map-area');
      var center = $('<div>').addClass('map-center');
      $('.map-area').append(center);
      center.css('top',
          (map.outerHeight() / 2 - center.outerHeight() / 2) + 'px');
      center.css('left',
          (map.outerWidth() / 2 - center.outerWidth() / 2) + 'px');
      center.fadeIn();
  });
  google.maps.event.addListener(this.map, 'dragend', function() {
      $('.map-area .map-center').fadeOut();
  });

  if (displayedCode.code != null) {
    // We already have a code to display - probably from the URL -
    // so zoom to it and draw it.
    map.setCodeMarker(
        displayedCode.codeArea.latitudeLo,
        displayedCode.codeArea.longitudeLo,
        displayedCode.codeArea.latitudeHi,
        displayedCode.codeArea.longitudeHi);
    // Zooming in is easier than zooming out.
    zoomToCode();
  }
  return true;
};


/** @return {boolean} whether the map has been initialised. */
MapController.prototype.isReady = function() {
  return typeof this.map != 'undefined';
};


/**
  Toggle imagery between satellite and roadmap.
 */
MapController.prototype.toggleImagery = function() {
  if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
    return;
  }
  if (this.map.getMapTypeId() === google.maps.MapTypeId.ROADMAP) {
    this.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
  } else {
    this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
  }
  // Save it in the data store.
  DataStore.putString(MapController._IMAGERY_PREF, this.map.getMapTypeId());
};


/**
  Get a new location for the current position marker.
  @param {number} lat The latitude.
  @param {number} lng The longitude.
 */
MapController.prototype.setLocationMarker = function(lat, lng, accuracy) {
  if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
    return;
  }
  this.currentLatLng = [lat, lng];
  var latLng = new google.maps.LatLng(lat, lng);
  var zoom = this.map.getZoom();
  var size = 1.5 * Math.pow(2, Math.max(0, 20 - zoom));
  this.marker.setOptions({
      center: latLng,
      radius: size,
      strokeColor: '#02567f',
      strokeOpacity: 1.0,
      strokeWeight: 1,
      fillColor: '#039be5',
      fillOpacity: 1.0
  });

  if (typeof accuracy != 'undefined') {
    this.accuracyMarker.setOptions({
        center: latLng,
        radius: accuracy,
        strokeColor: '#039be5',
        strokeOpacity: 0.3,
        strokeWeight: 1,
        fillColor: '#039be5',
        fillOpacity: 0.1
    });
  }
};

MapController.prototype.redrawLocationMarker = function() {
  if (this.marker === null || typeof this.marker.getCenter() === 'undefined') {
    return;
  }
  this.setLocationMarker(
      this.marker.getCenter().lat(), this.marker.getCenter().lng());
};


/**
  Display the marker for a code on the map.
  It could be a rectangle, or if the rectangle would be too small, a constant
  sized circle is drawn (depending on the zoom level).
 */
MapController.prototype.setCodeMarker = function(latLo, lngLo, latHi, lngHi) {
  if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
    return;
  }
  var zoom = this.map.getZoom();
  var size = 1.5 * Math.pow(2, Math.max(0, 20 - zoom));
  if (size > MapController._earthDistance(latLo, lngLo, latHi, lngHi)) {
    var center = new google.maps.LatLng(
        (latLo + latHi) / 2, (lngLo + lngHi) / 2);
    this.codeRectangle.setMap(null);
    this.codeMarker.setOptions({
        map: this.map,
        center: center,
        radius: size,
        strokeColor: '#e11e60',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        fillColor: '#f06292',
        fillOpacity: 1.0,
    });
  } else {
    var sw = new google.maps.LatLng(latLo, lngLo);
    var ne = new google.maps.LatLng(latHi, lngHi);
    var bounds = new google.maps.LatLngBounds(sw, ne);
    this.codeMarker.setMap(null);
    this.codeRectangle.setOptions({
        map: this.map,
        bounds: bounds,
        strokeColor: '#e11e60',
        strokeOpacity: 1.0,
        strokeWeight: 1,
        fillColor: '#f06292',
        fillOpacity: 0.3
    });
  }
};


/**
  Pans and zooms the map if the entire code is not visible or
  if the zoom level is too low to allow codes to be seen easily.
 */
MapController.prototype.zoomToBounds = function(
    latLo, lngLo, latHi, lngHi, userLat, userLng) {
  if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
    return;
  }
  var sw = new google.maps.LatLng(latLo, lngLo);
  var ne = new google.maps.LatLng(latHi, lngHi);
  var bounds = new google.maps.LatLngBounds(sw, ne);
  if (userLat != null && userLng != null) {
    bounds.extend(new google.maps.LatLng(userLat, userLng));
  }
  this.map.fitBounds(bounds);
};


/**
  Moves the center of the map and sets the zoom level.
 */
MapController.prototype.zoomToCenter = function(lat, lng, zoom) {
  if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
    return;
  }
  this.map.setCenter(new google.maps.LatLng(lat, lng));
  this.map.setZoom(zoom);
};

/**
  Compute distance between two locations.
  @param {number} lat1 The latitude of the first location.
  @param {number} lng1 The longitude of the first location.
  @param {number} lat2 The latitude of the second location.
  @param {number} lng2 The longitude of the second location.
  @return {number} The distance between locations in meters.
 */
MapController._earthDistance = function(lat1, lng1, lat2, lng2) {
  var toRadians = Math.PI / 180;
  // Earth radius in meters
  var radius = 6371000;
  var lat1Rad = lat1 * toRadians;
  var lng1Rad = lng1 * toRadians;
  var lat2Rad = lat2 * toRadians;
  var lng2Rad = lng2 * toRadians;
  var latDiff = lat2Rad - lat1Rad;
  var lngDiff = lng2Rad - lng1Rad;

  var a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
          Math.cos(lat1Rad) * Math.cos(lat2Rad) *
          Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return c * radius;
};

