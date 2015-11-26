
var Helper = (function(){
    function Helper(){};
    Helper.prototype = {
        bold: function(text){
            return "*" + text + "*";
        },
		italic: function(text){
			return "_" + text + "_";
		}
		
    }
    return Helper;
})()

exports.Helper = Helper;