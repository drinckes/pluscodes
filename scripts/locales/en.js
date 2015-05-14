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
 * English language messages file. If in doubt, uses en-GB spelling.
 * Creates an entry "en" in the messages dict. Each message consists of an ID,
 * and an object with the message, a description which is only relevant to
 * translators (other languages need not include the description attribute).
 *
 * The message may have placeholders for data which will be inserted into them.
 * Placeholders should not be translated, are uppercase and enclosed in "$" e.g.
 * "$ADDRESS$".
 *
 * Some placeholders have default values defined for them. These will be
 * inserted into the message when it is fetched. They are defined with the
 * "placeholders" object, listing each value and defining the content. The
 * content may be changed in other languages, for example to change an example
 * OLC code used in the help text to one more relevant.
 */
LocalisedMessages["en"] = {
  "input-prompt": {
    "message": "Enter a plus+code, address or drag the map",
    "description": "Text to display in the search box to tell a user how to interact with the application"
  },
  "map-error": {
    "message": "Cannot load Google Maps. Make sure you have a working network and try reloading the page.<br/><br/>You can enter enter plus+codes with or without the area code, and use the compass, but you will not be able to enter addresses, or plus+codes with addresses, until maps are displayed.",
    "description": "Message to display when Google Maps can't be loaded"
  },
  "browser-problem-msg": {
    "message": "The browser you are using does not support all the features we need, such as location and compass.<br/><br/>We recommend using to Chrome, Firefox or Opera.",
    "description": "Message to show when the browser doesn't support location or orientation"
  },
  "geocoder-no-info": {
    "message": "Google's geocoder service has no address information in this area. You might be able to use a plus+code with the name of a large town, if there is one within 40km.",
    "description": "If Google can't find any location name in the area"
  },
  "extend-failure-msg": {
    "message": "<p>To work out where $OLC$ is, we need your current location, or you need to include a town or city in the information.<br/><br/>Check that your browser is allowing location, and that location services are enabled on your device.</p>",
    "description": "Shown when the user location cannot be determined"
  },
  "geocode-not-loaded": {
    "message": "Google's address service is not loaded, can't locate $ADDRESS$.",
    "description": "The address the user entered cannot be located, because the Google geocoding service isn't loaded"
  },
  "geocode-fail": {
    "message": "Google's address service can't locate $ADDRESS$.",
    "description": "The address the user entered cannot be located"
  },
  "geocode-reverse-fail": {
    "message": "Could not get any locality information (Google's geocoder service had an error)",
    "description": "Google returned no address information for the location shown because the service had an unspecified error"
  },
  "google-maps": {
    "message": "Google Maps",
    "description": "Menu entry to link to see the current location in Google Maps"
  },
  "osm-maps": {
    "message": "Open Street Map",
    "description": "Menu entry to link to see the current location in Open Street Map"
  },
  "bing-maps": {
    "message": "Bing Maps",
    "description": "Menu entry to link to see the current location in Bing Maps"
  },
  "apple-maps": {
    "message": "Apple Maps",
    "description": "Menu entry to link to see the current location in Apple Maps"
  },
  "apps": {
    "message": "Apps",
    "description": "Menu entry to link to see the current location in a smartphone app. The phone should display a list and allow the user to select one."
  },
  "waiting-location": {
    "message": "Waiting for location...",
    "description": "Displayed while waiting for the device location to be determined"
  },
  "units-km": {
    "message": "km",
    "description": "Used when displaying distances in kilometers"
  },
  "units-meters": {
    "message": "meters",
    "description": "Used when displaying distances in meters"
  },
  "compass-check-msg": {
    "message": "There could be a problem reading the compass.<br/><br/>To test it, hold your device flat and turn around in a circle.<br/><br/>When you have turned completely around, tap the button below.",
    "description": "If the orientation of the device can't be determined, this asks the user to turn the device around in a circle to test it"
  },
  "compass-check-fail-msg": {
    "message": "The compass on your device is not reporting the direction. The compass might not be supported by your device, or it might not be working properly.",
    "description": "The device does not have a compass, or it cannot be read correctly"
  },
  "compass-check-ok": {
    "message": "The compass on your device looks OK!",
    "description": "The comass on the device can be read and looks good"
  },
  "location-prompt": {
    "message": "This service needs to use your location. If your browser asks, please allow it.",
    "description": "Notifies the user that they may be asked to share their location"
  },
  "ui-help": {
    "message": "Help",
    "description": "Menu item to display the help information"
  },
  "ui-satellite": {
    "message": "Satellite",
    "description": "Menu item to change the map imagery between satellite and the road map"
  },
  "ui-language": {
    "message": "Language",
    "description": "Menu item to display the list of UI languages"
  },
  "ui-feedback": {
    "message": "Feedback",
    "description": "Menu item to display the form to provide feedback"
  },
  "ui-github": {
    "message": "View project",
    "description": "Menu item to view the project source code on Github"
  },
  "dismiss": {
    "message": "Dismiss",
    "description": "Button used in dialog windows to dismiss them"
  },
  "help-01-0": {
    "message": "<h2>Your own personal postcode</h2><p>plus+codes are short codes for any location, anywhere. You can use them to guide people to your exact location, fast and reliably.</p>",
    "description": "First help page explaining what plus+codes are"
  },
  "help-02-0": {
    "message": "<h2>What is a plus+code?</h2><p>A plus+code is a short code made up of six or seven letters and numbers, like <b>$EXAMPLE_CODE$</b>, or combined with a town or city like this <b>$EXAMPLE_CODE$ Nairobi</b>.</p><p>They let you give someone an exact location that doesn't depend on street names or building numbers.</p>",
    "description": "Help page section",
    "placeholders": {
      "EXAMPLE_CODE": {
        "content": "MQRG+59"
      }
    }
  },
  "help-02-1": {
    "message": "<h2>How do I find out where a plus+code is?</h2><p>When you enter a plus+code (<b>$EXAMPLE_CODE$</b>) on your phone or computer, it will find the nearest match. This will return the correct location as long as you are within about 40 kilometers of the place.</p><p>If you are further away, use the town or city name (<b>$EXAMPLE_CODE$ Nairobi</b>), or enter the plus+code including the region code (<b>$FULL_CODE$</b>).</p>",
    "description": "Help page section",
    "placeholders": {
      "EXAMPLE_CODE": {
        "content": "MQRG+59"
      },
      "FULL_CODE": {
        "content": "6GCRMQRG+59"
      }
    }
  },
  "help-02-2": {
    "message": "<h2>Do I need to apply for a plus+code?</h2><p>No, plus+codes already exist for everywhere and anyone can use them for free.</p><p>To get the plus+code for a place just drag the map to highlight the place you want.</p>",
    "description": "Help page section"
  },
  "help-03-0": {
    "message": "<h2>What are the parts of the code?</h2><p>For our example code <b>$FULL_CODE$</b>, <b>$CODE_PART_1$</b> is the region code (roughly 100 x 100 kilometers). <b>$CODE_PART_2$</b> is the city code (5 x 5 kilometers). <b>$CODE_PART_3$</b> is the neighbourhood code (250 x 250 meters). After the <b>+</b>, <b>$CODE_PART_4$</b> is the building code (14 x 14 meters). It can be followed by a single digit door code, if the building size code extends over more than one building.</p><p>Usually, the region code isn't needed, and sometimes you will be able to drop the city code as well.</p>",
    "description": "Help page section giving the structure of the codes",
    "placeholders": {
      "FULL_CODE": {
        "content": "6GCRMQRG+59"
      },
      "CODE_PART_1": {
        "content": "6GCR"
      },
      "CODE_PART_2": {
        "content": "MQ"
      },
      "CODE_PART_3": {
        "content": "RG"
      },
      "CODE_PART_4": {
        "content": "59"
      }
    }
  },
  "help-03-1": {
    "message": "<h2>Does a location have more than one plus+code?</h2><p>No. Any place only has one plus+code.</p>",
    "description": "Help page section"
  },
  "help-03-2": {
    "message": "<h2>Can I save them?</h2><p>To save a plus+code, just create a bookmark for the page. When you open the bookmark, it will show you the place.</p>",
    "description": "Help page section"
  },
  "help-03-3": {
    "message": "<h2>Can I use this when I don't have a network?</h2><p>Yes! After you have loaded this page on your phone or computer, it will keep a copy and let you load it even without a network connection.</p>",
    "description": "Help page section telling the user that it should work offline"
  },
  "help-03-4": {
    "message": "<h2>Can I get directions?</h2><p>There is a compass mode that shows you the direction and distance from where you are to the current plus+code. The main menu has links to different map providers you can use.</p>",
    "description": "Help page section"
  },
  "help-03-5": {
    "message": "<h2>My plus+code area is too large!</h2><p>If you zoom in further, the code will be for a smaller area.</p>",
    "description": "Help page section"
  },
  "help-03-6": {
    "message": "<h2>The address you show is wrong!</h2><p>The address given is just a suggestion. It is used to reduce the length of the code you need to use. You can try other addresses in the search box.</p>",
    "description": "Help page section"
  },
  "feedback-detail": {
    "message": "Send feedback. Let us know what you like, or what is not working and we'll try to improve.",
    "description": "Message"
  }
};
