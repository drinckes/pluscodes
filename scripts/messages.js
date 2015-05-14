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
 * Get strings depending on the browser language setting.
 *
 * This has all the messages for the UI defined. Each message is defined for
 * all the languages, keeping all the definitions together. This is in contrast
 * to other localisation methods that have separate files per language. We need
 * to load everything, so that it's cached, so there's no benefit in splitting
 * the messages across multiple files. Having all local versions of a message
 * next to each other makes it easier to notice when messages change.
 *
 * @this Messages
 */
// Global var that holds all the messages for all the languages.
LocalisedMessages = {};
function Messages() {
  // Default language.
  this.language = 'en';

  // Work out which of our supported languages we'll use. If we have a stored
  // preference, use that, otherwise use the preferred language list for the
  // browser, or use the browser language settings.
  if (DataStore.has(Messages.LANGUAGE_PREF)) {
    this.language = DataStore.get(Messages.LANGUAGE_PREF);
  } else if ('languages' in navigator) {
    // If we have a preferred language list for the browser.
    for (var index in navigator.languages) {
      if (navigator.languages[index] in LocalisedMessages) {
        this.language = LocalisedMessages[navigator.languages[index]];
        break;
      }
      var index = navigator.languages[index].substr(0, 2);
      if (index in LocalisedMessages) {
        this.language = LocalisedMessages[index];
        break;
      }
    }
  } else {
    // Use the browser language setting.
    var language = navigator.language || navigator.userLanguage;
    if (language in LocalisedMessages) {
      // We have an entry for the browser language.
      this.language = LocalisedMessages[language];
    } else if (language.substr(0, 2) in LocalisedMessages) {
      // Try just the first two characters of the browser language.
      this.language = LocalisedMessages[language.substr(0, 2)];
    }
  }
}

// Datastore tag.
Messages.LANGUAGE_PREF = 'language_pref';

/** Set the language. */
Messages.prototype.setLanguage = function(language) {
  console.log('setting language to ' + language);
  if (language in LocalisedMessages) {
    this.language = language;
    DataStore.putString(Messages.LANGUAGE_PREF, language);
    return true;
  }
  console.log('nope');
  return false;
};

/**
  Get the message for the passed key in the current language. If it doesn't
  exist, returns null.
  @param {string} key The message key to fetch.
  @param {Array<string>} params A dict of name/value pairs to try to substitute
      into the message text.
  @return {string} the message or null if the message key doesn't exist.
 */
Messages.prototype.get = function(key, params) {
  var message = this.getWithLanguage(this.language, key, params);
  if (message !== null) {
    return message;
  }
  if (this.language != "en") {
    // Fallback to English.
    return this.getWithLanguage('en', key, params);
  }
  return null;
};

/**
  Get the message for the passed key in the specified language. If it doesn't
  exist, returns the message in English, or null if it doesn't exist.
  @param {string} key The message key to fetch.
  @param {Array<string>} params A dict of name/value pairs to try to substitute
      into the message text.
  @return {string} the message or null if the message key doesn't exist.
 */
Messages.prototype.getWithLanguage = function(language, key, params) {
  if (language in LocalisedMessages && key in LocalisedMessages[language]) {
    var message = LocalisedMessages[language][key]["message"];
    // Are there default placeholders?
    if ("placeholders" in LocalisedMessages[language][key]) {
      var placeholders = LocalisedMessages[language][key]["placeholders"];
      for (var placeholder in placeholders) {
        var regex = new RegExp("\\$" + placeholder + "\\$", 'g');
        var content = placeholders[placeholder]["content"];
        message = message.replace(regex, content);
      }
    }
    // Substitute in the passed params into the placeholders.
    for (var param in params) {
      var regex = new RegExp("\\$" + param + "\\$", 'g');
      message = message.replace(regex, params[param]);
    }
    return message;
  }
  return null;
};
