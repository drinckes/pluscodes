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
  Display a compass indicator in the screen, and allow it to be controlled.
  @param {string} base_canvas_id DOM ID of the base canvas with text etc.
  @param {string} indicator_canvas_id DOM ID of the canvas for the indicator.
  @param {string} outline_color Web color spec for the compass outline.
  @param {string} indicator_color Web color spec for the compass indicator.
  @param {string} text_color Web color spec for the text.
  @this CompassDisplay
 */
function CompassDisplay(
    base_canvas_id, indicator_canvas_id, outline_color,
    indicator_color, text_color) {
  this.base_canvas = $('#' + base_canvas_id);
  this.indicator_canvas = $('#' + indicator_canvas_id);
  this.indicator_color = indicator_color;
  this.text_color = text_color;
  // Set the size here? Or previously?
  // Get the width and height so we can use it later.
  this.canvas_width = this.base_canvas[0].width;
  this.canvas_height = this.base_canvas[0].height;
  this.compass_radius = this.canvas_width / 2 - 20;

  // Draw the compass ring.
  var context = this.base_canvas[0].getContext('2d');
  context.beginPath();
  context.arc(
      this.canvas_width / 2,
      this.canvas_height / 2,
      this.compass_radius,
      0,
      2 * Math.PI,
      false);
  context.lineWidth = 2;
  context.strokeStyle = outline_color;
  context.stroke();

  context = this.indicator_canvas[0].getContext('2d');
  // Draw the top line (large!)
  context.font = 'bold 20pt Arial,sans-serif';
  context.textAlign = 'center';
  context.fillStyle = this.text_color;
  context.fillText(
      messages.get('waiting-for-compass-1'),
      this.canvas_width / 2,
      this.canvas_height / 2 - 15);
  // Second line, font slightly smaller.
  context.font = 'bold 20pt Arial,sans-serif';
  context.fillText(
      messages.get('waiting-for-compass-2'),
      this.canvas_width / 2,
      this.canvas_height / 2 + 15);
}

/**
  Display an indicator at an angle in degrees, where 0 is straight out the
  top of the device.
  @param {number} angle The angle to the indicator.
  @param {string} text1 The upper text to display.
  @param {string} text2 The lower text to display.
 */
CompassDisplay.prototype.display = function(angle, text1, text2) {
  // Adjust the angle and convert to radians.
  angle = angle - 90;
  var start = (angle - 10) * (Math.PI / 180);
  var end = (angle + 10) * (Math.PI / 180);

  var context = this.indicator_canvas[0].getContext('2d');
  context.clearRect(0, 0, this.canvas_width, this.canvas_height);
  context.beginPath();
  context.arc(
      this.canvas_width / 2,
      this.canvas_height / 2,
      this.compass_radius,
      start,
      end,
      false);
  context.lineWidth = 35;
  context.strokeStyle = this.indicator_color;
  context.stroke();
  // Draw the top line (large!)
  context.font = 'bold 60pt Arial,sans-serif';
  context.textAlign = 'center';
  context.fillStyle = this.text_color;
  context.fillText(text1, this.canvas_width / 2, this.canvas_height / 2 - 15);
  // Second line, font slightly smaller.
  context.font = 'bold 40pt Arial,sans-serif';
  context.fillText(text2, this.canvas_width / 2, this.canvas_height / 2 + 35);
};
