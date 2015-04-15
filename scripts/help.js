
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
  Class to display the help pages. We expand a div up from the bottom, and
  then fade the content in and out. Tapping on the screen advances the help
  page, and there's a "got it" link at the bottom to dismiss.
 */
function Help() {
}
Help.numPages = 3;
Help.currentPage = 1;

Help.start = function() {
  Help.currentPage = 1;
  var dialog = new Dialog('help',
      $('<section>').html(messages.get('help-01')));
  dialog.addButton($('<button>').addClass('previous').click(Help.clicked));
  dialog.addButton($('<button>').addClass('dismiss').click(Help.clicked));
  dialog.addButton($('<button>').addClass('next').click(Help.clicked));
  // Hide the previous button.
  $('#help-controls').find('.previous').addClass('hide');
};

Help.clicked = function(e) {
  if ($(this).hasClass('previous')) {
    Help.currentPage -= 1;
  } else if ($(this).hasClass('next')) {
    Help.currentPage += 1;
  } else if ($(this).hasClass('dismiss')) {
    Dialog.remove('help');
    return;
  }

  if (Help.currentPage == 1) {
    $('#help-controls .previous').addClass('hide');
  } else if (Help.currentPage == Help.numPages) {
    $('#help-controls .next').addClass('hide');
  } else {
    $('#help-controls button').removeClass('hide');
  }
  Help.display(Help.currentPage);
};

Help.display = function(pageNumber) {
  Help.currentPage = pageNumber;
  $('#help-dialog').fadeOut(function() {$(this).remove()});
  // Create a new content container.
  var dialog = $('<section>')
      .attr('id', 'help-dialog')
      .addClass('dialog')
      .addClass('content')
      .html(messages.get('help-0' + Help.currentPage)).css('display', 'none');
  dialog.insertBefore($('#help-controls'));
  $(dialog).fadeIn();
};
