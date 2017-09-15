var FirebaseConnector=function(dbName){


    /**
     * setter for the firebase token
     * @param  {string} token
     */
    this.setToken = function( token ) {
      //Utilities.sleep(300);
        PropertiesService.getUserProperties().setProperty("tokenFireBase", token);
    };

    this.getToken = function(  ) {
        return PropertiesService.getUserProperties().getProperty("tokenFireBase");
    };


  /**
	 * return firebase url to be update/fetched
	 * @param  {string} firebase node
     * @param  {string} auth token
	 */
  this.getFirebaseUrl=function(jsonPath,userToken) {
    /*
    We then make a URL builder
    This takes in a path, and
    returns a URL that updates the data in that path
    */
    return 'https://'+dbName+'.firebaseio.com/' + jsonPath + '.json?auth=' + userToken;
};


  /**
	 * write data on firebase
	 * @param  {object} data data to save NOT PARSED
     * @param  {string} saveNode firebase note where to save
     * @param  {string} userToken auth token
     * @param  {function} onError error callback with two params: responseCode, and error description
     * @return {number} the HTTP status code (200 for OK, etc.) of an HTTP response.
	 */
  this.writeOnFirebase = function(data,saveNode,userToken, onError){
    onError=(onError || function(){});
    var responseCode,options = {
      'method': 'put',
      'contentType': 'application/json',
      'payload': JSON.stringify(data),
     'muteHttpExceptions' : true
    };

    var fireBaseUrl = this.getFirebaseUrl(saveNode,userToken);

    var response=UrlFetchApp.fetch(fireBaseUrl, options);
    responseCode=response.getResponseCode();

    if (responseCode!==200) {
        Utility.sendErrorEmails(
            "method: FirebaseConnector.writeOnFirebase()\n\n"+
            "response.getResponseCode(): "+response.getResponseCode()+"\n\n"+
            "saveNode: "+saveNode+"\n\n"+
            "data:"+data+"\n\n"+
            "getAllHeaders(): "+JSON.stringify(response.getAllHeaders())+"\n\n"+
            "getContentText(): "+response.getContentText()+"\n\n"
        );
        onError(responseCode, JSON.parse(response.toString()).error);        
    }

    return responseCode;

};


  /**
   * fetch data from Firebase
   * @param  {string} firebase note where to fetch
   * @param  {string} auth token
   * @param  {function} onError error callback with two params: responseCode, and error description
   * @return {string}   data fetched NOT PARSED
   */
  this.getFireBaseData = function( node, userToken, onError ) {
    onError=(onError || function(){});
  	var options = {
  		'muteHttpExceptions': true
  	};
  	var fireBaseUrl = this.getFirebaseUrl( node, userToken );
    var ft = UrlFetchApp.fetch( fireBaseUrl, options );
    var responseCode=ft.getResponseCode();

  	if ( responseCode !== 200 ) {
  		Utility.sendErrorEmails(
  			"method: FirebaseConnector.getFireBaseData()\n\n" +
  			"ft.getResponseCode(): " + ft.getResponseCode() + "\n\n" +
  			"node: " + node + "\n\n" +
  			"getAllHeaders(): " + JSON.stringify( ft.getAllHeaders() ) + "\n\n" +
  			"getContentText(): " + ft.getContentText() + "\n\n"
  		);
        onError(responseCode, JSON.parse(ft.toString()).error);
        return null;
  	}

  	return ft.toString();
  };


    /**
     * fetch data from Firebase
     * @param  {string} firebase note where to fetch
     * @param  {string} auth token
     * @param  {function} onError error callback with two params: responseCode, and error description
     * @return {object}   data fetched PARSED
     */
    this.getFireBaseDataParsed = function( node, userToken, onError ) {
      onError=(onError || function(){});
    	var options = {
    		'muteHttpExceptions': true
    	};
    	var fireBaseUrl = this.getFirebaseUrl( node, userToken );
      var ft = UrlFetchApp.fetch( fireBaseUrl, options );
      var responseCode=ft.getResponseCode();

    	if ( responseCode !== 200 ) {
    		Utility.sendErrorEmails(
    			"method: FirebaseConnector.getFireBaseData()\n\n" +
    			"ft.getResponseCode(): " + ft.getResponseCode() + "\n\n" +
    			"node: " + node + "\n\n" +
    			"getAllHeaders(): " + JSON.stringify( ft.getAllHeaders() ) + "\n\n" +
    			"getContentText(): " + ft.getContentText() + "\n\n"
    		);
          onError(responseCode, JSON.parse(ft.toString()).error);
          return null;
    	}

    	return JSON.parse(ft.toString());
    };

}; 
