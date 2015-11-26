
var Helper = (function(){
    function Helper(){};
    Helper.prototype = {
        parsePostData: function(postData){
            postObj = {};
            var postArray = postData.toString().split("&");
            postArray.forEach(function(val, key){
                post = val.split("=");
                postObj[post[0]] = post[1];
            })
            return postObj;
        }
    }
    return Helper;
})()

exports.Helper = Helper;