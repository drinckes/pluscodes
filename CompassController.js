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
function CompassController() {
  // Javascript object (array) with the latitude and longitude
  // of this device.
  this.currentLatLng = null;
  // Current compass heading out of the top of the device.
  this.deviceHeading = 0;
  // Code to display distance and heading to. (If null, don't display.)
  this.targetCode = null;
  this.targetArea = null;
  // Compass display object.
  this.compassDisplay = null;
  // Log the compass readings received in 5 deg buckets. Used to see
  // if the compass is actually working.
  this.readingBuckets = {};
  // If doing a compass check, log the start time.
  this.validationStartTime = 0;
}

/**
  Set up the compass controller.
  @param {string} code The initial target code. Can be empty.
  @return {boolean} True if the browser supports deviceorientation event.
 */
CompassController.prototype.initialise = function(code) {
  if (!window.DeviceOrientationEvent) {
    return false;
  }
  this.currentLatLng = null;
  this.deviceHeading = 0;
  this.targetCode = null;
  this.targetArea = null;
  this.compassDisplay = new CompassDisplay(
      'base_canvas', 'indicator_canvas', '#888888', '#ffffff', '#ffffff');
  // Register for compass update events.
  var that = this;
  window.addEventListener('deviceorientation',
      function(e) { that.handleOrientationUpdate(e);}, false);
  if (code != '') {
    this.setTargetCode(code);
  }
  return true;
};

/**
  Display a code that has been manually entered.
  @param {string} code A full OLC code.
*/
CompassController.prototype.setTargetCode = function(code) {
  this.targetCode = code;
  this.targetArea = OpenLocationCode.decode(code);
  this.displayTargetInfo();
};

/** Handle a click on the current location button. */
CompassController.prototype.handleHereClick = function() {
  var code = OpenLocationCode.encode(currentLatLng[0], currentLatLng[1]);
  this.targetCode = null;
  $('#compass_distance').html('');
  window.removeEventListener(
      'deviceorientation', CompassController.handleOrientationUpdate);
  CompassController.rotateCompassControllerTo(0);
};

/**
  Handle a location update from the location system.
  @param {number} lat The latitude.
  @param {number} lng The longitude.
 */
CompassController.prototype.handleLocationUpdate = function(lat, lng) {
  this.currentLatLng = [lat, lng];
  this.displayTargetInfo();
};

/**
  Handle an orientation update.
  @param {object} event A deviceorientation event.
 */
CompassController.prototype.handleOrientationUpdate = function(event) {
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
    // Save the heading in a bucket.
    this.readingBuckets[Math.round(heading)] = true;
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
      this.displayTargetInfo();
    }
  }
};

/** Display distance and heading to target. */
CompassController.prototype.displayTargetInfo = function() {
  if (this.currentLatLng === null) {
    $('#compass_distance').html(messages.get('waiting-location'));
    return;
  }
  if (this.targetCode === null) {
    return;
  }
  var distance = CompassController.earthDistance(
      this.currentLatLng[0], this.currentLatLng[1],
      this.targetArea.latitudeCenter, this.targetArea.longitudeCenter);
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
  var bearing = CompassController.bearingTo(
      this.currentLatLng[0], this.currentLatLng[1],
      this.targetArea.latitudeCenter, this.targetArea.longitudeCenter);
  bearing = CompassController.getBearingFromDevice(this.deviceHeading, bearing);
  this.compassDisplay.display(bearing, distance, units);
};

/** If the compass doesn't seem to be working, show a message. */
CompassController.prototype.validate = function() {
  if ('localStorage' in window && window['localStorage'] !== null) {
    // Have we passed this check before?
    var compass_valid = localStorage.getItem('CompassController.compass_valid');
    if (compass_valid === 'valid') {
      // Log the user agent with the fact that we think it's ok.
      $.get('compassStatus?previouslyOk=1');
      return;
    }
  }
  var bucketCount = 0;
  for (var prop in this.readingBuckets) {
    bucketCount++;
  }
  if (bucketCount < 40) {
    var dialog = new Dialog(messages.get('compass-check'));
    dialog.addMessage(messages.get('compass-check-msg'));
    this.validationStartTime = $.now();
    var that = this;
    dialog.setButton(messages.get('compass-check-turned'),
        function() { that.validateFinished() });
    dialog.show();
  } else {
    // If we can, save that the compass is ok.
    $.get('compassStatus?detection=1&buckets=' + bucketCount);
    if ('localStorage' in window && window['localStorage'] !== null) {
      localStorage['CompassController.compass_valid'] = 'valid';
    }
  }
};

/** User claims they've turned around. Check the compass buckets. */
CompassController.prototype.validateFinished = function() {
  if ($.now() - this.validationStartTime < 3000) {
    var dialog = new Dialog(messages.get('compass-check-fast'));
    dialog.addMessage(messages.get('compass-check-fast-msg'));
    var that = this;
    dialog.setButton(messages.get('compass-check-turned'),
        function() { that.validateFinished() });
    dialog.show();
    return;
  }

  var bucketCount = 0;
  for (var prop in this.readingBuckets) {
    bucketCount++;
  }
  // Log the user agent with the fact that we think it's ok.
  // Different devices and browsers support the compass reading inconsistently,
  // and there doesn't seem to be a good resource of which ones do and don't.
  // The useragent identifies the device and browser, both of which we already
  // have from the page load, so there's no personally identifying information
  // here.
  if (bucketCount < 40) {
    $.get('compassStatus?detection=0&buckets=' + bucketCount);
    var dialog = new Dialog(messages.get('compass-check-fail'));
    dialog.addMessage(messages.get('compass-check-fail-msg'));
    dialog.show();
  } else {
    $.get('compassStatus?detection=1&buckets=' + bucketCount);
    // If we can, save that the compass is ok.
    if ('localStorage' in window && window['localStorage'] !== null) {
      localStorage['CompassController.compass_valid'] = 'valid';
    }
    var dialog = new Dialog(messages.get('compass-check'));
    dialog.addMessage(messages.get('compass-check-ok'));
    dialog.show();
  }
};

/**
  Compute distance between two locations.
  @param {number} lat1 The latitude of the first location.
  @param {number} lng1 The longitude of the first location.
  @param {number} lat2 The latitude of the second location.
  @param {number} lng2 The longitude of the second location.
  @return {number} The distance between locations in meters.
 */
CompassController.earthDistance = function(lat1, lng1, lat2, lng2) {
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
CompassController.bearingTo = function(lat1, lng1, lat2, lng2) {
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
CompassController.getBearingFromDevice = function(
    deviceBearing, targetBearing) {
  // TODO: It would be nice to correct this based on mobile device orientation.
  // A landscape Android device doesn't change the axis used for the device
  // orientation, but for the user, it's changed by 90 degrees.
  return (targetBearing - deviceBearing + 360) % 360;
};
