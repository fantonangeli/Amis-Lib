/**
 * This class override some methods of the GAS Range class for better performance and more utilities
 * See {@link https://developers.google.com/apps-script/reference/spreadsheet/range Range} for functions documentation
 * @param  {string} A1Notation the range in A1Notation
 * @return {object}
 */
AmisRange=function(A1Notation){
    if (!A1Notation) {
        throw "InvalidArgument";
    }

    this.A1A1Notation=A1Notation;

    this.getNumColumns=function(){
        var rangeIndex;

        if(/^[A-Z]+\d+$/.test(this.A1A1Notation)){
            return 1;
        }

        if(/^[A-Z]+\d+:[A-Z]+\d+$/.test(this.A1A1Notation)){
            rangeIndex=ConvertA1.rangeA1ToIndex(this.A1A1Notation);
            
            return rangeIndex.right-rangeIndex.left+1;
        }

        throw "InvalidRange";
    };


};
