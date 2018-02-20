/**
 * Class to interact with Google API CacheService
 * @param  {number} defaultExpirationInSeconds (optional) the maximum time the value will remain in the cache, in seconds. The minimum is 1 second and the maximum is 21600 seconds (6 hours). Default is 600
 * @return {object}                            
 */
APPCache=function(defaultExpirationInSeconds){
	defaultExpirationInSeconds=(defaultExpirationInSeconds || 600);
	var cache = CacheService.getDocumentCache();
    this.keysListName = "_keysListName";

    /**
     * gets the list of the keys from the cache
     *
     * @returns {[string]} the keys list
     */
    this.getKeyList=function(){
        var keylist;

        keylist=this.get(this.keysListName);

        return (keylist || []);
    };

    /**
     * store a key in the keylist
     *
     * @param {string} key the key 
     * @returns {void}
     * @throws InvalidArgument
     */
    this.putKeyList=function(key) {
        var kl;

        if (!key) {
            throw "InvalidArgument";
        }

        kl=this.getKeyList();

        kl.push(key);

        cache.put(this.keysListName, JSON.stringify(kl));
    };


    /**
     * remove (empty) the keylist
     *
     * @returns {void}
     */
    this.removeKeyList=function() {
        this.remove(this.keysListName);
    };

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

        this.putKeyList(key);
	};

	/**
	 * Gets the cached value for the given key, or null if none is found. 
	 * @param  {string} key                 The maximum length of a key is 250 characters.
	 * @return {object}     the object already parsed
	 */
	this.get= function(key) {
        var val;
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



    
    /**
     * remove all entries from the cache
     *
     * @returns {void}
     */
    this.removeAll=function(){
        var keyList;

        keyList=this.getKeyList();

        cache.removeAll(keyList);

        this.removeKeyList();
        
    };
    

    
};
