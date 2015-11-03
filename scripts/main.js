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

/** Singleton class to represent the currently displayed code. */
function DisplayedCode() {

  if (arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }
  arguments.callee._singletonInstance = this;
  this.is_set = false;
  this.is_pinned = false;
  this.code = null;
  this.decoded = null;
  this.area_code = null;
  this.place_code = null;
  this.timestamp_millis = 0;
  this.neighbourhood = null;

  this.setCode = function(code) {
    this.code = code;
    this.codeArea = OpenLocationCode.decode(code);
    this.timestamp_millis = Date.now();
    if (this.codeArea.codeLength > 4) {
      this.area_code = this.code.substring(0, 4);
      this.place_code = this.code.substring(4);
      this.neighbourhood = this.code.substring(0, 9);
      this.neighbourhoodArea = OpenLocationCode.decode(this.neighbourhood);
    } else {
      this.area_code = null;
      this.place_code = null;
      this.neighbourhood = null;
      this.neighbourhoodArea = null;
    }
  };

  /** Set the code into the URL. */
  this.setUrl = function() {
    // Pathname can be host/OLC, host/path/OLC, host/path/path.html
    var paths = location.pathname.split('/');
    var newpath;
    // If the last one is an OLC code, drop it and replace it with the new one.
    if (location.search !== '') {
      newpath = location.pathname + '?q=' + this.code;
    } else if (paths[paths.length - 1].indexOf('+') > -1) {
      paths.pop();
      newpath = paths.join('/') + '/' + this.code;
    } else if (paths[paths.length - 1] == '') {
      paths.pop();
      newpath = paths.join('/') + '/' + this.code;
    } else {
      newpath = location.pathname + '?q=' + this.code;
    }

    window.history.pushState(
        'object or string',
        'plus+code: ' + this.code,
        newpath);
  };
}

/**
 * Maps code lengths to zoom levels. Each entry gives the code length and the
 * minimum zoom level for that code length.
 */
var CodeLengthZoom = [
  {'code':4, 'zoom':0},
  {'code':6, 'zoom':8},
  {'code':8, 'zoom':14},
  {'code':10, 'zoom':18},
  {'code':11, 'zoom':20}
];

/** Set up global variables and objects. */
function init() {
  // The current code - from the URL, search or map click.
  displayedCode = new DisplayedCode();
  codePendingGeocoding = null;

  // Create a cache for codes and addresses.
  codeAddressCache = new SimpleCache();

  // Get the messages in different languages.
  messages = new Messages();

  // Location of the device as a tuple of lat/lng (null until we get something).
  deviceLatLng = null;

  // Did we have a code in the URL?
  var urlCode = getCodeFromUrl();
  if (urlCode != null && OpenLocationCode.isValid(urlCode)) {
    displayedCode.setCode(urlCode);
    displayedCode.setUrl();
    displayedCode.is_pinned = true;
    pushPushPin();
    displayCodeInformation(displayedCode);
  }

  // Create the various objects we need.
  locationListener = new LocationListener(receiveDeviceLocation);
  map = new MapController(document.querySelector('.map'));
  compass = new CompassController(document.querySelector('.compass_container'));
  compass.initialise();
}

/** Called when the map is zoomed. */
function receiveMapZoomEvent() {
  updateLocationButton();
  // Redraw the user's location marker so it can be seen. */
  map.redrawLocationMarker();
  map.setCodeMarker(
      displayedCode.codeArea.latitudeLo,
      displayedCode.codeArea.longitudeLo,
      displayedCode.codeArea.latitudeHi,
      displayedCode.codeArea.longitudeHi);
}

var lastMapClickMillis = 0;
/** Called when user clicks or taps on the map. Uses click location as a new code. */
function receiveMapClickEvent(event) {
  var now = new Date().getTime();
  var lastClick = lastMapClickMillis;
  lastMapClickMillis = now;
  if (displayedCode.is_pinned) {
    if (now - lastClick < 3000) {
      // Tapped twice in 3 seconds - they're probably confused why the first tap
      // did nothing, so unpin and continue with the tap.
      togglePushPin();
    } else {
      // It's pinned, so ignore the tap. They should unpin the current location.
      return;
    }
  }
  var zoom = map.map.getZoom();
  var center = map.map.getCenter();
  var codeLength = 4;
  for (var i = 0; i < CodeLengthZoom.length; i++) {
    if (zoom >= CodeLengthZoom[i].zoom) {
      codeLength = CodeLengthZoom[i].code;
    }
  }
  var newcode = OpenLocationCode.encode(event.latLng.lat(), event.latLng.lng(), codeLength);
  if (displayedCode.code == newcode) {
    return;
  }
  displayedCode.setCode(newcode);
  displayedCode.setUrl();
  displayCodeInformation(displayedCode);
  map.setCodeMarker(
      displayedCode.codeArea.latitudeLo,
      displayedCode.codeArea.longitudeLo,
      displayedCode.codeArea.latitudeHi,
      displayedCode.codeArea.longitudeHi);
  map.zoomToCenter(
      displayedCode.codeArea.latitudeCenter,
      displayedCode.codeArea.longitudeCenter,
      zoom);
}

/** Called when the user drags or zooms the map. */
function receiveMapBoundsEvent() {
  updateLocationButton();
  // Is the displayed code pinned?
  if (displayedCode.is_pinned) {
    return;
  }
  if (map.map == null) {
    return;
  }
  // Not pinned - so create a new code using a combination of the zoom level and
  // the map center.
  var zoom = map.map.getZoom();
  var center = map.map.getCenter();
  var codeLength = 4;
  for (var i = 0; i < CodeLengthZoom.length; i++) {
    if (zoom >= CodeLengthZoom[i].zoom) {
      codeLength = CodeLengthZoom[i].code;
    }
  }
  var newcode = OpenLocationCode.encode(center.lat(), center.lng(), codeLength);
  if (displayedCode.code == newcode) {
    return;
  }
  displayedCode.setCode(newcode);
  // Set it into the URL unless it's the map default location.
  if (zoom != MapController._DEFAULT_ZOOM || center != MapController._DEFAULT_CENTER) {
    displayedCode.setUrl();
  }
  displayCodeInformation(displayedCode);
  map.setCodeMarker(
      displayedCode.codeArea.latitudeLo,
      displayedCode.codeArea.longitudeLo,
      displayedCode.codeArea.latitudeHi,
      displayedCode.codeArea.longitudeHi);
}

/** Called when the map tiles are loaded. */
function receiveTilesLoadedEvent() {
  map.tilesLoaded = true;
  if (!map.isCodeMarkerDisplayed()) {
    map.setCodeMarker(
        displayedCode.codeArea.latitudeLo,
        displayedCode.codeArea.longitudeLo,
        displayedCode.codeArea.latitudeHi,
        displayedCode.codeArea.longitudeHi);
    // Zooming in is easier than zooming out.
    zoomToCode();
  }
}


/** Called with device location updates. */
function receiveDeviceLocation(lat, lng, accuracy) {
  map.setLocationMarker(lat, lng, accuracy);
  if (deviceLatLng === null && !displayedCode.is_pinned) {
    // We have a code but it's not pinned, so if this is the first
    // location update, let's go there.
    displayedCode.setCode(OpenLocationCode.encode(lat, lng));
    compass.setPoints(lat, lng,
        displayedCode.codeArea.latitudeCenter,
        displayedCode.codeArea.longitudeCenter);
    map.setCodeMarker(
        displayedCode.codeArea.latitudeLo,
        displayedCode.codeArea.longitudeLo,
        displayedCode.codeArea.latitudeHi,
        displayedCode.codeArea.longitudeHi);
    // Zooming in is easier than zooming out.
    zoomToCode();
    displayCodeInformation(displayedCode);
  } else if (displayedCode.code != null) {
    compass.setPoints(lat, lng,
        displayedCode.codeArea.latitudeCenter,
        displayedCode.codeArea.longitudeCenter);
  }
  if (deviceLatLng === null) {
    $('button.compass').addClass('reveal');
  }
  // Save the current location.
  deviceLatLng = [lat, lng];
  // Update the button status depending on whether the current location is
  // within the map view.
  updateLocationButton();
}


/**
 * Zoom the map to show the code.
 */
function zoomToCode(code_opt) {
  var codeArea = displayedCode.codeArea;
  if (typeof code_opt != 'undefined') {
    codeArea = OpenLocationCode.decode(code_opt);
  }
  // Get the zoom level for this code length.
  var zoomLevel = 4;
  for (var i = 0; i < CodeLengthZoom.length; i++) {
    if (codeArea.codeLength >= CodeLengthZoom[i].code) {
      zoomLevel = CodeLengthZoom[i].zoom;
    }
  }
  map.zoomToCenter(
      codeArea.latitudeCenter, codeArea.longitudeCenter, zoomLevel);
}


/**
 *
 * Split user search input into the different parts.
 *
 * User search input should be an OLC code, and OLC code and an address,
 * or just an address.
 *
 * This splits it into the different parts, and returns an optional code
 * indicating a possible message to show the user (if an OLC code has been
 * included that doesn't have the '+' sign in it).
 *
 * @param {string} input A user input string.
 * @return {*} An array made up of [full code, short code, address, message, latLng].
 */
function splitSearchInput(input) {
  var bestFullCode = '';
  var bestShortCode = '';
  var address = [];
  var message = '';
  var latLng = '';
  // Check for just a lat,lng. This avoids us extracting it and then geocoding it.
  if (/^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/.test(input)) {
    latLng = input;
  } else {
    // Split the input by whitespace, commas, colons.
    var fields = input.split(/[\s,:]+/);
    // Check each field of the input. We want to get the most specific OLC
    // code into the code var, and put everything else into the address var.
    while (fields.length > 0) {
      var field = fields.shift();
      // If it's a short OLC code longer than the previous short OLC code
      // save it.
      if (OpenLocationCode.isShort(field) &&
          field.length > bestShortCode.length) {
        bestShortCode = field;
      } else if (OpenLocationCode.isFull(field) &&
          !OpenLocationCode.isShort(field) &&
          field.length > bestFullCode.length &&
          field.length > 6) {
        // If this field looks like a long OLC code, it's not a short code,
        // it's longer than any other long code, save it.
        bestFullCode = field;
      } else {
        address.push(field);
      }
    }
    // Join all the fields that didn't look like OLC codes.
    address = address.join(' ');
    // Work out what to use as the OLC code. This works by blanking the code we
    // don't want to use!!!
    if (bestFullCode && bestShortCode) {
      if (bestFullCode.length >= 10) {
        // This is the best - clear the short code.
        bestShortCode = '';
      } else {
        // The short code is better - clear the full code.
        bestFullCode = '';
      }
    }
  }
  return {'full': bestFullCode, 'short': bestShortCode,
          'address': address, 'message': message, 'latLng': latLng};
}


/**
 * Display information about a code in the infobox.
 */
function displayCodeInformation() {
  setMapProviderUrls(
      displayedCode.codeArea.latitudeCenter,
      displayedCode.codeArea.longitudeCenter,
      displayedCode.code);
  if (displayedCode.neighbourhood === null) {
    // Code too short, not worth getting an address for it.
    InfoBox.setPanel(
        '<span><p class="message">' + displayedCode.code + '</p></span>');
    return;
  }
  // Get the neighbourhood from the code - we use that to compute the address.
  if (codeAddressCache.has(displayedCode.neighbourhood)) {
    var neighbourhoodInfo = codeAddressCache.get(displayedCode.neighbourhood);
    var shortCode = shortenDisplayedCode(
        displayedCode, neighbourhoodInfo.address, neighbourhoodInfo.lat,
        neighbourhoodInfo.lng);
    if (shortCode != null) {
      InfoBox.setPanel(
          '<span><p class="address">' + shortCode + ' ' +
          neighbourhoodInfo.address + '</p><p class="fullcode">' + code.code +
          '</p></span>');
      return;
    }
  }
  InfoBox.clear();
  if (displayedCode.codeArea.codeLength >= 10) {
    InfoBox.setPanel(
        '<span><p class="areacode">' + displayedCode.area_code + '</p>' +
        '<p class="shortcode">' + displayedCode.place_code + '</p></span>');
  } else if (displayedCode.code != null) {
    InfoBox.setPanel(
        '<span><p class="message">' + displayedCode.code + '</p></span>');
  }
  codePendingGeocoding = displayedCode;
  setTimeout(function() {getAddressForDisplayedCode();}, 2500);
}


/**
 * Get an address for the current displayedCode.
 *
 * If the current displayedCode is more than one second old, use the Google
 * Geocoding API to get an address for that lat/lng, and confirm that the
 * address is close enough to be used to shorten the code. This requires
 * two calls (a reverse geocode, extract address elements, and then geocode
 * that address).
 *
 * We make sure the displayedCode is old, so that we don't send hundreds of
 * geocoding requests as the user is dragging the map.
 *
 * Only call if the displayed code has at least 7 characters (1234+67).
 */
function getAddressForDisplayedCode() {
  if (codePendingGeocoding === null) {
    return;
  }
  if (Date.now() - codePendingGeocoding.timestamp_millis < 1000) {
    return;
  }
  code = codePendingGeocoding;
  codePendingGeocoding = null;
  try {
    var recoveryLocation = getRecoveryLocation();
    // Get an address for the neighbourhood, geocode it, and use the location
    // to shorten the code.
    $.when(
        Geocoder.lookupLatLng(
            code.neighbourhoodArea.latitudeCenter,
            code.neighbourhoodArea.longitudeCenter)
    ).then(
        function(lat, lng, address) {
          return Geocoder.geocodeAddress(
              address, recoveryLocation[0], recoveryLocation[1]);
        },
        function(error) {
          InfoBox.fadeToPanel(
              '<span><p class="areacode">' + displayedCode.area_code + '</p>' +
              '<p class="shortcode">' + displayedCode.place_code + '</p></span>');
        }
    ).then(
        function(address, lat, lng) {
          if (address != '' && lat != null && lng != null) {
            var shortCode = shortenDisplayedCode(code, address, lat, lng);
            if (shortCode != null) {
              InfoBox.fadeToPanel(
                  '<span><p class="address">' + shortCode + ' ' + address +
                  '</p><p class="fullcode">' + code.code + '</p></span>');
            }
          }
        },
        function(error) {
          // If there was an error in the geocodeAddress section, it will be
          // logged there but cause another error here.
          if (typeof error != 'undefined') {
            InfoBox.fadeToPanel(
                '<span><p class="areacode">' + displayedCode.area_code + '</p>' +
                '<p class="shortcode">' + displayedCode.place_code + '</p></span>');
          }
        }
    );
  } catch (e) {
    // This really should not happen.
  }
}

function shortenDisplayedCode(code, address, lat, lng) {
  try {
    var shortCode = OpenLocationCode.shorten(code.code, lat, lng);
    if (shortCode != code.code) {
      // Too much? Keep at least ABCD+.
      if (shortCode.length < code.code.length - 4) {
        shortCode = code.code.substr(4);
      }
      codeAddressCache.put(code.neighbourhood,
          {'address': address, 'lat': lat, 'lng': lng});
      return shortCode;
    }
  } catch (e) {
  }
  return null;
}

/** Display a code location on map and compass. */
function displayCodeMapCompass() {
  return;
  displayingDeviceLocation = false;
  var codeArea = OpenLocationCode.decode(displayedCode);
  map.setCodeMarker(codeArea.latitudeLo, codeArea.longitudeLo,
                    codeArea.latitudeHi, codeArea.longitudeHi);
  // Create artificial bounds that are twice as big as the code.
  // Zooming in is easier than zooming out.
  codeArea = expandCodeArea(codeArea);
  map.zoomToCenter(codeArea.latitudeCenter, codeArea.longitudeLo,
                   codeArea.latitudeHi, codeArea.longitudeHi);
  if (deviceLatLng != null) {
    compass.setPoints(deviceLatLng[0], deviceLatLng[1],
        codeArea.latitudeCenter, codeArea.longitudeCenter);
  } else {
    compass.setPoints(codeArea.latitudeCenter, codeArea.longitudeCenter);
  }
}

/**
 * Get the lat and lng to use to recover a short code.
 * @return {Array<number>} The lat,lng from the current location if known, from
      the map center (if the maps API could load), or (null, null).
 */
function getRecoveryLocation() {
  if (deviceLatLng !== null) {
    return deviceLatLng;
  } else if (map.isReady()) {
    var center = map.map.getCenter();
    return [center.lat(), center.lng()];
  } else {
    return [null, null];
  }
}

/**
 * Load Google Maps asynch so we can work offline.
 *
 * Once the Google Maps API has loaded, it calls googleMapSetup to initialise
 * the map object.
 *
 * In the page javascript, include:
 *   window.online = loadGoogleMaps;
 */
function googleMapLoad() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCP3yO0nubZ8vCiyK-ZF-XEJ7VQWe6wVIM&v=3.exp&';
  if (messages.language !== null) {
    script.src += 'language=' + messages.language + '&';
  }
  script.src += 'callback=googleMapSetup';
  document.body.appendChild(script);
}

/** Used to set up the map object - called once Google Maps has loaded. */
function googleMapSetup() {
  map.initialise();
}

/**
 * Expand an open location code codeArea object.
 */
function expandCodeArea(codeArea) {
  var lngRange = codeArea.longitudeHi - codeArea.longitudeLo;
  var latRange = codeArea.latitudeHi - codeArea.latitudeLo;
  var newArea = {};
  newArea.latitudeLo = codeArea.latitudeLo - latRange;
  newArea.latitudeHi = codeArea.latitudeHi + latRange;
  newArea.longitudeLo = codeArea.longitudeLo - lngRange;
  newArea.longitudeHi = codeArea.longitudeHi + lngRange;
  return newArea;
}

/**
 * Called when the user clicks on the location button.
 *
 * The zoom action is defined by the classes assigned to #location,
 * see updateLocationButton.
 */
function locationZoom() {
  displayedCode.is_pinned = true;
  pushPushPin();
  var button = $('#location');
  if (button.hasClass('code-zoom')) {
    zoomToCode();
  } else {
    var codeCenter = new google.maps.LatLng(
        displayedCode.codeArea.latitudeCenter,
        displayedCode.codeArea.longitudeCenter);
    var bounds = null;
    if (button.hasClass('location-zoom')) {
      bounds = expandCodeArea(displayedCode.codeArea);
      bounds.latitudeLo = deviceLatLng[0] - 0.00001;
      bounds.latitudeHi = deviceLatLng[0] + 0.00001;
      bounds.longitudeLo = deviceLatLng[1] - 0.00001;
      bounds.longitudeHi = deviceLatLng[1] + 0.00001;
    } else {
      bounds = expandCodeArea(displayedCode.codeArea);
      bounds.latitudeLo = Math.min(bounds.latitudeLo, deviceLatLng[0]);
      bounds.latitudeHi = Math.max(bounds.latitudeHi, deviceLatLng[0]);
      bounds.longitudeLo = Math.min(bounds.longitudeLo, deviceLatLng[1]);
      bounds.longitudeHi = Math.max(bounds.longitudeHi, deviceLatLng[1]);
    }
    map.zoomToBounds(bounds.latitudeLo, bounds.longitudeLo,
                     bounds.latitudeHi, bounds.longitudeHi);
  }
}

function isMobile() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check the URL for an initial OLC code.
 *
 * It will return any path component that includes a '+'.
 * Note that this is not necessarily a valid OLC code!
 *
 * @return {string} the code if there was one or null.
 */
function getCodeFromUrl() {
  // TODO: Get the code if passed as a q= argument.
  var basePath = location.pathname;
  var fields = location.pathname.split('/');
  var code = null;
  var query = getUrlParameter('q');
  if (query != null) {
    code = query.toUpperCase();
    code = code.replace('/', '');
  } else if (fields.length > 0) {
    code = fields.pop().toUpperCase();
  }
  if (code == null) {
    return null;
  }
  if (code[8] == '+') {
    return code;
  } else if (code[0] == '+') {
    // Convert from old format OLC codes that used +xxxx.xxxxxx to
    // xxxxxxxx+xx.
    code = code.replace('+', '').replace('.', '');
    code = code.substring(0, 8) + '+' + code.substring(8);
    return code;
  }
  return null;
}

function getUrlParameter(param) {
  var query = window.location.search.substring(1);
  var variables = query.split('&');
  for (var i = 0; i < variables.length; i++) {
    var paramName = variables[i].split('=');
    if (paramName[0] == param) {
      return paramName[1];
    }
  }
}
