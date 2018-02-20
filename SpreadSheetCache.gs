/**
 * class to cache the SpreadsheetApp
 * @return {[type]} [description]
 */
SpreadSheetCache = function() {
  var activeSheet = null,
    activeRange = null,
    activeCell = null,
    activeSpreadSheet = null,
    activeSheetValues = null,
    activeSheetName=null,
    activeLastColumn=null;





  /**
   * Returns a two-dimensional array of values, indexed by row, then by column for the whole sheet
   * @return {array} a two-dimensional array of values
   */
  this.getActiveSheetValues = function() {
      var s;
      if (!activeSheetValues) {
          s = this.getActiveSheet();
          activeSheetValues = s.getSheetValues(1, 1, s.getLastRow(), s.getLastColumn());
      }
      return activeSheetValues;
  };

  /**
   * Gets the active sheet in a spreadsheet
   * @return {object} the active sheet in the spreadsheet
   */
  this.getActiveSheet = function() {
    activeSheet = activeSheet || this.getActiveSpreadsheet().getActiveSheet();
    return activeSheet;
  };

  /**
   * Returns the currently active spreadsheet, or null if there is none.
   * @return {object}  the active Spreadsheet object
   */
  this.getActiveSpreadsheet = function() {
    activeSpreadSheet = activeSpreadSheet || SpreadsheetApp.getActiveSpreadsheet();
    return activeSpreadSheet;
  };

  /**
   * Returns the active range for the active sheet. Returns the range of cells that is currently considered active.
   * @return {object} the active range
   */
  this.getActiveRange = function() {
    activeRange = activeRange || this.getActiveSheet().getActiveRange();
    return activeRange;
  };

  /**
   * Returns the active cell in this sheet.
   * @return {object} the active cell
   */
  this.getActiveCell = function() {
    activeCell = activeCell || this.getActiveSheet().getActiveCell();
    return activeCell;
  };


  /**
   * Returns the name of the sheet
   * @return {string} the name of the sheet
   */
  this.getActiveSheetName=function(){
      return (activeSheetName = activeSheetName || this.getActiveSheet().getName());
  };


  /**
   * Returns the position of the last column that has content.
   * @return {number} the last column of the sheet that contains content
   */
  this.getActiveSheetLastColumn=function(){
      return (activeLastColumn = activeLastColumn || this.getActiveSheetValues()[0].length);
  };


};
