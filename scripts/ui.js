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

/** Functions for working with the UI elements. */

/** Class with objects for the main UI elements. */
function UiElements() {
  this.appbarElement = $('.app-bar');
  this.darkbgElement = $('.navdrawer-bg');
  this.mainMenuContainer = $('#main-menu');
  this.languageContainer = $('#language-menu');
  this.searchContainer = $('.search-container');
  this.mapContainer = $('.map');
  this.infoBox = $('.infobox');
  this.locationDialog = $('#location-dialog');
  this.locationNavBar = $('#location-nav-bar');
}

var ui;

/** Set up actions on UI elements. */
function setUpUI() {
  // Create global var for the UI elements.
  ui = new UiElements();

  $('#nav_google').click(menuHide);
  $('#nav_bing').click(menuHide);
  $('#nav_osm').click(menuHide);
  $('#nav_apple').click(menuHide);
  $('#nav_apps').click(menuHide);
  $('.nav_dismiss').click(menuHide);

  $('.infobox .pushpin-button').click(togglePushPin);

  $('#menu-button').click(uiClick);
  $('#search-button').click(uiClick);
  $('.bottom-bar > button').click(uiClick);
  $('#main-menu > .promote-layer > li').click(uiClick);
  $('#language-menu > .promote-layer > li').click(uiClick);

  // The dark shading used when showing the menu has a click action,
  // but normally it ignores clicks - it only receives them when it
  // has the open class applied.
  ui.darkbgElement.click(menuHide);

  // Use a mouseover event for button highlighting, because hover doesn't
  // work on mobile.
  if (!isMobile()) {
    $('button').mouseover(function() {$(this).addClass('highlight')});
    $('button').mouseout(function() {$(this).removeClass('highlight')});
  }
  if (navigator.userAgent.toLowerCase().indexOf('ipod') != -1 ||
      navigator.userAgent.toLowerCase().indexOf('iphone') != -1 ||
      navigator.userAgent.toLowerCase().indexOf('mac os') != -1) {
    $('<li>').append(
        $('<a>').attr('id', 'nav_apple'))
        .insertBefore($('#nav_discuss').closest('li'));
  }
  if (navigator.userAgent.toLowerCase().indexOf('android') != -1 ||
      navigator.userAgent.toLowerCase().indexOf('ipod') != -1 ||
      navigator.userAgent.toLowerCase().indexOf('iphone') != -1 ||
      navigator.userAgent.toLowerCase().indexOf('blackberry') != -1) {
    $('<li>').append(
        $('<a>').attr('id', 'nav_apps'))
        .insertBefore($('#nav_discuss').closest('li'));
  }
  loadText();
}

/** Load the localised text into the UI elements. */
function loadText() {
  // Set localised text into the UI
  $('#nav_help').text(messages.get('ui-help'));
  $('#nav_satellite').text(messages.get('ui-satellite'));
  $('#nav_language').text(messages.get('ui-language'));
  $('#nav_google').text(messages.get('google-maps'));
  $('#nav_bing').text(messages.get('bing-maps'));
  $('#nav_osm').text(messages.get('osm-maps'));
  $('#nav_discuss').text(messages.get('discuss'));
  $('#nav_github').text(messages.get('ui-github'));
  // nav_dismiss uses a class because there are two of them.
  $('.nav_dismiss').text(messages.get('dismiss'));

  $('#nav_apple').text(messages.get('apple-maps'));
  $('#nav_apps').text(messages.get('apps'));

  $('.search-input').attr('placeholder', messages.get('input-prompt'));
}


/** Handle a click on a UI element. */
function uiClick(e) {
  var clickedId = null;
  if ('target' in e) {
    clickedId = e.target.id;
  }
  if (clickedId === null) {
    return;
  }
  // Menu button.
  if (clickedId === 'menu-button') {
    menuShow();
  }
  // Search button.
  if (clickedId === 'search-button') {
    ui.searchContainer.toggleClass('open');
    if (ui.searchContainer.hasClass('open')) {
      $('.search-input').focus();
    } else {
      $('.search-input').blur();
    }
  }

  if (clickedId == 'location') {
    locationZoom();
  }
  if (clickedId == 'compass') {
    ui.mapContainer.toggleClass('hide');
    ui.infoBox.toggleClass('hide');
    if (ui.mapContainer.hasClass('hide')) {
      // Map is hidden, so compass should be revealed.
      compass.checkOperation();
    }
  }
  if (clickedId == 'nav_help') {
    menuHide();
    Help.start();
  }
  if (clickedId === 'nav_satellite') {
    // Change the map to/from satellite imagery.
    map.toggleImagery();
    menuHide();
  }
  if (clickedId === 'nav_language') {
    ui.mainMenuContainer.removeClass('open');
    ui.languageContainer.addClass('open');
  }
  if (clickedId.indexOf('lang_') == 0) {
    ui.languageContainer.removeClass('open');
    menuHide();
    // Change the language!
    var lang = clickedId.substr(5);
    if (messages.setLanguage(lang)) {
      loadText();
      if (displayedCode !== null) {
        displayCodeInformation();
        displayCodeMapCompass(displayedCode);
      }
    }
  }
}

/**
 * Update the location buttons classes depending on the visibility of the
 * code and user location.
 */
function updateLocationButton() {
  if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
    return;
  }
  if (displayedCode.code === null) {
    return;
  }
  var button = $('#location');

  var mapBounds = map.map.getBounds();
  // There's always a code.
  var codeCenter = new google.maps.LatLng(
      displayedCode.codeArea.latitudeCenter,
      displayedCode.codeArea.longitudeCenter);
  if (deviceLatLng === null) {
    // We don't have a location for the device, so we're done.
    button.removeClass('location-zoom');
    button.addClass('code-zoom');
    return;
  }
  var userLocation = new google.maps.LatLng(deviceLatLng[0], deviceLatLng[1]);
  // Now we have both locations, so we can decide what to do with them.
  // If they're both in view, zoom to the code, if the code is view zoom to
  // user, and if user is in view zoom to both.
  if (mapBounds.contains(userLocation) && mapBounds.contains(codeCenter)) {
    button.removeClass('location-zoom');
    button.addClass('code-zoom');
  } else if (mapBounds.contains(codeCenter)) {
    button.addClass('location-zoom');
    button.removeClass('code-zoom');
  } else {
    button.removeClass('location-zoom');
    button.removeClass('code-zoom');
  }
}

/** Set the destination URLs for all the alternative map providers. */
function setMapProviderUrls(lat, lng, code) {
  code = encodeURIComponent(code);
  if (typeof lat === 'undefined') {
    $('#nav_google').attr('href', null);
    $('#nav_bing').attr('href', null);
    $('#nav_osm').attr('href', null);
    $('#nav_apple').attr('href', null);
    $('#nav_apps').attr('href', null);
  } else {
    $('#nav_google').attr(
        'href',
        'https://www.google.com/maps/place/' + lat + ',' + lng + '/@' + lat +
        ',' + lng + ',17z');
    $('#nav_bing').attr(
        'href',
        'http://www.bing.com/maps/?v=2&cp=' + lat + '~' + lng +
        '&style=h&lvl=19&sp=Point.' + lat + '_' + lng + '_' + code + '___');
    //
    $('#nav_osm').attr(
        'href',
        'http://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lng +
        '&zoom=19');
    $('#nav_apple').attr(
        'href',
        'http://maps.apple.com/?daddr=' + lat + ',' + lng + '&ll=');
    $('#nav_apps').attr(
        'href', 'geo:0,0?q=' + lat + ',' + lng + '(' + code + ')');
  }
}

/** Show the main menu. */
function menuShow() {
  ui.appbarElement.addClass('open');
  ui.mainMenuContainer.addClass('open');
  ui.darkbgElement.addClass('open');
}

/** Hide the main menu - called after handling a click on a menu element. */
function menuHide() {
  ui.languageContainer.removeClass('open');
  ui.appbarElement.removeClass('open');
  ui.mainMenuContainer.removeClass('open');
  ui.darkbgElement.removeClass('open');
}

function locationPromptDisplay() {
  var dialog = new Dialog(
      'location', $('<p>').text(messages.get('location-prompt')),
      locationDismissCallback);
  dialog.addButton(
      $('<button>').addClass('dismiss').click(function() {
          locationDismissCallback();
      }));
}
function locationDismissCallback() {
  Dialog.remove('location');
  locationListener.getCurrentLocation();
}

function browserFeaturesDisplay() {
  var dialog = new Dialog(
      'browser', $('<section>').append($('<p>').html(messages.get('browser-problem-msg'))));
  dialog.addButton(
      $('<button>').addClass('dismiss').click(function() {
          dialog.remove();
      }));
}

function noLocationDisplay(code) {
  var dialog = new Dialog('nolocation',
      $('<section>').append($('<p>').html(messages.get('extend-failure-msg', {OLC: code}))));
  dialog.addButton(
      $('<button>').addClass('dismiss').click(function() {
          dialog.remove();
      }));
}

function compassCheckDisplay() {
  var table = $('<table>').append('<tr>')
      .append($('<td>').append($('<p>').html(messages.get('compass-check-msg'))))
      .append($('<td>').append('<span>').attr('id', 'compass_rotate_demo'));
  var dialog = new Dialog('compass', table);
  dialog.addButton(
      $('<button>').addClass('next').click(compassCheckNext));
}

function compassCheckNext() {
  if (compass.appearsGood()) {
    var dialog = new Dialog('compass',
        $('<p>').text(messages.get('compass-check-ok')));
  } else {
    var dialog = new Dialog('compass', $('<p>').html(messages.get('compass-check-fail-msg')));
  }
  dialog.addButton(
      $('<button>').addClass('dismiss').click(
          function() {Dialog.remove('compass')}));
}

/** User has entered a search. */
function searchEntered() {
  // Remove input focus so mobile keyboards hide themselves.
  document.querySelector('.search-input').blur();
  ui.searchContainer.removeClass('open');
  var input = document.querySelector('.search-input').value.trim();
  if (input === '') {
    return;
  }
  InfoBox.clear();
  // Split the input into a code, address, latLng and optional message.
  var fields = splitSearchInput(input);
  // Possible cases are:
  // 1. Short code with no address. We need to use the user location or map
  //    center.
  // 2. Full code with no address. Display.
  // 3. Short code with address. Need to geocode address, recover full code,
  //    then display.
  // 4. Full code with address. Just display the full code.
  // 5. Address only.
  // 6. LatLng only.
  // Work through the cases and compute what code to display.
  // drinckes
  var codeToDisplay = '';
  var recoveryLocation = getRecoveryLocation();
  // Case 1
  if (fields['short'] && !fields['address']) {
    if (recoveryLocation[0] === null) {
      // Got neither. Should show an error message!
      noLocationDisplay(fields['short']);
      return;
    } else {
      // Use our current location or map center to extend the short code.
      codeToDisplay = OpenLocationCode.recoverNearest(
          fields['short'], recoveryLocation[0], recoveryLocation[1]);
    }
  } else if (fields['full']) {
    // Case 2 & 4 - ignore the address.
    codeToDisplay = fields['full'];
  } else if (fields['latLng']) {
    latLng = fields['latLng'].split(',');
    codeToDisplay = OpenLocationCode.encode(
        parseFloat(latLng[0]), parseFloat(latLng[1]));
  }
  // Do we have a code to display? Because we can display it.
  if (codeToDisplay) {
    displayedCode.setCode(codeToDisplay);
    displayedCode.setUrl();
    displayedCode.is_pinned = true;
    pushPushPin();
    displayCodeInformation();
    displayCodeMapCompass();
    zoomToCode();
  } else {
    // If not, we must be in case 3 or 5.
    $.when(
        // Geocode the address. Pass the recovery location just in case.
        Geocoder.geocodeAddress(
            fields['address'], recoveryLocation[0], recoveryLocation[1])
    ).then(
        function(address, lat, lng) {
          // If we only had an address, use the passed lat and lng.
          if (!fields['short']) {
            codeToDisplay = OpenLocationCode.encode(lat, lng);
          } else {
            try {
              // Use the location to recover the short code.
              codeToDisplay = OpenLocationCode.recoverNearest(
                  fields['short'], lat, lng);
            } catch (e) {
              return;
            }
          }
          if (codeToDisplay) {
            displayedCode.is_pinned = true;
            pushPushPin();
            displayedCode.setCode(codeToDisplay);
            displayedCode.setUrl();
            displayCodeInformation();
            displayCodeMapCompass();
            zoomToCode();
          }
        },
        function(error) {
          // Use jQuery to escape the error message to prevent XSS.
          var escapedError = $("<div>").text(error).html();
          InfoBox.setPanel(
              '<span><p class="message">' + escapedError + '</p></span>');
        }
    );
  }
}

/** Toggle the push pin. */
function togglePushPin() {
  $('.infobox .pushpin-button').toggleClass('pushed');
  displayedCode.is_pinned = $('.infobox .pushpin-button').hasClass('pushed');
  receiveMapBoundsEvent();
}

function pushPushPin() {
  $('.infobox .pushpin-button').addClass('pushed');
}
