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
  Class to handle the information panel at the bottom of the screen.
  @this InfoPanel
 */
function InfoBox() {
}

InfoBox.clear = function() {
  $('.infobox-panels').empty().append($('<div>').addClass('panel'));
};

InfoBox.setPanel = function(html) {
  $('.infobox-panels .panel').html(html);
};

/** Add content for another panel after existing panels. */
InfoBox.fadeToPanel = function(html) {
  // Fade out the existing panel and remove it.
  $('.infobox-panels .panel').fadeOut(function() {$(this).remove()});
  // Create the panel.
  var panel = $('<div>').addClass('panel').html(html)
      .click(InfoBox.nextPanel).css('display', 'none');
  $('.infobox-panels').append(panel);
  $('.infobox-panels .panel:last').fadeIn();
};
