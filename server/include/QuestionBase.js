var QuestionBase = (function(){
	var _dataLayer;
	
	function QuestionBase(dataLayer){
		_dataLayer = dataLayer;
	}
	function GetQuestion(date, callback){
		var query = "SELECT Id, Question, Date FROM tQuestion WHERE Date = $date";
		var params = { $date: date };
		_dataLayer.dbGetAll(query, function(question){
			if (question.length > 0){
				callback(question);
			}
			else {
				console.log("GetQuestion failed, date was: " + new Date(date)); 
			}
		}, params);
	}
	function PutQuestion(text, answers, callback) {
		var qQuery = "INSERT INTO tQuestion VALUES($text)";
		var qParams = { $text: text };
		_dataLayer.dbPut(qQuery, function(err){
			if (err){
				console.log("Answer failed, got error: " + err);
				callback("Something went wrong, go fishing!");
			}
			else {
				callback();
			}
		}, qParams);
		answers.forEach(function(answer){
			var aQuery = "INSERT INTO tAnswer VALUES($text, (SELECT Id FROM tQuestion ORDER BY ID DESC LIMIT 1))"
			var aParams = { $date: date };
		})
		
		_dataLayer.dbGetAll(query, function(question){
			if (question.length > 0){
				callback(question);
			}
			else {
				console.log("GetQuestion failed, date was: " + new Date(date)); 
			}
		}, params);
	}
	function Answer(questionId, answerId, slackUserId, callback){
		var query = "INSERT INTO tQuestionAnswer VALUES ($answerId, $slackUserId, $questionId);
		var params = { $answerId: answerId, $slackUserId: slackUserId, $questionId: questionId };
		_dataLayer.dbPut(query, function(err){
			if (err){
				console.log("Answer failed, got error: " + err);
				callback("Something went wrong, go fishing!");
			}
			else {
				callback();
			}
		}, params);
	}
})();

exportes.QuestionBase = QuestionBase;