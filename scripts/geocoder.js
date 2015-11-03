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

/** Provide functions to interact with a geocoder API. */
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
    deferred.reject(messages.get('geocode-not-loaded', {ADDRESS: address}));
  } else if (address === '') {
    deferred.resolve(address, fallbackLat, fallbackLng);
  } else {
    // Google Maps API geocoder object.
    var geocoder = new google.maps.Geocoder();
    // Send the address off to the geocoder.
    geocoder.geocode(
        {'address': address, 'language': messages.language},
        function(results, status) {
          if (status != google.maps.GeocoderStatus.OK) {
            deferred.reject(
                messages.get('geocode-fail', {ADDRESS: address}));
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
  // Reverse geocode the lat/lng, rounding the coordinates or
  // sometimes the reverse lookups fail.
  var latlng = new google.maps.LatLng(
      Math.round(lat * 1E10) / 1E10,
      Math.round(lng * 1E10) / 1E10);
  geocoder.geocode(
      {'latLng': latlng, 'language': messages.language},
      function(results, status) {
        if (status != google.maps.GeocoderStatus.OK) {
          deferred.reject(messages.get('geocode-reverse-fail'));
          return deferred.promise();
        }
        if (results === null || results.length == 0) {
          deferred.reject(messages.get('geocoder-no-info'));
          return deferred.promise();
        }
        // We want to get a collection of components in order.
        // Including postcode can make shortening dependent on it.
        var types = [
            'postal_town',
            'locality',
            'administrative_area_level_4',
            'administrative_area_level_3',
            'administrative_area_level_2',
            'administrative_area_level_1'];
        var address = Geocoder.__extractAddress(lat, lng, types, results);
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
  @return {string} an address string made up of a detailed component,
      the post code and the least detailed component.
*/
Geocoder.__extractAddress = function(lat, lng, componentTypes, results) {
  // Mapping from type to name - so we know what components we have.
  var components = {};
  var postal_code = '';
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
            addressComponent.long_name.indexOf(',') == -1) {
          components[addressComponent.types[k]] = addressComponent.long_name;
        }
        if (addressComponent.types[k] == "postal_code") {
          postal_code = addressComponent.long_name;
        }
      }
    }
  }
  // Get one address component, starting at the most detailed level.
  var address = [];
  while (componentTypes.length > 0) {
    var type = componentTypes.shift();
    if (type in components) {
      address.push(components[type]);
      break;
    }
  }
  if (postal_code != '') {
    address.push(postal_code);
  }
  // Get one address component, starting at the least detailed level.
  while (componentTypes.length > 0) {
    var type = componentTypes.pop();
    if (type in components) {
      address.push(components[type]);
      break;
    }
  }
  return address.join(', ');
};
