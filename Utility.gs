UtilityClass = function( devMode, errorEmail ) {
   devMode = ( devMode || false );


   /**
    * Copies the data from a range of cells to another range calculated by offset. Both the values and formatting are copied. 
    * It can be improved for better performance, without using GAS api
    * @param  {object} sheet         the sheet
    * @param  {string} from         the range to return, as specified in A1 notation or R1C1 notation
    * @param  {number} rowOffset    (optional) number of rows down from the range's top-left cell; negative values represent rows up from the range's top-left cell
    * @param  {number} columnOffset (optional) number of columns right from the range's top-left cell; negative values represent columns left from the range's top-left cell
    * @return {object}              the new range
    * @throws {InvalidArgument}
    * @throws {InvalidOffset} If the offset exceed the range
    */
   this.A1Offset=function(sheet, a1Range, rowOffset, columnOffset){
       rowOffset=(rowOffset || 0);
       columnOffset=(columnOffset || 0);

       if (!sheet || !a1Range) {
           throw "InvalidArgument";
       }


       fromRange=sheet.getRange(a1Range);
       try{
           toRange=fromRange.offset(rowOffset, columnOffset);
       } catch ( ex ) {
           var e=ex;
           throw "InvalidOffset";
       }


       return toRange.getA1Notation();
   };

   /**
    * Copies the data from a range of cells to another range calculated by offset. Both the values and formatting are copied.
    * @param  {object} sheet         the sheet
    * @param  {string} from         the range to return, as specified in A1 notation or R1C1 notation
    * @param  {number} rowOffset    number of rows down from the range's top-left cell; negative values represent rows up from the range's top-left cell    * @param  {number} columnOffset number of columns right from the range's top-left cell; negative values represent columns left from the range's top-left cell
    * @return {object}              the new range
    */
   this.copyToOffset=function(sheet, from, rowOffset, columnOffset){

       fromRange=sheet.getRange(from);
       toRange=fromRange.offset(rowOffset, columnOffset);
       fromRange.copyTo(toRange);

       return toRange;
   };


   /**
    * get the range with only the columns in A1Notation from another range
    * @param  {string} range the range in A1Notation
    * @return {string}       the new range in A1Notation
    * @throws {InvalidArgument}
    */
   this.getRangeColumns=function(range){
       var exRange;
       if (!range) {
           throw "InvalidArgument";
       }

       exRange=/^([A-Z]+)\d+:([A-Z]+)\d+$/.exec(range);

		if(!exRange) {
			throw "InvalidRange";
		}

        return exRange[1]+":"+exRange[2];

   };



   /**
    * converts column number to column letter
    * @param  {number} number the number of the column (column A is 1)
    * @return {string}        the letter of the column (column A is 1)
    * @deprecated use ConvertA1.indexToColA1
    */
   this.numToChar = function( number ) {
      return ConvertA1.indexToColA1( number );
   };


   /**
    * show a msgBox
    * @param  {string} message the message
    * @return {bool} false if error
    */
   this.popUpAlert = function( message ) {
      if ( !message ) {
         return false;
      }
      Browser.msgBox( message );
   };

   /**
    * converts column letter to column number
    * @param  {string} column letter
    * @return {integer} column number
    * @deprecated use Convert.colA1ToIndex
    */
   this.letterToColumn = function( letter ) {
      var column = 0,
         length = letter.length;
      for ( var i = 0; i < length; i++ ) {
         column += ( letter.charCodeAt( i ) - 64 ) * Math.pow( 26, length - i - 1 );
      }
      return column;
   };


   /**
    * FIND A VALUE INTO A ROW OF A SPECIFIC RANGE
    * @param  {string} value
    * @param  {range}  range of the row where search
    * @return {string} number of column containing the string
    */
   this.findValueIntoRow = function( value, range ) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

      var data = sheet.getRange( range ).getValues();


      for ( var i = 0; i < data[ 0 ].length; i++ ) {
         if ( data[ 0 ][ i ] == value ) {
            return i + 1;
         }
      }
   };


   /**
    * FIND A VALUE INTO A ROW OF A SPECIFIC RANGE
    * @param  {string} value
    * @param  {range}  range of the row where search
    * @return {ARRAY}  RETURN AN ARRAY OF ALL THE OCCURENCY OF THE STRING SEARCHED
    */
   this.findValueIntoRowMultipeResult = function( value, range ) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

      var data = sheet.getRange( range ).getValues();

      var res = [];

      for ( var i = 0; i < data[ 0 ].length; i++ ) {
         if ( data[ 0 ][ i ] == value ) {
            res.push( i + 1 );
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
   this.regexEvalIntoRow = function( regexp, range ) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

      var data = sheet.getRange( range ).getValues();

      var result = [];

      for ( var i = 0; i < data[ 0 ].length; i++ ) {
         if ( regexp.test( data[ 0 ][ i ] ) ) {
            result.push( i + 1 );
         }
      }

      return result;
   };


   /**
    * make a toast on the screen
    * @param  {string}  title of toast
    * @param  {string}  text of toast
    */
   this.toastInfo = function( text1, text2 ) {
      // Show a popup with the title "Status" and the message "Task started".
      SpreadsheetApp.getActiveSpreadsheet().toast( text1, text2 );
   };

   /**
    * get GoogleSheetID
    * @return {string} GoogleSheetID
    */
   this.getGoogleSheetID = function() {
      return SpreadsheetApp.getActive().getId(); //current spreadsheet
   };


   /**
    * check if a given string is a valid cell
    * @param  {string} range the range in A1A1Notation
    * @return {bool}       true if yes, false otherwise
    * @throws {InvalidArgument}
    */
   this.isCell=function(range){
       if (!range) {
           throw "InvalidArgument";
       }
      return /^[A-Z]+\d+$/.test(range);
   };


   /**
    * check if a given string is a valid range
    * @param  {string} range the range in A1A1Notation
    * @return {bool}       true if yes, false otherwise
    * @throws {InvalidArgument}
    */
   this.isRange=function(range){
       if (!range) {
           throw "InvalidArgument";
       }
      return /^([A-Z]+\d+:[A-Z]+\d+|[A-Z]+:[A-Z]+|\d+:\d+)$/.test(range);
   };



   /**
    * check if two given ranges are touched by are touched by each other
    * @param  {string} rangeA the range  eg: F14:G34, B:D
    * @param  {string} rangeB the range  eg: F14:G34, B:D
    * @return {bool}       true if the cell is in the range, false otherwise
    * @throws {InvalidArgument}
    */
   this.isRangesOverlap = function( rangeA, rangeB ) {
      var ra, rb;

      if ( !rangeA || !rangeB ) {
         throw "InvalidArgument";
      }

      ra = ConvertA1.rangeA1ToIndex( rangeA, 1 );
      rb = ConvertA1.rangeA1ToIndex( rangeB, 1 );



      // If one rectangle is on left side of other
      if ( ra.left > rb.right || rb.left > ra.right ) {
         return false;
      }

      // If one rectangle is above other
      if ( ra.top > rb.bottom || rb.top > ra.bottom ) {
         return false;
      }

      return true;

   };


   /**
    * check if a given cell is in a range
    * @param  {string} range the range  eg: F14:G34, B:D
    * @param  {range|string} cell  the cell to check or A1Notation for better performance eg. F12
    * @return {bool}       true if the cell is in the range, false otherwise
    */
   this.isInRange = function( range, cell ) {
      var editRange, thisRow, thisCol, cellIndex, cellA1;

      if ( typeof cell !== "string" ) {
         cellA1 = cell.getA1Notation();
      } else {
         cellA1 = cell;
      }

      editRange = ConvertA1.rangeA1ToIndex( range, 1 );
      cellIndex = ConvertA1.cellA1ToIndex( cellA1, 1 );

      // Exit if we're out of range
      thisRow = cellIndex.row;
      if ( ( editRange.top ) && ( editRange.top ) && ( thisRow < editRange.top || thisRow > editRange.bottom ) ) {
         return false;
      }

      thisCol = cellIndex.col;
      if ( thisCol < editRange.left || thisCol > editRange.right ) {
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
   this.LIB_FUNC = function( functionName ) {
      var currFn = this;
      var extraArgs = [];
      var fnArr = functionName.split( "." );

      var fnArr_length = fnArr.length;
      for ( var i = 0; i < fnArr_length; i++ ) {
         currFn = currFn[ fnArr[ i ] ];

         if ( !currFn ) throw "No such function: " + fnArr[ i ];
      }

      if ( arguments.length > 1 ) {
         extraArgs = Array.apply( null, arguments ).slice( 1 );
      }

      return currFn.apply( this, extraArgs );
   };

   /**
    * sets the value of the current cell
    * @param  {string} value the value to set
    */
   this.setCellValue = function( range, value ) {
      var cell = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange( range );

      if ( !cell ) return;

      cell.setValue( value );
   };

   /**
    * includes html files into an html
    * @param  {string} filename
    * @return {string}          the content
    */
   this.include = function( filename ) {
      return HtmlService.createTemplateFromFile( filename ).evaluate().getContent();
   };


   /**
    * sends a debug email message
    * @param  {string} message debug info to send
    * @param  {string} to (optional)email to send the error, if not defined errorEmail will taken
    */
   this.sendErrorEmails = function( message, to ) {
      to = ( to || errorEmail );
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getActiveSheet();
      var activeRange = sheet.getActiveRange();

      if ( devMode || !to ) {
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
            "<b>Stacktrace</b>: " + ex.stack;

         MailApp.sendEmail( {
            to: to,
            subject: title,
            htmlBody: body
         } );
      }
   };


   /**
    * Returns a two-dimensional array of values, indexed by row, then by column. Same as Range.getValues() but faster and works on an array rappresenting the sheet data.
    * @param  {array} sheetValues all the data in the sheet. from first column to the last
    * @param  {string} range       range in A1Notation
    * @return {array}             a two-dimensional array of values,  indexed by row, then by column
    */
   this.getRangeValuesFromArray = function( sheetValues, range ) {
      var rangeIndexes, rangeVals, row, rows, _i, _len;
      rangeVals = [];
      rangeIndexes = ConvertA1.rangeA1ToIndex( range );
      rows = sheetValues.slice( rangeIndexes.top, rangeIndexes.bottom + 1 );
      for ( _i = 0, _len = rows.length; _i < _len; _i++ ) {
         row = rows[ _i ];
         rangeVals.push( row.slice( rangeIndexes.left, rangeIndexes.right + 1 ) );
      }
      return rangeVals;
   };

   /**
    * Returns the value of a cell. Same as Range.getValue() but faster and works on an array rappresenting the sheet data.
    * @param  {array} sheetValues all the data in the sheet. from first column to the last
    * @param  {string} cellA1       cell in A1Notation
    * @return {string}             the value
    */
   this.getCellValueFromArray = function( sheetValues, cellA1 ) {
      var cellIndexes;

      cellIndexes = ConvertA1.cellA1ToIndex( cellA1 );

      return sheetValues[ cellIndexes.row ][ cellIndexes.col ];
   };

   /**
    * Executes a provided function once for each sheet of a spreadsheet.
    * @param  {string} sourceId (optional) the source id, if not defined will be taken the current spreadsheet
    * @param  {RegExp} regexSheetName regular expression to copy only mathcing sheets name. eg /^Template_.+/
    * @param  {Function} callback       Function to execute for each element, taking 2 arguments: sheet, sheetName
    * @throws  {SheetNotFound} if no sheet is found
    */
   this.forEachSheet = function( sourceId, regexSheetName, callback ) {
      var source, sourceSheets, _sheetName, _i, _j, _len, _sheet;

      regexSheetName = ( regexSheetName || /.*/ );

      if ( !callback ) {
         return false;
      }

      try {
         source = ( sourceId ) ? SpreadsheetApp.openById( sourceId ) : SpreadsheetApp.getActiveSpreadsheet();
      } catch ( e ) {
         throw "SheetNotFound";
      }

      sourceSheets = source.getSheets();

      for ( _i = 0, _len = sourceSheets.length; _i < _len; _i++ ) {
         _sheet = sourceSheets[ _i ];
         _sheetName = _sheet.getName();

         if ( regexSheetName.test( _sheetName ) ) {
            callback( _sheet, _sheetName );
         }

      }
   };


   /**
    * execute a callback for each row in a sheet
    * @param  {objecy}   sheet    the sheet
    * @param  {Function} callback Function to execute for each element, taking 2 arguments: sheet, row number
    * @return {void}
    * @throws {InvalidArgument}
    */
   this.forEachRow = function( sheet, callback ) {
      if ( !sheet || !callback ) {
         throw "InvalidArgument";
      }

      for ( var i = 1, rows_length = sheet.getLastRow(); i <= rows_length; i++ ) {
         callback( sheet, i );
      }
   };


   /**
    * execute a callback for each column in a sheet
    * @param  {objecy}   sheet    the sheet
    * @param  {Function} callback Function to execute for each element, taking 2 arguments: sheet, column number
    * @return {void}
    * @throws {InvalidArgument}
    */
   this.forEachColumn = function( sheet, callback ) {
      if ( !sheet || !callback ) {
         throw "InvalidArgument";
      }

      for ( var i = 1, cols_length = sheet.getLastColumn(); i <= cols_length; i++ ) {
         callback( sheet, i );
      }
   };

   /**
    * delete all mathcing sheet
    * @return {void}
    * @param  {RegExp} regexSheetName regular expression to copy only mathcing sheets name. eg /^Template_.+/
    * @throws {InvalidArgument}
    */
   this.deleteMatchingSheets = function( regexSheetName ) {
      var spreadsheet;

      if ( !regexSheetName ) {
         throw "InvalidArgument";
      }

      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

      this.forEachSheet( null, regexSheetName, function( sheet, sheetName ) {
         spreadsheet.deleteSheet( sheet );
      } );
   };

   /**
    * copy all sheets from a Spreadsheet to another. !!IMPORTANT!! has to be completed
    * @param  {string} sourceId the source id
    * @param  {RegExp} regexSheetName regular expression to copy only mathcing sheets name. eg /^Template_.+/
    * @return {void}
    * @throws {InvalidArgument}
    */
   this.copyAllSheetsHere = function( sourceId, regexSheetName ) {
      var dest, destSheets;
      regexSheetName = ( regexSheetName || /.*/ );
      dest = SpreadsheetApp.getActiveSpreadsheet();
      destSheets = dest.getSheets();

      if ( !sourceId ) {
         throw "InvalidArgument";
      }

      this.forEachSheet( sourceId, regexSheetName, function( sheet, sheetName ) {
         dest.deleteSheet( dest.getSheetByName( sheetName ) );
         sheet.copyTo( dest ).setName( sheetName );
      } );
   };




   /**
    * Interpolace string with keys with the object
    * with key values passed
    *
    * @param   {string} text                        string to be interpolated
    * @param   {object} keyValue                    object with key values to subtitute on the string
    * @param   {RegExp} [delimiter=/{{([^{}]*)}}/g] regexp that defines the delimiter, default is {{word}}
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
   this.interpolate = function( text, keyValues, delimiter ) {
      delimiter = delimiter || /{{([^{}]*)}}/g;
      return text.replace(
         delimiter,
         function( matched, key ) {
            var value = keyValues[ key ];
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


   /**
    * execute a callback for each named range in a spreadSheet
    * @param  {object}   spreadSheet the spreadSheet
    * @param  {Function} callback    callback to run. Taking 1 argument: the named range
    * @return {void}
    * @throws "InvalidArgument"
    */
   this.forEachNamedRange = function( spreadSheet, callback ) {
      var nRanges;

      spreadSheet = spreadSheet || SpreadSheetCache.getActiveSpreadsheet();

      if ( !spreadSheet ) {
         throw "InvalidArgument";
      }

      nRanges = spreadSheet.getNamedRanges();

      for ( var i = 0, nRanges_length = nRanges.length, e; i < nRanges_length; i++ ) {
         e = nRanges[ i ];
         callback( e );
      }
   };

   /**
    * delete all namedRange in a spreadSheet
    * @param  {object}   spreadSheet the spreadSheet
    * @return {void}
    * @throws "InvalidArgument"
    */
   this.deleteAllNamedRanges = function( spreadSheet ) {
      if ( !spreadSheet ) {
         throw "InvalidArgument";
      }

      this.forEachNamedRange( spreadSheet, function( r ) {
         r.remove();
      } );

   };

   /**
    * copy all namedRange from a spreadSheet to another one
    * @param  {object} dest   destination spreadSheet
    * @param  {object} source source spreadSheet
    * @return {void}
    * @throws "InvalidArgument"
    */
   this.copyAllNamedRanges = function( dest, source ) {
      source = source || SpreadSheetCache.getActiveSpreadsheet();

      if ( !dest ) {
         throw "InvalidArgument";
      }

      this.forEachNamedRange( source, function( r ) {
         var rName, a1n, sheetName, destRange;
         rName = r.getName();
         sheetName = r.getRange().getSheet().getName();
         a1n = r.getRange().getA1Notation();
         destRange = dest.getRange( sheetName + "!" + a1n );

         dest.setNamedRange( rName, destRange );
      } );

   };

   /**
    * copy all spreadsheet values from a spreadsheet to another
    * @param  {string} from            the spreadsheet id where values are
    * @param  {string} to              the spreadsheet id where to write values
    * @param  {RegExp} sheetNameFilter (optional) regex to choose what sheet copy
    * @return {void}
    * @throws "InvalidArgument"
    * @throws "SheetNotFound" if the sheet in the destination spreadsheet is not found
    */
   this.copyAllSpreadSheetValues = function( from, to, sheetNameFilter ) {
      sheetNameFilter = ( sheetNameFilter || /.*/ );
      var toSpreadSheet;

      if ( !from || !to ) {
         throw "InvalidArgument";
      }

      toSpreadSheet = SpreadsheetApp.openById( to );

      Utility.forEachSheet( from, sheetNameFilter, function( fromSheet, sheetName ) {
         var toSheet, fromValues;

         toSheet = toSpreadSheet.getSheetByName( sheetName );

         if ( !toSheet ) {
            throw "SheetNotFound";
         }

         fromValues = fromSheet.getDataRange().getValues();

         //write the data to the destination
         toSheet.getDataRange().setValues( fromValues );
      } );
   };

   /**
    * Returns the position of the last column that has content.
    * @param  {string} sheet (optional) the sheet name
    * @return {number} the last column of the sheet that contains content
    * @throws {InvalidArgument}
    * @throws {SheetNotFound}
    */
   this.getLastColumn = function( sheet ) {
      if ( !sheet ) {
         throw "InvalidArgument";
      } else if ( typeof sheet === 'string' ) {
         sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( sheet );

         if ( !sheet ) {
            throw "SheetNotFound";
         }

         return sheet.getLastColumn();
      }
   };

};

Utility = new UtilityClass();
