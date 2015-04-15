


/**
  Basic cache to store addresses from the geocoder to try to reduce the
  lookup frequency.
  @this SimpleCache
 */
function SimpleCache() {
  this.cache = {};
}

/**
  Check if a key exists in the cache.
  @param {string} key The key to check.
  @return {boolean} True if the key exists, otherwise false.
 */
SimpleCache.prototype.has = function(key) {
  return key in this.cache;
};


/**
  Get the value for a key.
  @param {string} key The key to retrieve.
  @return {*} The value or null if the key isn't present.
 */
SimpleCache.prototype.get = function(key) {
  return this.cache[key];
};


/**
  Put a key and value pair into the cache.
  @param {string} key The key.
  @param {*} value The value to place into the cache.
 */
SimpleCache.prototype.put = function(key, value) {
  this.cache[key] = value;
};
