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
 * Constructor for the PlusCodes object. This gets the URL and initial
 * code, and initialises the map and compass.
 * @this PlusCodes
 */
function PlusCodes() {
  // The current location as an array of [lat, lng].
  this.currentLatLng = null;

  // If the location is live, this means that we change the displayed code as
  // the location of the device changes.
  this.locationIsLive = true;

  // The currently displayed OLC code. This could be the current location
  // or it could have come from the user input.
  this.displayedCode = '';

  // Define the accuracy threshold to change the location indicator from
  // accurate to inaccurate.
  this.accuracyThreshold = 20;

  // Cache addresses for OLC codes.
  this.addressCache = new SimpleCache();

  // Displays the compass, distance and heading to a location.
  this.compassController = null;

  // Displays a map, handles clicks and draws code areas.
  this.mapController = null;
}


/** Set up the compass and maps. */
PlusCodes.prototype.initialise = function() {
  var urlCode = PlusCodes.getOLCodeFromUrl();

  // True if the compass could initialise.
  this.compassController = new CompassController();
  this.compassController.initialise(urlCode);

  // We'll setup the map controller again after the Maps API loads, but we
  // set it up temporarily here so the methods can be called.
  this.mapController = new MapController();

  // Display the initial code - this has to be done before toggling to
  // compass mode.
  if (OpenLocationCode.isFull(urlCode)) {
    this.locationIsLive = false;
    this.updateDisplay(urlCode);
  }
};


/** Initialise the map controller after the Maps API has loaded. */
PlusCodes.prototype.setupMapController = function() {
  var urlCode = PlusCodes.getOLCodeFromUrl();
  this.mapController = new MapController();
  var that = this;
  this.mapController.initialise(
      urlCode,
      function(code, lat, lng) {
        that.handleMapClick(code, lat, lng);
      });
  if (OpenLocationCode.isFull(urlCode)) {
    this.mapController.zoomToCode(urlCode);
    this.updateDisplay(urlCode);
  }
};


/**
  Check the URL for an initial OLC code, save it in the object.
  @return {string} the code if there was one or the empty string.
 */
PlusCodes.getOLCodeFromUrl = function() {
  var basePath = location.pathname;
  var urlCode = '';
  var fields = location.pathname.split('/');
  if (fields.length > 0) {
    var last = fields.pop();
    if (OpenLocationCode.isValid(last)) {
      urlCode = last;
      basePath = fields.join('/');
    }
  }
  return urlCode;
};


/**
  Called after the user clicks on the map. The rectangle is already drawn.
  @param {string} code The OLC code for the click location.
  @param {number} lat The latitude of the click.
  @param {number} lng The longitude of the click.
 */
PlusCodes.prototype.handleMapClick = function(code, lat, lng) {
  InfoPanel.clear();
  this.locationIsLive = false;
  this.updateDisplay(code);
  this.updateUrl(code);
  this.mapController.zoomToCode(code);
  // And reveal the display panel.
  InfoPanel.expand();
};


/**
  Handle an update to the device location. Depending on whether we are live
  or displaying a location based on input, we send it to the compass and
  maps.
  @param {number} lat The latitude of the location.
  @param {number} lng The longitude of the location.
 */
PlusCodes.prototype.updateLocation = function(lat, lng) {
  var currentOlcCode = OpenLocationCode.encode(lat, lng);
  // If we're displaying the current device location, rather than input,
  // update the information display with this code.
  if (this.locationIsLive) {
    InfoPanel.setMessage('');
    this.updateDisplay(currentOlcCode);
    if (this.currentLatLng === null) {
      this.mapController.zoomToCode(currentOlcCode);
    }
  }
  // Send the lat/lng to the map and compass controllers.
  this.mapController.handleLocationUpdate(lat, lng);
  this.compassController.handleLocationUpdate(lat, lng);
  // Save the current location.
  this.currentLatLng = [lat, lng];
};


/**
  Update the information display and the URL.
  @param {string} code A full OLC code to display in the compass, info panel
      and on the map.
 */
PlusCodes.prototype.updateDisplay = function(code) {
  if (!OpenLocationCode.isFull(code)) {
    return;
  }
  this.displayedCode = code;
  this.compassController.setTargetCode(code);
  this.displayOLCodeWithAddress(code);
  this.mapController.displayCodeRectangle(code);
};


/** Called when the here button is clicked. */
PlusCodes.prototype.displayCurrentLocation = function() {
  InfoPanel.clear();
  this.locationIsLive = true;
  this.updateLocation(this.currentLatLng[0], this.currentLatLng[1]);
  var currentOlcCode = OpenLocationCode.encode(
      this.currentLatLng[0], this.currentLatLng[1]);
  this.mapController.displayCodeRectangle(currentOlcCode);
  this.mapController.zoomToCode(currentOlcCode);
  this.compassController.setTargetCode(currentOlcCode);
  this.updateUrl(currentOlcCode);
};


/** Toggles between compass and map mode. */
PlusCodes.prototype.toggleMode = function() {
  $('#compass_container').toggle();
  if ($('#compass_container').is(':visible')) {
    $('#mode_button').removeClass('compass_button-icon');
    $('#mode_button').addClass('map_button-icon');
    this.compassController.validate();
  } else {
    $('#mode_button').removeClass('map_button-icon');
    $('#mode_button').addClass('compass_button-icon');
  }
  this.displayOLCodeWithAddress(this.displayedCode);
  this.updateUrl(this.displayedCode);
};


/**
  Get the lat and lng to use if a short code is supplied without an address.
  @return {Array<number>} The lat,lng from the current location if known, from
      the map center (if the maps API could load), or [null, null].
 */
PlusCodes.prototype.getFallbackLocation = function() {
  if (this.currentLatLng !== null) {
    return this.currentLatLng;
  } else if (this.mapController.isReady()) {
    var center = this.mapController.map.getCenter();
    return [center.lat(), center.lng()];
  } else {
    return [null, null];
  }
};


/**
 * Self calling method to request the location. This uses
 * geolocation.getCurrentPosition in preference to watchPosition so that
 * if we lose location signals, we can detect it.
 */
PlusCodes.prototype.getCurrentLocation = function() {
  var that = this;
  navigator.geolocation.getCurrentPosition(
      function(position) {
        that.updateLocation(
            position.coords.latitude, position.coords.longitude);
        // Display the location icon and set up the click actions.
        if (position.coords.accuracy < that.accuracyThreshold) {
          $('#here_button').addClass('here_button-accurate');
          $('#here_button').removeClass('here_button-inaccurate');
        } else {
          $('#here_button').addClass('here_button-inaccurate');
          $('#here_button').removeClass('here_button-accurate');
        }
        InfoPanel.setLocationQuality(messages.get(
            'location-accuracy',
            {NUM: Math.round(position.coords.accuracy)}));
        $('#here_button').on('click',
            function() {that.displayCurrentLocation()});
        $('#here_button').on('click', function() {$('#input').val('');});
        // Call this again in five seconds.
        setTimeout(function() {that.getCurrentLocation()}, 5000);
      },
      function(error) {
        // Got an error from the location system.
        $('#here_button').removeClass('here_button-accurate');
        $('#here_button').removeClass('here_button-inaccurate');
        $('#here_button').off('click');
        InfoPanel.setLocationQuality(messages.get(
            'location-failure',
            {MSG: error.message}));
        // Call this again in five seconds.
        setTimeout(function() {that.getCurrentLocation()}, 5000);
      },
      {timeout: 30000, enableHighAccuracy: true});
};


/** @param {string} code Shorten a code and display the address. */
PlusCodes.prototype.displayOLCodeWithAddress = function(code) {
  // Force the code to be reformatted.
  code = PlusCodes.reformatOLCode(code);
  // Create a URL to use in a link.
  var newurl = this.makeUrl(code);
  // Display the full code. If we can get an address we'll overwrite this.
  InfoPanel.setHeadline(code);
  InfoPanel.setDetail('');
  InfoPanel.setGeocoderMessage('');
  // If we already have the address, use it.
  if (this.addressCache.has(code)) {
    var entry = this.addressCache.get(code);
    PlusCodes.shortenOLCode(
        code,
        entry.address,
        entry.lat,
        entry.lng);
    return;
  }
  // Get the address, and use it to shorten the code.
  var codeArea = OpenLocationCode.decode(code);
  var that = this;

  try {
    // Quick check that the code can be shortened - if it can't it will cause
    // an exception. This checks it's full, valid and a length that can be
    // shortened.
    OpenLocationCode.shortenBy4(code, 0, 0);
    var fallback = this.getFallbackLocation();
    // Get an address, geocode that address, and use that lat/lng to try to
    // shorten the code.
    $.when(
        Geocoder.lookupLatLng(codeArea.latitudeCenter, codeArea.longitudeCenter)
    ).then(
        function(lat, lng, address) {
          return Geocoder.geocodeAddress(address, fallback[0], fallback[1])},
        function(error) { InfoPanel.setGeocoderMessage(error); }
    ).then(
        function(address, lat, lng) {
          if (address != '' && lat != null && lng != null) {
            that.addressCache.put(code,
                {'address': address, 'lat': lat, 'lng': lng});
          }
          // Try to trim the area code off the OLC code.
          PlusCodes.shortenOLCode(code, address, lat, lng);
        },
        function(error) {
          if (typeof 'error' != undefined) {
            InfoPanel.setGeocoderMessage(error);
          }
        }
    );
  } catch (e) {
    InfoPanel.setDetail(messages.get('shorten-bad'));
  }
};


/**
  Shorten the passed OLC code using the address and it's location.
  @param {string} olcCode The original OLC code.
  @param {string} address The address to use.
  @param {number} lat The latitude to use to shorten the code.
  @param {number} lng The longitude to use to shorten the code.
 */
PlusCodes.shortenOLCode = function(olcCode, address, lat, lng) {
  try {
    var shortCode = OpenLocationCode.shortenBy4(olcCode, lat, lng);
    if (shortCode != olcCode) {
      InfoPanel.setHeadline(shortCode + ' ' + address);
      InfoPanel.setDetail(olcCode);
    } else {
      var codeArea = OpenLocationCode.decode(olcCode);
      var forcedShort = OpenLocationCode.shortenBy4(
          olcCode, codeArea.latitudeCenter, codeArea.longitudeCenter);
      InfoPanel.setDetail(message.get('geocoder-no-info', {OLC: forcedShort}));
    }
  } catch (e) {
  }
};


/**
  Extend the passed OLC code using a location.
  Use this as a callback to one of the geocoding functions.
  @param {string} olcCode A valid short OLC code.
  @param {string} address The original address.
  @param {number} lat The latitude to use to extend the code.
  @param {number} lng The longitude to use to extend the code.
*/
PlusCodes.prototype.recoverFullOLCode = function(olcCode, address, lat, lng) {
  try {
    var fullCode = OpenLocationCode.recoverNearest(olcCode, lat, lng);
    // Force it to reformat.
    if (fullCode === olcCode) {
      fullCode = PlusCode.reformatOLCode(fullCode);
    }
    this.updateDisplay(fullCode);
    this.updateUrl(fullCode);
    this.mapController.zoomToCode(fullCode);
  } catch (e) {
    InfoPanel.setHeadline(message.get('invalid-code', {OLC: olcCode}));
    InfoPanel.setDetail('');
  }
};


/**
  Split a field into the OLC code, address, and an optional message.
  @param {string} input A user input string.
  @return {*} A three element array made up of [olc code, address, message].
 */
PlusCodes.splitOLCodeAndAddress = function(input) {
  // If the input includes an OLC code put it in code and address with the
  // rest. Either could be empty.
  var bestFullCode = '';
  var bestShortCode = '';
  var address = [];
  var message = '';
  var fields = input.split(' ');
  // Check each field of the input. We want to get the most specific OLC
  // code into the code var, and put everything else into the address var.
  while (fields.length > 0) {
    var field = fields.shift();
    if (field.charAt(0) === '+' &&
        OpenLocationCode.isShort(field) &&
        field.length > bestShortCode.length) {
      bestShortCode = field;
      continue;
    }
    // If this field looks like a long OLC code, it's not a short code,
    // it's longer than any other long code, and it's really long OR it starts
    // with a '+':
    // set it as the code.
    if (OpenLocationCode.isFull(field) &&
        !OpenLocationCode.isShort(field) &&
        field.length > bestFullCode.length &&
        (field.length > 6 || field.charAt(0) == '+')) {
      bestFullCode = field;
      continue;
    }
    if (OpenLocationCode.isShort(field)) {
      message = messages.get('missing-plus', {OLC: field});
    }
    address.push(field);
  }
  address = address.join(' ');
  var code = '';
  if (bestFullCode && bestShortCode) {
    if (bestFullCode.length >= 10) {
      code = bestFullCode;
    } else {
      code = bestShortCode;
    }
  } else if (bestFullCode) {
    code = bestFullCode;
  } else {
    code = bestShortCode;
  }
  return [code, address, message];
};


/** Process the user input. */
PlusCodes.prototype.processInput = function() {
  var input = $('#input').val().trim();
  if (input == '') {
    return;
  }
  var that = this;
  document.activeElement.blur();
  InfoPanel.clear();
  this.locationIsLive = false;
  var codeAddress = PlusCodes.splitOLCodeAndAddress($('#input').val().trim());
  // If they just entered a short code with an address, check for failure cases
  // (no + or no current location).
  if (OpenLocationCode.isShort(codeAddress[0]) && codeAddress[1] === '') {
    if (codeAddress[0].charAt(0) != '+' && codeAddress[2] != '') {
      // Didn't start with a + and there's a message...
      InfoPanel.setMessage(codeAddress[2]);
      Infopanel.expand();
      return;
    }
    // It starts with a + but we don't have a current location or a map
    if (codeAddress[0].charAt(0) === '+' &&
        this.currentLatLng == null &&
        !this.mapController.isReady()) {
      // Can't deal with this.
      var dialog = new Dialog(messages.get('extend-failure'));
      dialog.addMessage(
          messages.get('extend-failure-msg', {OLC: codeAddress[0]}));
      dialog.show();
      return;
    }
  }
  // Display the message.
  if (codeAddress[2] != '') {
    InfoPanel.setMessage(codeAddress[2]);
    InfoPanel.expand();
  }
  var fallback = this.getFallbackLocation();
  var that = this;
  $.when(
      Geocoder.geocodeAddress(codeAddress[1], fallback[0], fallback[1])
  ).then(
      function(address, lat, lng) {
        // The code could be short, full or empty. (If address was empty,
        // we get passed fallback coordinates that could be null, null.
        var fullCode = '';
        if (codeAddress[0] === '') {
          fullCode = OpenLocationCode.encode(lat, lng);
        } else {
          try {
            // Use the location
            fullCode = OpenLocationCode.recoverNearest(
                codeAddress[0], lat, lng);
          } catch (e) {
            InfoPanel.setHeadline(
                message.get('invalid-code', {OLC: codeAddress[0]}));
          }
        }
        that.updateDisplay(fullCode);
        that.updateUrl(fullCode);
        that.mapController.zoomToCode(fullCode);
      },
      function(error) {InfoPanel.setGeocoderMessage(error)}
  );
};


/**
  Make a URL for the specified code.
  @param {string} code The code to include in the URL.
  @return {string} The url.
 */
PlusCodes.prototype.makeUrl = function(code) {
  var path = location.pathname.split('+')[0];
  // If the path doesn't end with /, then it's probably something.html,
  // and we need to add the code argument on.
  if (path.charAt(path.length - 1) != '/' && path != '') {
    path = path + '?q=' + code;
  } else {
    // The last character is / or empty, so we can just add the code on.
    path = path + code;
  }
  return path;
};


/**
  Change the URL at the top of the page to include the passed code,
  and if the compass parameter is true, add the compass flag.
  @param {string} code The code to include in the URL.
 */
PlusCodes.prototype.updateUrl = function(code) {
  code = PlusCodes.reformatOLCode(code);
  window.history.pushState(
      'object or string',
      'Open Location Code: ' + code,
      this.makeUrl(code));
};


/**
  Reformat an OLC code by decoding and encoding the center.

  @param {string} code A valid full OLC code to reformat.
  @return {string} The formatted code.
*/
PlusCodes.reformatOLCode = function(code) {
  var codeArea = OpenLocationCode.decode(code);
  return OpenLocationCode.encode(
      codeArea.latitudeCenter, codeArea.longitudeCenter, codeArea.codeLength);
};


/** @return {string} Mobile device type: android, ios, other, null for none. */
PlusCodes.getMobileDeviceType = function() {
  var agent = navigator.userAgent.toLowerCase();
  if (/android/i.test(agent)) {
      return 'android';
  } else if (/iphone|ipad|ipod/i.test(agent)) {
      return 'ios';
  } else if (/webos|blackberry|iemobile|opera mini/i.test(agent)) {
      return 'other';
  } else {
    return null;
  }
};


/** Display a dialog with buttons to other map providers. */
PlusCodes.prototype.openNavigationDialog = function() {
  // Get the current displayed code.
  var codeArea = OpenLocationCode.decode(this.displayedCode);
  var links = [];
  // Build a Google Maps link.
  links.push(
    {name: messages.get('google-maps'),
     url: 'http://maps.google.com/maps' +
        '?ll=' + codeArea.latitudeCenter + ',' + codeArea.longitudeCenter +
        '&q=' + codeArea.latitudeCenter + ',' + codeArea.longitudeCenter +
        '&hl=en&t=h&z=19'
    });
  links.splice(
      Math.round(Math.random() * links.length),
      0,
      {name: messages.get('osm-maps'),
       url: 'http://www.openstreetmap.org/' +
       '?mlat=' + codeArea.latitudeCenter +
       '&mlon=' + codeArea.longitudeCenter +
       '&zoom=19&layers=M'
      });
  links.splice(
      Math.round(Math.random() * links.length),
      0,
      {name: messages.get('bing-maps'),
       url: 'http://www.bing.com/maps/?v=2&cp=' +
       codeArea.latitudeCenter + '~' + codeArea.longitudeCenter +
       '&style=h&lvl=19&sp=Point.' +
       codeArea.latitudeCenter + '_' + codeArea.longitudeCenter +
       '_' + this.displayedCode + '___'
      });
  var mobileType = PlusCodes.getMobileDeviceType();
  if (mobileType === 'ios') {
    links.splice(
        Math.round(Math.random() * links.length),
        0,
        {name: messages.get('apple-maps'),
         url: 'http://maps.apple.com/?ll=' +
         codeArea.latitudeCenter + ',' + codeArea.longitudeCenter
        });
  }
  if (mobileType === 'android') {
    links.splice(
        Math.round(Math.random() * links.length),
        0,
        {name: messages.get('android-apps'),
         url: 'geo:' + codeArea.latitudeCenter + ',' +
            codeArea.longitudeCenter +
            '?q=' + codeArea.latitudeCenter + ',' +
            codeArea.longitudeCenter +
            '%20(' + this.displayedCode + ' )'
        });
  }
  // Blank the dialog.
  var dialog = new Dialog(messages.get('other-maps'));
  // Add the links to the dialog.
  for (var i = 0; i < links.length; i++) {
    dialog.addListItem(
        links[i].name + '<span class="link_url" style="display:none;">' +
            links[i].url + '</span>',
        function() {
          Dialog.dismiss();
          var url = $(this).children().filter('.link_url').html();
          window.open(url, '_blank');
        });
  }
  dialog.show();
};


/** Provide geocoder functions. */
function Geocoder() {
}

/**
  Get a location for an address. Uses jQuery Deferred. The done()
  method will be called with the address, latitude and longitude. If a
  location cannot be determined, the reject() method is called with an error
  message.
  @param {string} address The address to geocode.
  @param {number} fallbackLat If the address is empty, the latitude to return
      instead.
  @param {number} fallbackLng If the address is empty, the longitude to return
      instead.
  @return {*} jQuery Promise object.
 */
Geocoder.geocodeAddress = function(address, fallbackLat, fallbackLng) {
  var deferred = $.Deferred();
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    deferred.reject('');
  } else if (address === '') {
    deferred.resolve(address, fallbackLat, fallbackLng);
  } else {
    // Google Maps API geocoder object.
    var geocoder = new google.maps.Geocoder();
    // Send the address off to the geocoder.
    geocoder.geocode(
        {'address': address},
        function(results, status) {
          if (status != google.maps.GeocoderStatus.OK) {
            switch (status) {
              case google.maps.GeocoderStatus.ZERO_RESULTS:
                deferred.reject(
                    messages.get('geocode-fail', {ADDRESS: address}));
                break;
              case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
                deferred.reject(
                    messages.get('geocode-fail-limit', {ADDRESS: address}));
                break;
              case google.maps.GeocoderStatus.REQUEST_DENIED:
                deferred.reject(
                    messages.get('geocode-fail-deny', {ADDRESS: address}));
                break;
              case google.maps.GeocoderStatus.INVALID_REQUEST:
                deferred.reject(
                    messages.get('geocode-fail-reject', {ADDRESS: address}));
                break;
              default:
                deferred.reject(
                    messages.get('geocode-fail-error', {ADDRESS: address}));
            }
          } else if (results === null || results.length == 0) {
            deferred.reject(messages.get('geocoder-no-info'));
          } else {
            var addressLocation = results[0].geometry.location;
            deferred.resolve(
                address, addressLocation.lat(), addressLocation.lng());
          }
        });
  }
  return deferred.promise();
};


/**
  Get a possible address for a location. Uses jQuery Deferred. The done()
  method will be called with the latitude, longitude and address. If an
  address cannot be determined, the reject() method is called with an error
  message.
  @param {number} lat The latitude.
  @param {number} lng The longitude
  @return {*} jQuery Promise object.
 */
Geocoder.lookupLatLng = function(lat, lng) {
  var deferred = $.Deferred();
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    deferred.reject('');
    return deferred.promise();
  }
  // Google Maps API geocoder object.
  var geocoder = new google.maps.Geocoder();
  // Reverse geocode the lat/lng.
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode(
      {'latLng': latlng},
      function(results, status) {
        if (status != google.maps.GeocoderStatus.OK) {
          switch (status) {
            case google.maps.GeocoderStatus.ZERO_RESULTS:
              deferred.reject(messages.get('geocode-reverse-zero'));
              break;
            case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
              deferred.reject(messages.get('geocode-reverse-limit'));
              break;
            case google.maps.GeocoderStatus.REQUEST_DENIED:
              deferred.reject(messages.get('geocode-reverse-deny'));
              break;
            case google.maps.GeocoderStatus.INVALID_REQUEST:
              deferred.reject(messages.get('geocode-reverse-reject'));
              break;
            default:
              deferred.reject(messages.get('geocode-reverse-error'));
          }
          return deferred.promise();
        }
        if (results === null || results.length == 0) {
          deferred.reject(messages.get('geocoder-no-info'));
          return deferred.promise();
        }
        // We want to get a collection of components in order.
        var types = [
            'neighborhood',
            'postal_town',
            'locality',
            'administrative_area_level_4',
            'administrative_area_level_3',
            'administrative_area_level_2',
            'administrative_area_level_1',
            'postal_code'];
        var address = Geocoder.extractAddress(lat, lng, types, results);
        if (address === '') {
          deferred.reject(messages.get('geocoder-no-info'));
        } else {
          // Pass the location and address back.
          deferred.resolve(lat, lng, address);
        }
      });
  return deferred.promise();
};


/**
  Extract address components from a list of results to try to get the best
  address we can.
  @param {number} lat The latitude we geocoded.
  @param {number} lng The longitude we geocoded.
  @param {Array<string>} componentTypes A list of the component types we want,
      in order from most to least detailed.
  @param {object} results The results of a Google Maps API call to geocode a
      lat/lng.
  @return {string} an address string made up of the two most detailed componets,
      and the two least detailed components.
*/
Geocoder.extractAddress = function(lat, lng, componentTypes, results) {
  // Mapping from type to name - so we know what components we have.
  var components = {};
  // Just a list of the acquired names - so we can avoid duplicates.
  var componentNames = [];
  // Scan all the results and all the address components for matches
  // with the desired types. Take the first match for any component and
  // save them in the addressXXX lists.
  for (var i = 0; i < results.length; i++) {
    // If the result is too far away, skip it, since it won't help shorten
    // the code anyway.
    if (Math.abs(lat - results[i].geometry.location.lat()) > 0.5 ||
        Math.abs(lng - results[i].geometry.location.lng()) > 0.5) {
      continue;
    }
    // Scan each of the components for this result.
    for (var j = 0; j < results[i].address_components.length; j++) {
      var addressComponent = results[i].address_components[j];
      // A component can have multiple types, so we need to check if this
      // includes one of the types we're interested in.
      for (var k = 0; k < addressComponent.types.length; k++) {
        // If we're interested in it, we don't already have that component,
        // we don't already have a component with the same name and it
        // doesn't include a comma, keep it.
        if (componentTypes.indexOf(addressComponent.types[k]) > -1 &&
            !(addressComponent.types[k] in components) &&
            componentNames.indexOf(addressComponent.long_name) == -1 &&
            addressComponent.long_name.indexOf(',') == -1) {
          componentNames.push(addressComponent.long_name);
          components[addressComponent.types[k]] = addressComponent.long_name;
        }
      }
    }
  }
  // Get up to two address components, starting at the most detailed level.
  var address = [];
  while (componentTypes.length > 0 && address.length < 2) {
    var type = componentTypes.shift();
    if (type in components) {
      address.push(components[type]);
    }
  }
  // Get up to two address components, starting at the least detailed level.
  var count = 0;
  while (componentTypes.length > 0 && count < 2) {
    var type = componentTypes.pop();
    if (type in components) {
      address.push(components[type]);
      count++;
    }
  }
  return address.join(', ');
};


/**
  Basic cache to store addresses from the geocoder to try to reduce the
  lookup frequency.
  @this SimpleCache
 */
function SimpleCache() {
  this.cache = {};
}

/**
  Check if a key exists in the cache.
  @param {string} key The key to check.
  @return {boolean} True if the key exists, otherwise false.
 */
SimpleCache.prototype.has = function(key) {
  return key in this.cache;
};


/**
  Get the value for a key.
  @param {string} key The key to retrieve.
  @return {*} The value or null if the key isn't present.
 */
SimpleCache.prototype.get = function(key) {
  return this.cache[key];
};


/**
  Put a key and value pair into the cache.
  @param {string} key The key.
  @param {*} value The value to place into the cache.
 */
SimpleCache.prototype.put = function(key, value) {
  this.cache[key] = value;
};


/**
  Class to handle the information panel at the bottom of the screen.
  @this InfoPanel
 */
function InfoPanel() {
}

/** Clear the information panel of everything except location quality. */
InfoPanel.clear = function() {
  InfoPanel.setHeadline('');
  InfoPanel.setDetail('');
  InfoPanel.setMessage('');
  InfoPanel.setGeocoderMessage('');
};


/** @param {string} msg Display the infopanel headline. */
InfoPanel.setHeadline = function(msg) {
  $('#infopanel').find('#headline').html(msg);
};


/** @param {string} msg Display the infopanel detail. */
InfoPanel.setDetail = function(msg) {
  $('#infopanel').find('#detail').html(msg);
};


/** @param {string} msg Display a message in the infopanel. */
InfoPanel.setMessage = function(msg) {
  $('#infopanel').find('#message').html(msg);
};


/** @param {string} msg Display a message from the geocoder in the infopanel. */
InfoPanel.setGeocoderMessage = function(msg) {
  $('#infopanel').find('#geocoder_messages').html(msg);
};


/** @param {string} msg Display the location quality in the infopanel. */
InfoPanel.setLocationQuality = function(msg) {
  $('#infopanel').find('#location_quality').html(msg);
};


/** Expand the display panel to the large size. */
InfoPanel.expand = function() {
  if (PlusCodes.getMobileDeviceType() == null) {
    // Desktop machines don't do the shrink/expand thing.
    return;
  }
  $('#additional_info').fadeIn();
  $('#infopanel').animate({height: 160}, 200);
  $('#map_container').animate({bottom: 160}, 200);
};


/** Shrink the display panel to the small size. */
InfoPanel.shrink = function() {
  if (PlusCodes.getMobileDeviceType() == null) {
    // Desktop machines don't do the shrink/expand thing.
    return;
  }
  $('#infopanel').animate(
      {height: 55},
      200,
      function() {
        $('#additional_info').fadeOut();
      });
  $('#map_container').animate({bottom: 55}, 200);
};


/** Toggle the size of the display panel. */
InfoPanel.toggle = function() {
  if ($('#infopanel').outerHeight() > 55) {
    InfoPanel.shrink();
  } else {
    InfoPanel.expand();
  }
};


/**
  Simple dialog class.
  @param {string} title The title to display in the dialog.
  @this Dialog
 */
function Dialog(title) {
  $('#dialog_title').html(title);
  $('#dialog_content').html('');
  this.setButton(messages.get('dialog-dismiss'), Dialog.dismiss);
}


/**
  Add message to the dialog.
  @param {string} message The message to display.
 */
Dialog.prototype.addMessage = function(message) {
  $('#dialog_content').append(message);
};


/**
  Add a list item to a dialog. List items are displayed in the order they
  were added.
  @param {string} message The message to display for the item.
  @param {*} callback The function to call when the list item is pressed.
 */
Dialog.prototype.addListItem = function(message, callback) {
  $('#dialog_content').append(
      '<div class="dialog_button">' + message + '</div>');
  $('#dialog_content').children().last().on('click', callback);
};


/**
  Set the button message and callback.
  @param {string} message The message to display on the button.
  @param {*} callback The function to call when the button is pressed.
 */
Dialog.prototype.setButton = function(message, callback) {
  $('#dialog_button').html(message);
  $('#dialog_button').off('click');
  $('#dialog_button').on('click', callback);
};


/** Display the dialog. */
Dialog.prototype.show = function() {
  if (PlusCodes.getMobileDeviceType() != null) {
    // Place it for mobile.
    $('#dialog').css('top', '25%');
    $('#dialog').css('left', '50%');
    $('#dialog').css('margin-left', '-150px');
    $('#dialog').width(300);
  } else {
    // Get the position of the navigate button, so we can put
    // the bottom of the dialog about there.
    var offset = $('#navigate_button').offset();
    var half_button = $('#navigate_button').width() / 2;
    // Set the position of the dialog.
    $('#dialog').css('left', (offset.left + half_button) + 'px');
    $('#dialog').css('bottom', $(window).height() - offset.top - half_button);
  }
  $('#dialog').fadeIn(200);
};


/** Dismiss the dialog. */
Dialog.dismiss = function() {
  $('#dialog').fadeOut(200);
};
