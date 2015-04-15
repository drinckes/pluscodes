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
  Provide methods to store and retrieve simple data.

  This uses the HTML5 localstore. If not available, falls back to cookies.
 */
function DataStore() {}

DataStore.has = function(key) {
  if (DataStore._localStorage() && DataStore._localStorageGet(key) != null) {
    return true;
  }
  if (DataStore._cookieGet(key) != null) {
    return true;
  }
  return false;
};

DataStore.get = function(key) {
  var value = null;
  if (DataStore._localStorage()) {
    value = DataStore._localStorageGet(key);
    if (value != null) {
      return value;
    }
  }
  value = DataStore._cookieGet(key);
  // Should we move this from a cookie into localstorage?
  if (value !== null && DataStore._localStorage()) {
    DataStore._localStoragePut(key, value);
    DataStore._cookieClear(key);
  }
  return value;
};

/**
  Save a string. If localstoreonly is true, the data will not fallback to
  the cookie store.
 */
DataStore.putString = function(key, value, localstoreonly) {
  if (typeof localstoreonly === 'undefined') {
    localstoreonly = false;
  }
  if (DataStore._localStorage()) {
    DataStore._localStoragePut(key, value);
    return;
  }
  if (localstoreonly) {
    return;
  }
  DataStore._cookiePut(key, value);
};

DataStore.clear = function(key) {
  if (DataStore._localStorage()) {
    DataStore._localStorageClear(key);
  }
  DataStore._cookieClear(key);
};

DataStore._cookiePut = function(key, value) {
  document.cookie = key + '=' + value + '; path=/';
};

DataStore._cookieGet = function(key) {
  var keyEQ = key + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(keyEQ) == 0) {
      return c.substring(keyEQ.length, c.length);
    }
  }
  return null;
};

DataStore._cookieClear = function(key) {
  var value = DataStore._cookieGet(key);
  if (value === null) {
    return;
  }
  var date = new Date();
  date.setTime(date.getTime() - (1 * 24 * 60 * 60 * 1000));
  var expires = 'expires=' + date.toGMTString();
  var cookie = key + '=' + value + '; ' + expires + '; path=/';
  document.cookie = cookie;
};

DataStore._localStorage = function() {
  if ('localStorage' in window && window['localStorage'] !== null) {
    return true;
  }
  return false;
};

DataStore._localStoragePut = function(key, value) {
  localStorage[key] = value;
};

DataStore._localStorageGet = function(key) {
  if (!key in localStorage) {
    return null;
  }
  return localStorage[key];
};

DataStore._localStorageClear = function(key) {
  if (!key in localStorage) {
    return null;
  }
  localStorage.removeItem(key);
};
