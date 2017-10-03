UtilityClass=function(){

   /**
    * converts column number to column letter
    * @param  {number} number the number of the column (column A is 1)
    * @return {string}        the letter of the column (column A is 1)
    * @deprecated use ConvertA1.indexToColA1
    */
   this.numToChar = function(number)    {
           return ConvertA1.indexToColA1(number);
       };


  /**
   * show a msgBox
   * @param  {string} message the message
   * @return {bool} false if error
   */
  this.popUpAlert = function (message) {
    if (!message) {
        return false;
    }
    Browser.msgBox(message);
};

  /**
   * converts column letter to column number
   * @param  {string} column letter
   * @return {integer} column number
   * @deprecated use Convert.colA1ToIndex
   */
  this.letterToColumn = function(letter)
  {
    var column = 0, length = letter.length;
    for (var i = 0; i < length; i++)
    {
      column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
};


  /**
   * FIND A VALUE INTO A ROW OF A SPECIFIC RANGE
   * @param  {string} value
   * @param  {range}  range of the row where search
   * @return {string} number of column containing the string
   */
  this.findValueIntoRow = function(value,range){
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var data = sheet.getRange(range).getValues();


    for(var i = 0; i<data[0].length;i++){
      if(data[0][i] == value){
        return i+1;
      }
    }
   };


  /**
   * FIND A VALUE INTO A ROW OF A SPECIFIC RANGE
   * @param  {string} value
   * @param  {range}  range of the row where search
   * @return {ARRAY}  RETURN AN ARRAY OF ALL THE OCCURENCY OF THE STRING SEARCHED
   */
  this.findValueIntoRowMultipeResult = function(value,range){
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var data = sheet.getRange(range).getValues();

    var res =[];

    for(var i = 0; i<data[0].length;i++){
      if(data[0][i] == value){
        res.push(i+1);
      }
    }
    return res;
   };

  /**
   * EVALUATE A REGEXP TO ANY COLUMN INTO A ROW OF A SPECIFIC RANGE. IT DOESN'T STOPS ON THE FIRST OCCURANCE
   * @param  {RegExp} regexp the regexp to be evaluated
   * @param  {range}  range of the row where search
   * @return {array}  array of number of column containing the string
   */
  this.regexEvalIntoRow = function(regexp,range){
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var data = sheet.getRange(range).getValues();

    var result=[];

    for(var i = 0; i<data[0].length;i++){
      if(regexp.test(data[0][i])){
        result.push(i+1);
      }
    }

    return result;
   };


  /**
   * make a toast on the screen
   * @param  {string}  title of toast
   * @param  {string}  text of toast
   */
  this.toastInfo= function(text1,text2){
      // Show a popup with the title "Status" and the message "Task started".
      SpreadsheetApp.getActiveSpreadsheet().toast(text1, text2);
  };

  /**
   * get GoogleSheetID
   * @return {string} GoogleSheetID
   */
  this.getGoogleSheetID= function(){
	  return SpreadsheetApp.getActive().getId(); //current spreadsheet
  };

    /**
     * check if a given cell is in a range
     * @param  {string} range the range  eg: F14:G34, B:D
     * @param  {range|string} cell  the cell to check or A1Notation for better performance
     * @return {bool}       true if the cell is in the range, false otherwise
     */
    this.isInRange = function(range, cell) {
          var editRange, thisRow,thisCol, cellIndex, cellA1;

          if(typeof cell!=="string") {
              cellA1=cell.getA1Notation();
          }
          else {
              cellA1=cell;
          }

          editRange=ConvertA1.rangeA1ToIndex(range,1);
          cellIndex=ConvertA1.cellA1ToIndex(cellA1,1);

          // Exit if we're out of range
          thisRow = cellIndex.row;
          if ((editRange.top) && (editRange.top) && (thisRow < editRange.top || thisRow > editRange.bottom)) {
              return false;
          }

          thisCol = cellIndex.col;
          if (thisCol < editRange.left || thisCol > editRange.right) {
              return false;
          }

          return true;

      };


      /**
       * check if a given cell is in any of a set of ranges
       * @param  {[string]} ranges  array of the range  eg: [F14:G34, B:D]
       * @param  {range|string} cell  the cell to check or A1Notation for better performance
       * @return {bool}       true if the cell is in any range, false otherwise
       */
      this.isInAnyRange = function( ranges, cell ) {
      	var cellA1, r;

      	if ( !ranges || !cell ) {
      		return false;
      	}

      	if ( typeof cell !== "string" ) {
      		cellA1 = cell.getA1Notation();
      	} else {
      		cellA1 = cell;
      	}

      	for ( var i = ranges.length; i--; ) {
      		r = ranges[ i ];

      		if ( this.isInRange( r, cellA1 ) ) {
      			return true;
      		}
      	}

      	return false;
      };



    /**
     * get the acitve cell value (useful for sidebar and dialog)
     * @return {object} the value in the cell
     */
    this.getActiveCellValue = function() {
      return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getActiveCell().getValue();
    };


  /**
  * workaround that allows you to call any library function if you paste in this one generic wrapper function. Then you can call this from the spreadsheet.
  * For example, if I had a library called MyLib with a function add(x, y) (pretend x is in cell A1 and y is in cell A2) I could call it like this: =LIB_FUNC("MyLib", "add", A1, A2).
  * @param       {string} functionName
  * @constructor
  */
  this.LIB_FUNC=function(functionName) {
    var currFn=this;
    var extraArgs = [];
    var fnArr=functionName.split(".");

    var fnArr_length=fnArr.length;
    for (var i = 0; i<fnArr_length; i++) {
      currFn=currFn[fnArr[i]];

      if(!currFn) throw "No such function: " + fnArr[i];
    }

    if (arguments.length > 1) {
      extraArgs = Array.apply(null, arguments).slice(1);
    }

    return currFn.apply(this, extraArgs);
  };

  /**
   * sets the value of the current cell
   * @param  {string} value the value to set
   */
  this.setCellValue=function(range, value){
      var cell=SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(range);

      if(!cell) return;

      cell.setValue(value);
  };

  /**
   * includes html files into an html
   * @param  {string} filename
   * @return {string}          the content
   */
  this.include=function(filename) {
    return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
  };


  /**
   * sends a debug email message
   * @param  {string} message debug info to send
   * @param  {string} errorEmail email to send the error
   */
   this.sendErrorEmails = function( message, errorEmail ) {
       	var ss = SpreadsheetApp.getActiveSpreadsheet();
       	var sheet = ss.getActiveSheet();
       	var activeRange = sheet.getActiveRange();

        if (!errorEmail) {
            return;
        }

       	try {
       		throw new Error();
       	} catch ( ex ) {
       		var title = "Error message in spreadsheet: " + ss.getName();
       		body = "<b>Spreadsheet</b>: <a href='" + ss.getUrl() + "'>" + ss.getName() + "</a><br>" +
       			"<b>Sheet</b>:" + sheet.getName() + "<br>" +
       			"<b>Error message</b>: " + message + "<br>" +
       			"<b>Current range</b>: " + activeRange.getA1Notation() + "<br>" +
       			"<b>Current user</b>:" + Session.getActiveUser().getEmail() + "<br>" +
       			"<b>Stacktrace</b>: " + ex.stack;

       		MailApp.sendEmail( {
       			to: errorEmail,
       			subject: title,
       			htmlBody: body
       		});
       	}
   };


    /**
     * Returns a two-dimensional array of values, indexed by row, then by column. Same as Range.getValues() but faster and works on an array rappresenting the sheet data.
     * @param  {array} sheetValues all the data in the sheet. from first column to the last
     * @param  {string} range       range in A1Notation
     * @return {array}             a two-dimensional array of values,  indexed by row, then by column
     */
    this.getRangeValuesFromArray = function(sheetValues, range) {
          var rangeIndexes, rangeVals, row, rows, _i, _len;
          rangeVals = [];
          rangeIndexes = ConvertA1.rangeA1ToIndex(range);
          rows = sheetValues.slice(rangeIndexes.top, rangeIndexes.bottom+1);
          for (_i = 0, _len = rows.length; _i < _len; _i++) {
            row = rows[_i];
            rangeVals.push(row.slice(rangeIndexes.left, rangeIndexes.right+1));
          }
          return rangeVals;
    };

    /**
     * Returns the value of a cell. Same as Range.getValue() but faster and works on an array rappresenting the sheet data.
     * @param  {array} sheetValues all the data in the sheet. from first column to the last
     * @param  {string} cellA1       cell in A1Notation
     * @return {string}             the value
     */
    this.getCellValueFromArray = function(sheetValues, cellA1) {
          var cellIndexes;

          cellIndexes = ConvertA1.cellA1ToIndex(cellA1);

          return sheetValues[cellIndexes.row][cellIndexes.col];
    };

  /**
   * copy all sheets from a Spreadsheet to another. !!IMPORTANT!! has to be completed
   * @param  {string} sourceId the source id
   */
  this.copyAllSheetsHere = function( sourceId ) {
  	var dest, destSheets, source, sourceSheets, _i, _j, _len, _len1, _sheet;
  	source = SpreadsheetApp.openById( 'YYYYYY' );
  	dest = SpreadsheetApp.getActiveSpreadsheet();
  	sourceSheets = source.getSheets();
  	destSheets = source.getSheets();

  	//copyt new sheets
  	for ( _i = 0, _len = sourceSheets.length; _i < _len; _i++ ) {
  		_sheet = sourceSheets[ _i ];
  		_sheet.copyTo( dest );
  		//TODO set the correct name of the sheet
  		//TODO hide the sheet if is a template (in the AmisMarketApp)
  	}

  	//delete old sheets
  	for ( _j = 0, _len1 = destSheets.length; _j < _len1; _j++ ) {
  		_sheet = destSheets[ _j ];
  		dest.deleteSheet( _sheet );
  	}
  };


  /**
   * Interpolace string with keys with the object
   * with key values passed
   *
   * @param   {string} text                        string to be interpolated
   * @param   {object} keyValue                    object with key values to subtitute on the string
   * @param   {Regexp} [delimiter=/{{([^{}]*)}}/g] regexp that defines the delimiter, default is {{word}}
   *
   * @returns {string} The interpolated string
   *
   * @example
   *
   * var interpolated = interpolate('Hello {{name}}, it is me {{daemon}}.', {
   * 	name: 'Lyra',
   *   daemon: 'pantalaimon'
   * });
   *
   * console.log(interpolated === 'Hello Lyra, it is me pantalaimon.')
   */
  this.interpolate=function(text, keyValues, delimiter) {
      delimiter = delimiter || /{{([^{}]*)}}/g;
      return text.replace(
      		delimiter,
          function (matched, key) {
              var value = keyValues[key];
              return typeof value === 'string' || typeof value === 'number' ? value : matched;
          }
      );
  };


  /**
   * Make a string's first character uppercase
   * @param  {string} str
   * @return {string}
   */
  this.ucfirst = function( str ) {
  	return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
  };



};

Utility=new UtilityClass();
