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


  //---------------------------------------------------------
  /**
	 * return firebase url to be update/fetched
	 * @param  {string} firebase node
     * @param  {string} auth token
	 */
  //---------------------------------------------------------
  this.getFirebaseUrl=function(jsonPath,userToken) {
    /*
    We then make a URL builder
    This takes in a path, and
    returns a URL that updates the data in that path
    */
    return 'https://'+dbName+'.firebaseio.com/' + jsonPath + '.json?auth=' + userToken;
};
  //---------------------------------------------------------
  // END  return firebase url to be update/fetched
  //---------------------------------------------------------


  //---------------------------------------------------------
  /**
	 * write data on firebase
	 * @param  {string} data to save
     * @param  {string} firebase note where to save
     * @param  {string} auth token
	 */
  //---------------------------------------------------------
  this.writeOnFirebase = function(data,saveNode,userToken){
    var options = {
      'method': 'put',
      'contentType': 'application/json',
      'payload': JSON.stringify(data),
     'muteHttpExceptions' : true
    };

    var fireBaseUrl = this.getFirebaseUrl(saveNode,userToken);

    var response=UrlFetchApp.fetch(fireBaseUrl, options);

    if (response.getResponseCode()!==200) {
        Utility.sendErrorEmails(
            "method: FirebaseConnector.writeOnFirebase()\n\n"+
            "response.getResponseCode(): "+response.getResponseCode()+"\n\n"+
            "savenode: "+savenode+"\n\n"+
            "data:"+data+"\n\n"+
            "getAllHeaders(): "+JSON.stringify(response.getAllHeaders())+"\n\n"+
            "getContentText(): "+response.getContentText()+"\n\n"
        );
    }

};
  //---------------------------------------------------------
  // END  write data on firebase
  //---------------------------------------------------------


  //---------------------------------------------------------
  /**
	 * fetch data from Firebase
     * @param  {string} firebase note where to fetch
     * @param  {string} auth token
     * @return {json}   data fetched
	 */
  //---------------------------------------------------------
  this.getFireBaseData= function(node,userToken) {
    var options = {
     'muteHttpExceptions' : true
    };
   var fireBaseUrl = this.getFirebaseUrl(node,userToken);
   var ft= UrlFetchApp.fetch(fireBaseUrl, options);

   if (ft.getResponseCode()!==200) {
       Utility.sendErrorEmails(
           "method: FirebaseConnector.getFireBaseData()\n\n"+
           "ft.getResponseCode(): "+ft.getResponseCode()+"\n\n"+
           "node: "+node+"\n\n"+
           "getAllHeaders(): "+JSON.stringify(ft.getAllHeaders())+"\n\n"+
           "getContentText(): "+ft.getContentText()+"\n\n"
       );
   }

   return ft.toString();
  };

};
