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
  Provide a Dialog class.

  Used to provide the same fadeIn/fadeOut functionality on all dialogs.
 */
function Dialog(id, jqueryContent, dismissCallback) {
  this.id = id;

  // Remove existing dialogs.
  $('#' + id + '-dialog').remove();
  $('#' + id + '-controls').remove();
  $('#' + id + '-fader').remove();
  // Add a fader - clicking on the fader will call the callback if passed,
  // or just dismisses the dialog.
  var fader = $('<div>').attr('id', id + '-fader').addClass('dialog-fader');
  if (typeof dismissCallback != 'undefined') {
    fader.click(dismissCallback);
  } else {
    var that = this;
    fader.click(function() {that.remove()});
  }
  $('body').append(fader);
  fader.fadeIn();
  // Add the control container (you'll have to populate them yourself).
  var controls = $('<div>').attr('id', id + '-controls')
      .addClass('dialog-controls');
  $('body').append(controls);
  $('#' + id + '-controls').fadeIn();

  var dialog = $('<section>').attr('id', id + '-dialog')
      .css('display', 'none')
      .addClass('dialog')
      .addClass('content')
      .append(jqueryContent);
  dialog.insertBefore($('#' + id + '-controls'));
  dialog.fadeIn('3000');
}

Dialog.prototype.addButton = function(jqueryObject) {
  $('#' + this.id + '-controls').append(jqueryObject);
  if (!isMobile()) {
    $('#' + this.id + '-controls').find('button')
        .mouseover(function() {$(this).addClass('highlight')})
        .mouseout(function() {$(this).removeClass('highlight')});
  }
};

Dialog.prototype.remove = function() {
  $('#' + this.id + '-controls').fadeOut(function() {$(this).remove()});
  $('#' + this.id + '-dialog').fadeOut(function() {$(this).remove()});
  $('#' + this.id + '-fader').fadeOut(function() {$(this).remove()});
};

Dialog.remove = function(id) {
  $('#' + id + '-controls').fadeOut(function() {$(this).remove()});
  $('#' + id + '-dialog').fadeOut(function() {$(this).remove()});
  $('#' + id + '-fader').fadeOut(function() {$(this).remove()});
};
