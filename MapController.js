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
  Constructor for the PlusCodes object. This gets the URL and initial
  code, and initialises the map and compass.
  @this MapController
 */
function MapController() {
  // Google Maps API map object.
  this.map;
  // Google Maps API Marker object indicating current device
  // location.
  this.currentLocationMarker;
  // Google Maps API Rectangle object indicating the current OLC code area.
  this.codeRectangle;
  // Callback function to call when the user clicks on the map.
  this.clickCallBackFunction = null;
}


/**
  Set up the map, register click handlers and get location updates.
  If the Google Maps APIs weren't loaded, returns false.
  @param {string} code Code to display in the map.
  @param {Function} clickFunction Function to call when the user clicks on the
      map.
  @return {boolean} Whether the Maps API was loaded.
 */
MapController.prototype.initialise = function(code, clickFunction) {
  if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
    return false;
  }
  if (typeof clickFunction != 'undefined') {
    this.clickCallBackFunction = clickFunction;
  }

  // Default location.
  var mapCenter = new google.maps.LatLng(47.365561, 8.52494);

  if (OpenLocationCode.isFull(code)) {
    var area = OpenLocationCode.decode(code);
    mapCenter = new google.maps.LatLng(
        area.latitudeCenter, area.longitudeCenter);
  }
  // Create the map object.
  this.map = new google.maps.Map(
      $('#map-canvas').get(0),
      {
        center: mapCenter,
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        scaleControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{visibility: 'off'}]
          }
        ]
      });
  this.map.setTilt(0);
  this.currentLocationMarker = null;
  // Add an event listener to display OLC boxes around clicks.
  var that = this;
  google.maps.event.addListener(this.map, 'click',
      function(e) {that.handleMapClick(e)});
  return true;
};


/** @return {boolean} whether the map has been initialised. */
MapController.prototype.isReady = function() {
  return typeof this.map != 'undefined';
};


/**
  Handle a click on the map.
  @param {Event} event The Google Maps API click event.
 */
MapController.prototype.handleMapClick = function(event) {
  var olcCode = OpenLocationCode.encode(
      event.latLng.lat(), event.latLng.lng(), 10);
  this.displayCodeRectangle(olcCode);
  if (this.clickCallBackFunction != null) {
    this.clickCallBackFunction(olcCode, event.latLng.lat(), event.latLng.lng());
  }
};


/**
  Handle a click on the code rectangle.
  @param {Event} event The Google Maps API click event.
 */
MapController.prototype.handleCodeClick = function(event) {
  var olcCode = OpenLocationCode.encode(
      event.latLng.lat(), event.latLng.lng(), 11);
  this.displayCodeRectangle(olcCode);
  if (this.clickCallBackFunction != null) {
    this.clickCallBackFunction(olcCode, event.latLng.lat(), event.latLng.lng());
  }
};


/**
  Get a new location for the current position marker.
  @param {number} lat The latitude.
  @param {number} lng The longitude.
 */
MapController.prototype.handleLocationUpdate = function(lat, lng) {
  if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
    return;
  }
  this.currentLatLng = [lat, lng];
  var latLng = new google.maps.LatLng(lat, lng);
  if (this.currentLocationMarker == null) {
    this.currentLocationMarker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        icon: {
            anchor: new google.maps.Point(36, 36),
            url: 'img/here_marker.png'
        },
        title: messages.get('current-location')
    });
  } else {
    this.currentLocationMarker.setPosition(latLng);
  }
};


/**
  Display the rectangle for a code and zoom/pan to it.
  @param {string} code The OLC code to display.
 */
MapController.prototype.displayCodeRectangle = function(code) {
  if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
    return;
  }
  var codeArea = OpenLocationCode.decode(code);
  if (this.codeRectangle != null) {
    google.maps.event.clearListeners(this.codeRectangle, 'click');
    this.codeRectangle.setMap(null);
  }
  var codeArea = OpenLocationCode.decode(code);
  var sw = new google.maps.LatLng(codeArea.latitudeLo, codeArea.longitudeLo);
  var ne = new google.maps.LatLng(codeArea.latitudeHi, codeArea.longitudeHi);
  var bounds = new google.maps.LatLngBounds(sw, ne);

  this.codeRectangle = new google.maps.Rectangle({
      bounds: bounds,
      strokeColor: '#e51c23',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      fillColor: '#e51c23',
      fillOpacity: 0.3,
      clickable: false,
      map: this.map
  });
  if (codeArea.codeLength < 11) {
    this.codeRectangle.setOptions({clickable: true});
    var mapController = this;
    google.maps.event.addListener(
        this.codeRectangle, 'click',
        function(e) {mapController.handleCodeClick(e)});
  }
};


/**
  Pans and zooms the map if the entire code is not visible or
  if the zoom level is too low to allow codes to be seen easily.
  @param {string} code The OLC code to display.
 */
MapController.prototype.zoomToCode = function(code) {
  if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
    return;
  }
  var codeArea = OpenLocationCode.decode(code);
  var center = new google.maps.LatLng(
      codeArea.latitudeCenter, codeArea.longitudeCenter);
  var sw = new google.maps.LatLng(codeArea.latitudeLo, codeArea.longitudeLo);
  var ne = new google.maps.LatLng(codeArea.latitudeHi, codeArea.longitudeHi);
  var bounds = new google.maps.LatLngBounds(sw, ne);
  var mapBounds = this.map.getBounds();
  var oldZoom = this.map.getZoom();
  // Recenter and zoom if the old zoom is too small, or code is not
  // completely visible.
  if (oldZoom < (codeArea.codeLength * 1.5) ||
      typeof mapBounds == 'undefined' ||
      !mapBounds.contains(sw) ||
      !mapBounds.contains(ne)) {
    this.map.setCenter(center);
    this.map.fitBounds(bounds);
  }
};
