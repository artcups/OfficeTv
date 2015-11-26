var fs = require("fs"),
    jsmin = require('jsmin').jsmin;

var Config = (function(){
    parseConfig = function(path) {
      return JSON.parse(jsmin(fs.readFileSync(path).toString()));
    }
    return {
        slack: (function() {
            var path = "./configs/slack.json";
            return parseConfig(path)
        })(),
		questions: (function() {
            var path = "./configs/questions.json";
            return parseConfig(path)
        })()
    }
})()

exports.Config = Config;