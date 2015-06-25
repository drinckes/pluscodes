
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
Help.dialog = null;

Help.start = function() {
  Help.currentPage = 1;
  Help.dialog = new Dialog('help', $('<section>').html(Help.getPageContent()));
  Help.dialog.addButton($('<button>').addClass('previous').click(Help.clicked));
  Help.dialog.addButton($('<button>').addClass('dismiss').click(Help.clicked));
  Help.dialog.addButton($('<button>').addClass('next').click(Help.clicked));
  // Hide the previous button.
  $('#help-controls').find('.previous').off('click');
  $('#help-controls').find('.previous').addClass('hide');
};

Help.clicked = function(e) {
  if ($(this).hasClass('previous') && Help.currentPage > 1) {
    Help.currentPage -= 1;
  } else if ($(this).hasClass('next') && Help.currentPage < Help.numPages) {
    Help.currentPage += 1;
  } else if ($(this).hasClass('dismiss')) {
    Dialog.remove('help');
    return;
  }
  Help.adjustVisibility();
  $('#help-dialog').fadeOut(function() {
      $(this).html(Help.getPageContent());
      $(this).fadeIn();
  });
};

Help.adjustVisibility = function() {
  // Default to display all the buttons.
  $('#help-controls button').off('click');
  $('#help-controls button').click(Help.clicked);
  $('#help-controls button').removeClass('hide');
  if (Help.currentPage == 1) {
    // Hide the previous button on the first help page.
    $('#help-controls .previous').off('click');
    $('#help-controls .previous').addClass('hide');
  } else if (Help.currentPage == Help.numPages) {
    // Hide the next button on the last help page.
    $('#help-controls .next').off('click');
    $('#help-controls .next').addClass('hide');
  }
};

Help.getPageContent = function() {
  var content = "";
  for (var i = 0; i <= 9; i++) {
    var section = messages.get('help-0' + Help.currentPage + '-' + i);
    if (section === null) {
      break;
    }
    content += section;
  }
  return content;
};
