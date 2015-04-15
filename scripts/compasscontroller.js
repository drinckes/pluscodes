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
  @this CompassController
 */
function CompassController(compassElement) {
  // DOM element containing the compass.
  this.compassElement = compassElement;
  // The origin location as [lat, lng].
  this.origin = null;
  // The destination location as [lat, lng]. (If null, display nothing.)
  this.destination = null;
  // Current compass heading out of the top of the device.
  this.deviceHeading = 0;
  // Compass display object.
  this.compassDisplay = null;
  // Log the compass readings received in 5 deg buckets. Used to see
  // if the compass is actually working.
  this.readingBuckets = {};
  this.bucketCount = 0;
}

// Number of compass buckets required to be valid.
CompassController._VALID_THRESHOLD = 40;
// Key for local storage.
CompassController.COMPASS_VALID = 'plus.codes.compass.valid';

/** Returns if orientation is supported by this browser/device. */
CompassController.prototype.isSupported = function() {
  return 'DeviceOrientationEvent' in window;
};

/** Returns if orientation data appears good. */
CompassController.prototype.appearsGood = function() {
  if (this.bucketCount >= CompassController._VALID_THRESHOLD) {
    return true;
  }
  return false;
};

/** Returns if a VALID compass has been previously registered. */
CompassController.prototype.hasReceived = function() {
  return DataStore.has(CompassController.COMPASS_VALID);
};

/**
  Set up the compass controller.
  @return {boolean} True if the browser supports deviceorientation event.
 */
CompassController.prototype.initialise = function() {
  // Add the elements within the container.
  this.canvas = document.createElement('canvas');
  this.canvas.classList.add('compass-base-canvas');
  this.compassElement.appendChild(this.canvas);

  // Get minimum of the height or width of the compass element.
  var dim = Math.min(this.compassElement.offsetWidth,
                     this.compassElement.offsetHeight);
  dim = Math.min(dim, 800) - 20;
  this.canvas.height = dim;
  this.canvas.width = dim;

  this.origin = null;
  this.deviceHeading = 0;
  this.targetCode = null;
  this.targetArea = null;
  this.compassDisplay = new CompassDisplay(
      this.canvas, '#888888', '#f06292', '#ffffff');
  // Register for compass update events.
  var that = this;
  window.addEventListener('deviceorientation',
      function(e) { that._receiveOrientationUpdate(e);}, false);
  return true;
};

/**
 * Called when displaying the compass. Checks if it works, and if not,
 * walks the user through the validation steps.
 */
CompassController.prototype.checkOperation = function() {
  if (DataStore.has(CompassController.COMPASS_VALID)) {
    return;
  }
  compassCheckDisplay();
};

/**
 * Show direction and distance information from one position to another.
 */
CompassController.prototype.setPoints = function(
    fromLat, fromLng, toLat, toLng) {
  this.origin = [fromLat, fromLng];
  if (toLat != null && toLng != null) {
    this.destination = [toLat, toLng];
  } else {

    this.destination = [fromLat, fromLng];
  }
  this._updateDisplay();
};

/**
  Handle an orientation update.
  @param {object} event A deviceorientation event.
 */
CompassController.prototype._receiveOrientationUpdate = function(event) {
  if (event.absolute === true && event.alpha !== null) {
    var heading = 0;
    //Check for iOS property
    if (event.webkitCompassControllerHeading) {
      heading = event.webkitCompassControllerHeading;
    } else {
      // Android Chrome, FF and Opera all report the heading
      // as a mirror of the real world.
      heading = 360 - event.alpha;
    }
    // Save the heading in a bucket and update the storage.
    var roundedHeading = Math.round(heading);
    if (this.bucketCount < CompassController._VALID_THRESHOLD &&
        !(roundedHeading in this.readingBuckets)) {
      this.readingBuckets[Math.round(heading)] = true;
      this.bucketCount++;
      if (this.bucketCount >= CompassController._VALID_THRESHOLD) {
        DataStore.putString(CompassController.COMPASS_VALID, 'true');
      }
    }
    if (heading - this.deviceHeading > 180) {
      this.deviceHeading = this.deviceHeading + 360;
    } else if (this.deviceHeading - heading > 180) {
      heading = heading + 360;
    }
    // Low-pass filter for heading.
    heading = this.deviceHeading + 0.25 * (heading - this.deviceHeading);
    heading = heading % 360;
    if (this.deviceHeading === null ||
        Math.abs(heading - this.deviceHeading) > 1) {
      this.deviceHeading = heading;
      this._updateDisplay();
    }
  }
};

/** Display distance and heading to target. */
CompassController.prototype._updateDisplay = function() {
  if (this.origin === null) {
    $('#compass_distance').html(messages.get('waiting-location'));
    return;
  }
  if (this.destination === null) {
    return;
  }
  var distance = CompassController._earthDistance(
      this.origin[0], this.origin[1],
      this.destination[0], this.destination[1]);
  var units;
  if (distance > 5000) {
    distance = Math.round(distance / 1000);
    units = messages.get('units-km');
  } else if (distance > 1000) {
    distance = Math.round(distance / 100) / 10;
    units = messages.get('units-km');
  } else {
    distance = Math.round(distance);
    units = messages.get('units-meters');
  }
  var bearing = CompassController._bearingTo(
      this.origin[0], this.origin[1],
      this.destination[0], this.destination[1]);
  bearing = CompassController._getBearingFromDevice(
      this.deviceHeading, bearing);
  this.compassDisplay.display(bearing, distance, units);
};

/**
  Compute distance between two locations.
  @param {number} lat1 The latitude of the first location.
  @param {number} lng1 The longitude of the first location.
  @param {number} lat2 The latitude of the second location.
  @param {number} lng2 The longitude of the second location.
  @return {number} The distance between locations in meters.
 */
CompassController._earthDistance = function(lat1, lng1, lat2, lng2) {
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

/**
 Compute bearing from one location to another.
  @param {number} lat1 The latitude of the first location.
  @param {number} lng1 The longitude of the first location.
  @param {number} lat2 The latitude of the second location.
  @param {number} lng2 The longitude of the second location.
  @return {number} The bearing from the first location to the second.
 */
CompassController._bearingTo = function(lat1, lng1, lat2, lng2) {
  var toRadians = Math.PI / 180;
  var lat1Rad = lat1 * toRadians;
  var lat2Rad = lat2 * toRadians;
  var lngDiff = (lng2 - lng1) * toRadians;
  var y = Math.sin(lngDiff) * Math.cos(lat2Rad);
  var x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
          Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lngDiff);
  var theta = Math.atan2(y, x);
  return ((theta * 180 / Math.PI) + 360) % 360;
};

/**
  Given an absolute bearing and the bearing of the device, work out the
  bearing relative to the device.
  @param {number} deviceBearing The bearing the device is pointing in.
  @param {number} targetBearing The bearing to the target location.
  @return {number} the bearing relative to the device heading to the target.
 */
CompassController._getBearingFromDevice = function(
    deviceBearing, targetBearing) {
  // TODO: It would be nice to correct this based on mobile device orientation.
  // A landscape Android device doesn't change the axis used for the device
  // orientation, but for the user, it's changed by 90 degrees.
  return (targetBearing - deviceBearing + 360) % 360;
};
