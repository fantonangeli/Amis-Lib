/**
 * Class to interact with Google API CacheService
 * @param  {number} defaultExpirationInSeconds (optional) the maximum time the value will remain in the cache, in seconds. The minimum is 1 second and the maximum is 21600 seconds (6 hours). Default is 600
 * @return {object}                            
 */
APPCache=function(defaultExpirationInSeconds){
	defaultExpirationInSeconds=(defaultExpirationInSeconds || 600);
	var cache = CacheService.getUserCache();

	/**
	 * Adds a key/value pair to the cache. 
	 * @param  {string} key                 The maximum length of a key is 250 characters.
	 * @param  {object} val                 The maximum amount of data that can be stored per key is 100KB.
	 * @param  {number} expirationInSeconds (optional) the maximum time the value will remain in the cache. Default is defaultExpirationInSeconds
	 */
	this.put= function(key, val, expirationInSeconds) {
		expirationInSeconds=(expirationInSeconds || defaultExpirationInSeconds);
		if((val===null) || (val===undefined))return null;
		cache.put(key, JSON.stringify(val), expirationInSeconds);
	};

	/**
	 * Gets the cached value for the given key, or null if none is found. 
	 * @param  {string} key                 The maximum length of a key is 250 characters.
	 * @return {object}     the object already parsed
	 */
	this.get= function(key) {
		val=cache.get(key);
		if((val===null) || (val===undefined))return null;
		return JSON.parse(val);
	};

	/**
	 * Removes an entry from the cache using the given key. 
	 * @param  {string} key                 The maximum length of a key is 250 characters.
	 */
	this.remove=function(key) {
		cache.remove(key);
	};
};