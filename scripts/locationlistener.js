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
 * The Location class detects and listens to the device's location.
 *
 * @param {Function} userLocationHandler A method to call when a location is
 * received.
 */
function LocationListener(userLocationHandler) {
  this.userLocationHandler = userLocationHandler;
}

LocationListener.LOCATION_RECEIVED = 'plus.codes.location.received';

/** Returns if location is supported by this browser/device. */
LocationListener.prototype.isSupported = function() {
  return 'geolocation' in navigator;
};

/** Returns if location has been previously received on this browser/device. */
LocationListener.prototype.hasReceived = function() {
  if (DataStore.get(LocationListener.LOCATION_RECEIVED) != null) {
    return true;
  }
  return false;
};

/**
 * Self calling method to request the location. This uses
 * geolocation.getCurrentPosition in preference to watchPosition so that
 * if we lose location signals, we can detect it.
 */
LocationListener.prototype.getCurrentLocation = function() {
  var that = this;
  navigator.geolocation.getCurrentPosition(
      function(position) {
        DataStore.putString(LocationListener.LOCATION_RECEIVED, 'true');
        try {
          that.userLocationHandler(
              position.coords.latitude, position.coords.longitude,
              position.coords.accuracy);
        } catch (e) {
        }
        // Call this again in five seconds.
        setTimeout(function() {that.getCurrentLocation()}, 5000);
      },
      function(error) {
        // Got an error from the location system.
        // Call this again in five seconds.
        setTimeout(function() {that.getCurrentLocation()}, 5000);
      },
      {timeout: 30000, enableHighAccuracy: true});
};
