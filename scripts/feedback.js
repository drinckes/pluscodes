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
 * Get, cache and send feedback when connected.
 */
function Feedback() {}

Feedback.FEEDBACK_PREFIX = 'pending_feedback_';
Feedback.MAX_FEEDBACKS = 9;
Feedback.BUSY = false;

/**
 * Save feedback into the datastore.
 *
 * The datastore doesn't permit duplicates, so we use the FEEDBACK_PREFIX
 * followed by a number to store feedback. At most we allow 10 pending
 * feedbacks.
 *
 * @param deviceLat The latitude of the device, could be null.
 * @param deviceLng The longitude of the device, could be null.
 * @param code The currently displayed code, could be null.
 * @param address The currently displayed short code and address. Could be null.
 * @param compassFunction true if the compass looks ok, false otherwise.
 * @param lang The current language setting.
 * @param comment The comment from the user, truncated to 1024 chars.
 */
Feedback.storeFeedback = function(deviceLat, deviceLng, code, address, mapFunction, compassFunction, lang, comment) {
  // Do we have the maximum pending feedbacks?
  if (DataStore.has(Feedback.FEEDBACK_PREFIX + Feedback.MAX_FEEDBACKS)) {
    return;
  }
  // Feedback format is a string concat of all the information.
  // We have to do this so we can store it in the data store or as a cookie
  // until we can send it.
  var feedback = '';
  feedback += deviceLat + ':' + deviceLng + ':';
  feedback += mapFunction + ':';
  feedback += compassFunction + ':';
  feedback += lang + ':';
  feedback += $(window).height() + ':' + $(window).width() + ':';
  feedback += code + ':';
  feedback += encodeURIComponent(address) + ':';
  feedback += encodeURIComponent(comment.substr(0, 1024)) + ':';
  for (var i = 0; i <= Feedback.MAX_FEEDBACKS; i++) {
    if (!DataStore.has(Feedback.FEEDBACK_PREFIX + i)) {
      DataStore.putString(Feedback.FEEDBACK_PREFIX + i, feedback);
      break;
    }
  }
  Feedback.sendFeedback();
};

/** Try to send a feedback item. If successful remove it from the datastore. */
Feedback.sendFeedback = function() {
  if (Feedback.FEEDBACK_BUSY) {
    return;
  }
  var hasPendingFeedback = false;
  for (var i = Feedback.MAX_FEEDBACKS; i >= 0; i--) {
    if (DataStore.has(Feedback.FEEDBACK_PREFIX + i)) {
      hasPendingFeedback = true;
      Feedback.FEEDBACK_BUSY = true;
      var fields = DataStore.get(Feedback.FEEDBACK_PREFIX + i).split(':');
      // Try to send it asynchronously with jquery AJAX.
      var request = $.ajax({
        url: 'http://feedback.plus.codes/feedback.php',
        type: 'POST',
        data: {
                lat: fields[0],
                lng: fields[1],
                map: fields[2],
                compass: fields[3],
                lang: fields[4],
                height: fields[5],
                width: fields[6],
                code: fields[7],
                address: decodeURIComponent(fields[8]),
                comment: decodeURIComponent(fields[9]),
                ua: navigator.userAgent},
        dataType: 'text',
        statusCode: {
          404: function() {
            DataStore.clear(Feedback.FEEDBACK_PREFIX + i);
          }
        }
      });

      request.done(function(msg) {
        Feedback.FEEDBACK_BUSY = false;
        DataStore.clear(Feedback.FEEDBACK_PREFIX + i);
      });

      request.fail(function(jqXHR, textStatus) {
        Feedback.FEEDBACK_BUSY = false;
      });
      break;
    }
  }
  if (hasPendingFeedback) {
    setTimeout(Feedback.sendFeedback, 10000);
  }
}
